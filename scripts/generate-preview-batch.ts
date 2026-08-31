import { createHash } from "node:crypto";
import { mkdir, open, readFile, readdir, rename, unlink } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

import { z } from "zod";

import { reviewGeneratedDraft } from "../src/lib/draft-review";
import { reviewEditorialQuality } from "../src/lib/editorial-quality";
import { generatedStoryV2ResponseSchema, parseGeneratedStoryV2, type GeneratedStoryV2, type StoryDraftV2PromptInput } from "../src/lib/generation-contract";
import { LocalGenerationLedger, type LedgerReceipt } from "../src/lib/local-generation-ledger";
import { createStoryDraft, OPENROUTER_STORY_MODEL, type GenerationReservationRequest, type ReserveStoryAttempt, type StoryDraftResult } from "../src/lib/openrouter-story-client";
import { promoteGeneratedStory } from "../src/lib/promote-generated-story";
import { readerStoryIndexItemSchema, readerStorySchema, type ReaderStory } from "../src/lib/reader-story-schema";
import { sourcePackSchema, validatePreviewSourcePack, type SourcePack } from "../src/lib/source-pack";

const PILOT_CAP_PAISE = 10_000;
const INR_PER_USD = 100;
const DEFAULT_LEDGER_PATH = ".syat-private/generation-ledger.json";
const DEFAULT_SOURCE_PACK_PATH = "data/source-packs/approved-preview.json";
const MODEL_METADATA_URL = "https://openrouter.ai/api/v1/models";
const PROMPT_VERSION = "syat.story-draft.v2";
const promptPriceCeiling = 0.000000065;
const completionPriceCeiling = 0.00000018;

type PaidAttemptRequest = Pick<GenerationReservationRequest, "attempt" | "estimatedPaise" | "previousReservationIds">;

type PaidGenerationResult<T> = {
  value: T;
  actualCostUsd: number;
  promptTokens: number;
  completionTokens: number;
  outputHash: string;
};

export type PaidGenerationRun<T> =
  | ({ kind: "generated" } & PaidGenerationResult<T>)
  | { kind: "reused"; outputHash: string };

export async function runPaidGeneration<T>({
  ledger,
  inputHash,
  month,
  generate,
  jobCommittedPaise = 0,
  jobCapPaise
}: {
  ledger: LocalGenerationLedger;
  inputHash: string;
  month: string;
  generate: (reserveAttempt: (request: PaidAttemptRequest) => Promise<unknown>) => Promise<PaidGenerationResult<T>>;
  jobCommittedPaise?: number;
  jobCapPaise?: number;
}): Promise<PaidGenerationRun<T>> {
  const prior = await ledger.getByInputHash(inputHash);
  if (prior?.state === "completed") return { kind: "reused", outputHash: prior.outputHash! };
  if (prior?.state === "failed" && prior.errorCode !== "transient_provider_error") {
    throw new Error("Generation input previously failed permanently; change the input before another paid attempt.");
  }

  let activeReceipt: LedgerReceipt | undefined;
  let completedAttemptCount = prior ? prior.attempt : 0;
  let committed = jobCommittedPaise;
  const reserveAttempt = async (providerRequest: PaidAttemptRequest) => {
    if (activeReceipt) {
      await ledger.fail(activeReceipt, "transient_provider_error");
      committed += activeReceipt.estimatedPaise;
      activeReceipt = undefined;
      completedAttemptCount += 1;
    }
    const ledgerAttempt = completedAttemptCount + 1;
    const receipt = await ledger.reserve({
      inputHash,
      estimatedPaise: providerRequest.estimatedPaise,
      attempt: ledgerAttempt,
      month,
      retryReason: ledgerAttempt === 1 ? "new_input" : "transient_provider_error",
      jobCommittedPaise: committed,
      ...(jobCapPaise === undefined ? {} : { jobCapPaise })
    });
    activeReceipt = receipt;
    return {
      reservationId: receipt.reservationId,
      reservationPaise: receipt.reservationPaise,
      authoritativeTotalPaise: receipt.authoritativeTotalPaise,
      budgetStatus: receipt.budgetStatus
    };
  };

  try {
    const result = await generate(reserveAttempt);
    if (!activeReceipt) throw new Error("The provider returned without a durable reservation; no output can be accepted.");
    await ledger.complete(activeReceipt, {
      actualCostUsd: result.actualCostUsd,
      promptTokens: result.promptTokens,
      completionTokens: result.completionTokens,
      outputHash: result.outputHash
    });
    return { kind: "generated", ...result };
  } catch (error) {
    if (activeReceipt) {
      const transient = error instanceof Error && /(?:timeout|timed out|did not return|network|fetch failed|429|5\d\d|temporar|internal server|service unavailable|bad gateway|rate limit)/i.test(error.message);
      await ledger.fail(activeReceipt, transient ? "transient_provider_error" : "generation_failed");
    }
    throw error;
  }
}

const modelMetadataResponseSchema = z.object({
  data: z.array(z.object({
    id: z.string(),
    context_length: z.number().int().positive(),
    supported_parameters: z.array(z.string()),
    pricing: z.object({ prompt: z.string(), completion: z.string() }).passthrough()
  }).passthrough())
}).passthrough();

export function validateOpenRouterModelMetadata(value: unknown) {
  const response = modelMetadataResponseSchema.parse(value);
  const model = response.data.find((candidate) => candidate.id === OPENROUTER_STORY_MODEL);
  if (!model) throw new Error(`The required OpenRouter model ${OPENROUTER_STORY_MODEL} is unavailable.`);
  if (!model.supported_parameters.some((parameter) => parameter === "structured_outputs" || parameter === "response_format")) {
    throw new Error("The live OpenRouter model does not advertise structured output support.");
  }
  if (model.context_length < 48_000) throw new Error("The live OpenRouter model context is below the reviewed prompt ceiling.");
  const promptPrice = Number(model.pricing.prompt);
  const completionPrice = Number(model.pricing.completion);
  if (!Number.isFinite(promptPrice) || !Number.isFinite(completionPrice) || promptPrice < 0 || completionPrice < 0 || promptPrice > promptPriceCeiling || completionPrice > completionPriceCeiling) {
    throw new Error("The live OpenRouter model price exceeds the reviewed reservation estimate.");
  }
  return model;
}

const batchArgumentsSchema = z.object({
  pilot: z.boolean(),
  start: z.number().int().nonnegative(),
  count: z.number().int().positive().max(10),
  sourcePackPath: z.string().min(1),
  ledgerPath: z.string().min(1)
}).strict();

type BatchArguments = z.infer<typeof batchArgumentsSchema>;

function readArgumentValue(args: string[], index: number, label: string) {
  const value = args[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${label} requires a value.`);
  return value;
}

export function parseBatchArguments(args: string[]): BatchArguments {
  const parsed: BatchArguments = { pilot: false, start: 0, count: 10, sourcePackPath: DEFAULT_SOURCE_PACK_PATH, ledgerPath: DEFAULT_LEDGER_PATH };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--pilot") parsed.pilot = true;
    else if (argument === "--start") parsed.start = Number(readArgumentValue(args, index++, "--start"));
    else if (argument === "--count") parsed.count = Number(readArgumentValue(args, index++, "--count"));
    else if (argument === "--source-packs") parsed.sourcePackPath = readArgumentValue(args, index++, "--source-packs");
    else if (argument === "--ledger") parsed.ledgerPath = readArgumentValue(args, index++, "--ledger");
    else throw new Error(`Unknown preview batch argument: ${argument}`);
  }
  const checked = batchArgumentsSchema.parse(parsed);
  if (checked.pilot && (checked.start !== 0 || checked.count !== 6)) throw new Error("The pilot is exactly six stories starting at source pack 0.");
  return checked;
}

const sourcePackFileSchema = z.array(sourcePackSchema).min(1).max(500);
const newsIndexSchema = z.object({
  contractVersion: z.literal("syat.reader-story-index.v1"),
  generatedAt: z.iso.datetime(),
  items: z.array(readerStoryIndexItemSchema).max(100)
}).strict().superRefine((index, ctx) => {
  const slugs = new Set<string>();
  for (const [position, item] of index.items.entries()) {
    if (slugs.has(item.slug)) ctx.addIssue({ code: "custom", message: `News index slug ${item.slug} is repeated.`, path: ["items", position, "slug"] });
    slugs.add(item.slug);
  }
});

const waveReportSchema = z.object({
  contractVersion: z.literal("syat.generation-wave-report.v1"),
  waveId: z.string().regex(/^[a-z0-9-]+$/),
  generatedAt: z.iso.datetime(),
  status: z.literal("passed"),
  start: z.number().int().nonnegative(),
  count: z.number().int().positive().max(10),
  model: z.literal(OPENROUTER_STORY_MODEL),
  promptVersion: z.literal(PROMPT_VERSION),
  spentPaise: z.number().int().nonnegative(),
  actualPaise: z.number().int().nonnegative(),
  conservativeFailedPaise: z.number().int().nonnegative(),
  reservedPaise: z.number().int().nonnegative(),
  inrPerUsd: z.literal(INR_PER_USD),
  items: z.array(z.object({
    sourcePackId: z.string().min(1).max(100),
    slug: z.string().min(1).max(80),
    inputHash: z.string().regex(/^[a-f0-9]{64}$/),
    outputHash: z.string().regex(/^[a-f0-9]{64}$/),
    reused: z.boolean(),
    warnings: z.array(z.string().min(1).max(80)).max(20),
    scores: z.object({
      clarity: z.number().int().min(1).max(5),
      usefulness: z.number().int().min(1).max(5),
      evidenceDiscipline: z.number().int().min(1).max(5),
      indiaRelevance: z.number().int().min(1).max(5),
      humanVoice: z.number().int().min(1).max(5),
      perspectiveQuality: z.number().int().min(1).max(5),
      sourceTransparency: z.number().int().min(1).max(5)
    }).strict()
  }).strict()).min(1).max(10)
}).strict();

function stableInputHash(input: StoryDraftV2PromptInput) {
  return createHash("sha256").update(JSON.stringify({ model: OPENROUTER_STORY_MODEL, promptVersion: PROMPT_VERSION, input })).digest("hex");
}

function outputHash(draft: GeneratedStoryV2) {
  return createHash("sha256").update(JSON.stringify(draft)).digest("hex");
}

function currentIndiaMonth(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit" }).formatToParts(now);
  return `${parts.find((part) => part.type === "year")?.value}-${parts.find((part) => part.type === "month")?.value}`;
}

function draftInputFor(pack: SourcePack, position: number): StoryDraftV2PromptInput {
  const formats: StoryDraftV2PromptInput["format"][] = ["explainer", "timeline", "public_impact", "source_map", "news_brief"];
  return {
    sourcePackId: pack.id,
    language: "en-IN",
    mode: "news",
    format: formats[position % formats.length],
    editorialBrief: "Write a useful 350–800 word India-first private-preview story. Explain the concrete change, what the supplied record supports, who is associated, the timeline, and what evidence is missing. Keep mediaPlan empty; the only visual is the required Syāt-authored visual.",
    indiaConnection: pack.indiaConnection,
    sourceRoles: pack.sources.map((source) => ({ sourceId: source.id, role: source.sourceKind === "official_statement" ? "Records the issuing institution's own account; it does not independently verify that account." : "Provides reusable public-record evidence within its recorded licence and scope." })),
    missingVoices: ["Independent reporting or measurement", "People directly affected by the change", "Evidence that tests the issuing institution's account"],
    sourceDossier: pack.sources
  };
}

function authoredVisualApproval(draft: GeneratedStoryV2, reviewedAt: string): ReaderStory["media"][number] {
  const mediaId = `authored-${draft.sourcePackId}-${draft.authoredVisual.kind}`;
  return {
    id: mediaId,
    kind: draft.authoredVisual.kind === "relationship_map" ? "illustration" : "chart",
    label: draft.authoredVisual.title,
    alt: `${draft.authoredVisual.title}. ${draft.authoredVisual.description}`,
    caption: draft.authoredVisual.description,
    creator: "Syāt visual desk",
    creditLine: "Visual: Syāt visual desk; based only on the credited source records.",
    sourceUrl: `https://syat.local/preview/visuals/${mediaId}`,
    rightsBasis: "owned",
    reviewStatus: "approved",
    reviewedAt,
    rightsProof: { kind: "documented_record", recordId: mediaId, note: "Syāt-authored data visual generated only from the cited claim and source paths." },
    limitation: draft.authoredVisual.limitation,
    claimIds: draft.authoredVisual.claimIds,
    sourceIds: draft.authoredVisual.sourceIds
  };
}

async function readJson(path: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error(`JSON at ${path} is malformed and was left untouched.`);
    throw error;
  }
}

async function readOptionalJson(path: string): Promise<unknown | undefined> {
  try {
    return await readJson(path);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return undefined;
    throw error;
  }
}

async function writeNextFile(path: string, value: unknown, validate: (value: unknown) => unknown) {
  validate(value);
  const serialised = `${JSON.stringify(value, null, 2)}\n`;
  validate(JSON.parse(serialised));
  await mkdir(dirname(path), { recursive: true });
  const nextPath = `${path}.next`;
  const handle = await open(nextPath, "w", 0o600);
  try {
    await handle.writeFile(serialised, "utf8");
    await handle.sync();
  } finally {
    await handle.close();
  }
  return nextPath;
}

async function atomicWriteJson(path: string, value: unknown, validate: (value: unknown) => unknown) {
  const nextPath = await writeNextFile(path, value, validate);
  await rename(nextPath, path);
  const directoryHandle = await open(dirname(path), "r");
  try {
    await directoryHandle.sync();
  } finally {
    await directoryHandle.close();
  }
}

async function loadCachedDraft(cachePath: string, pack: SourcePack, input: StoryDraftV2PromptInput) {
  const raw = await readJson(cachePath);
  return parseGeneratedStoryV2(raw, pack.sources, { sourcePackId: pack.id, language: input.language, mode: input.mode, format: input.format, indiaConnection: input.indiaConnection });
}

async function loadPrivateDraftCorpus(cacheDirectory: string) {
  let names: string[];
  try {
    names = await readdir(cacheDirectory);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return [];
    throw error;
  }
  const drafts: Array<{ inputHash: string; draft: GeneratedStoryV2 }> = [];
  for (const name of names.filter((name) => /^[a-f0-9]{64}\.json$/.test(name)).sort()) {
    drafts.push({ inputHash: name.slice(0, -".json".length), draft: generatedStoryV2ResponseSchema.parse(await readJson(join(cacheDirectory, name))) });
  }
  return drafts;
}

async function fetchModelMetadata(fetchImpl: typeof fetch) {
  const response = await fetchImpl(MODEL_METADATA_URL, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(12_000) });
  if (!response.ok) throw new Error(`OpenRouter model metadata check failed with HTTP ${response.status}; no paid request was made.`);
  return validateOpenRouterModelMetadata(await response.json());
}

function paise(value: number) {
  return `₹${(value / 100).toFixed(2)}`;
}

export async function runPreviewBatch(
  options: BatchArguments,
  dependencies: { fetchImpl?: typeof fetch; createDraft?: typeof createStoryDraft } = {}
) {
  const fetchImpl = dependencies.fetchImpl ?? fetch;
  const createDraft = dependencies.createDraft ?? createStoryDraft;
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set in the private environment; no paid request was made.");
  const sourcePacks = sourcePackFileSchema.parse(await readJson(resolve(options.sourcePackPath))).map(validatePreviewSourcePack);
  const selected = sourcePacks.slice(options.start, options.start + options.count);
  if (selected.length !== options.count) throw new Error(`Requested ${options.count} source packs from ${options.start}, but only ${selected.length} are available; no paid request was made.`);
  if (new Set(selected.map((pack) => pack.id)).size !== selected.length) throw new Error("The requested source-pack wave contains duplicate IDs; no paid request was made.");
  if (selected.some((pack) => `authored-${pack.id}-relationship_map`.length > 80)) throw new Error("A source-pack ID is too long for the reviewed authored-visual record; no paid request was made.");
  await fetchModelMetadata(fetchImpl);

  const ledger = new LocalGenerationLedger(resolve(options.ledgerPath));
  const month = currentIndiaMonth();
  const cacheDirectory = resolve(".syat-private/generated-drafts");
  const storyDirectory = resolve("data/stories/news");
  const indexPath = join(storyDirectory, "index.json");
  const reportPath = resolve(options.pilot ? "data/generation-reports/pilot.json" : `data/generation-reports/wave-${options.start}-${options.start + options.count - 1}.json`);
  const waveId = options.pilot ? "pilot" : `wave-${options.start}-${options.start + options.count - 1}`;

  return ledger.withExclusiveLock(async () => {
    const existingIndex = newsIndexSchema.parse(await readJson(indexPath));
    const existingBySlug = new Map(existingIndex.items.map((item) => [item.slug, item]));
    const requestedNewSlugs = selected.map((pack) => pack.id).filter((slug) => !existingBySlug.has(slug));
    if (existingIndex.items.length + requestedNewSlugs.length > 100) throw new Error("This wave would exceed the 100-story private-preview limit; no paid request was made.");
    const corpus = await loadPrivateDraftCorpus(cacheDirectory);
    const baselineCosts = await ledger.summary(month);
    const staged: Array<{ nextPath: string; finalPath: string }> = [];
    const stories: ReaderStory[] = [];
    const reportItems: z.infer<typeof waveReportSchema>["items"] = [];
    let waveSpentPaise = 0;
    let reportNext: string | undefined;
    let indexNext: string | undefined;

    try {
      for (const [offset, pack] of selected.entries()) {
        const input = draftInputFor(pack, options.start + offset);
        const inputHash = stableInputHash(input);
        const cachePath = join(cacheDirectory, `${inputHash}.json`);
        const prior = await ledger.getByInputHash(inputHash);
        const budget = await ledger.summary(month);
        const paid = await runPaidGeneration({
          ledger,
          inputHash,
          month,
          jobCommittedPaise: options.pilot ? budget.spentPaise + budget.reservedPaise : waveSpentPaise,
          ...(options.pilot ? { jobCapPaise: PILOT_CAP_PAISE } : {}),
          generate: async (reserveAttempt) => {
            const result: StoryDraftResult = await createDraft({
              apiKey,
              input,
              fetchImpl,
              budget: { spentPaise: budget.spentPaise, reservedPaise: budget.reservedPaise },
              reserveAttempt: ((request: GenerationReservationRequest) => reserveAttempt(request)) as ReserveStoryAttempt,
              maxAttempts: prior ? 1 : 2
            });
            const hash = outputHash(result.draft);
            await atomicWriteJson(cachePath, result.draft, (value) => generatedStoryV2ResponseSchema.parse(value));
            return { value: result, actualCostUsd: result.actualCostUsd, promptTokens: result.usage.promptTokens, completionTokens: result.usage.completionTokens, outputHash: hash };
          }
        });

        let result: StoryDraftResult | undefined;
        let draft: GeneratedStoryV2;
        if (paid.kind === "reused") {
          draft = await loadCachedDraft(cachePath, pack, input);
          if (outputHash(draft) !== paid.outputHash) throw new Error(`Cached generation for ${pack.id} does not match its completed ledger output hash.`);
        } else {
          result = paid.value;
          draft = result.draft;
          waveSpentPaise += Math.ceil(result.actualCostUsd * INR_PER_USD * 100);
        }

        const draftReview = result?.review ?? reviewGeneratedDraft(draft, pack.sources, { indiaConnection: pack.indiaConnection });
        const qualityReview = reviewEditorialQuality(draft, corpus.filter((cached) => cached.inputHash !== inputHash).map((cached) => cached.draft));
        if (draftReview.status === "blocked" || qualityReview.status === "blocked" || qualityReview.blockers.length > 0 || Object.values(qualityReview.scores).some((score) => score < 4)) {
          const codes = [...draftReview.findings.filter((finding) => finding.severity === "blocker").map((finding) => finding.code), ...qualityReview.blockers.map((finding) => finding.code)];
          throw new Error(`Story ${pack.id} did not pass the private-preview quality gate${codes.length > 0 ? ` (${codes.join(", ")})` : " (score below 4)"}.`);
        }
        if (draft.mediaPlan.length > 0) throw new Error(`Story ${pack.id} requested external media and requires a human rights review.`);

        const story = promoteGeneratedStory({
          draft,
          draftReview,
          qualityReview,
          sourcePack: pack,
          approvedMedia: [authoredVisualApproval(draft, new Date().toISOString())]
        });
        readerStorySchema.parse(story);
        const existingCard = existingBySlug.get(story.slug);
        if (existingCard) {
          const existingStory = readerStorySchema.parse(await readJson(join(storyDirectory, `${story.slug}.json`)));
          if (existingStory.generation.inputHash !== story.generation.inputHash) throw new Error(`Existing story ${story.slug} was produced from different input.`);
        } else {
          const finalPath = join(storyDirectory, `${story.slug}.json`);
          const recoverableValue = await readOptionalJson(finalPath);
          if (recoverableValue !== undefined) {
            const recoverableStory = readerStorySchema.parse(recoverableValue);
            if (recoverableStory.generation.inputHash !== story.generation.inputHash) throw new Error(`Unindexed story ${story.slug} was produced from different input and was left untouched.`);
          } else {
            staged.push({ finalPath, nextPath: await writeNextFile(finalPath, story, (value) => readerStorySchema.parse(value)) });
          }
        }
        stories.push(story);
        if (!corpus.some((cached) => cached.inputHash === inputHash)) corpus.push({ inputHash, draft });
        reportItems.push({
          sourcePackId: pack.id,
          slug: story.slug,
          inputHash,
          outputHash: outputHash(draft),
          reused: paid.kind === "reused",
          warnings: [...new Set([...draftReview.findings.filter((finding) => finding.severity !== "blocker").map((finding) => finding.code), ...qualityReview.warnings.map((warning) => warning.code)])],
          scores: qualityReview.scores
        });
        const totals = await ledger.summary(month);
        console.log(`${offset + 1}/${options.count} passed · reserved ${paise(totals.reservedPaise)} · actual ${paise(totals.actualProviderPaise)}`);
      }

      const newCards = stories.filter((story) => !existingBySlug.has(story.slug)).map((story, index) => readerStoryIndexItemSchema.parse({
        slug: story.slug,
        format: story.format,
        title: story.title,
        dek: story.dek,
        theme: story.theme,
        eventTime: story.eventTime,
        updatedAt: story.updatedAt,
        readingMinutes: story.readingMinutes,
        featured: existingIndex.items.length + index < 12
      }));
      const nextIndex = newsIndexSchema.parse({ ...existingIndex, generatedAt: new Date().toISOString(), items: [...existingIndex.items, ...newCards] });
      const previousReportValue = await readOptionalJson(reportPath);
      const previousReport = previousReportValue === undefined ? undefined : waveReportSchema.parse(previousReportValue);
      if (previousReport && newCards.length === 0 && reportItems.every((item) => item.reused)) {
        return waveReportSchema.parse({ ...previousReport, items: previousReport.items.map((item) => ({ ...item, reused: true })) });
      }
      const finalCosts = await ledger.summary(month);
      const actualPaise = Math.max(0, finalCosts.actualProviderPaise - baselineCosts.actualProviderPaise);
      const conservativeFailedPaise = Math.max(0, finalCosts.conservativeFailedPaise - baselineCosts.conservativeFailedPaise);
      const report = waveReportSchema.parse({
        contractVersion: "syat.generation-wave-report.v1",
        waveId,
        generatedAt: new Date().toISOString(),
        status: "passed",
        start: options.start,
        count: options.count,
        model: OPENROUTER_STORY_MODEL,
        promptVersion: PROMPT_VERSION,
        spentPaise: actualPaise + conservativeFailedPaise,
        actualPaise,
        conservativeFailedPaise,
        reservedPaise: Math.max(0, finalCosts.reservedPaise - baselineCosts.reservedPaise),
        inrPerUsd: INR_PER_USD,
        items: reportItems
      });
      reportNext = await writeNextFile(reportPath, report, (value) => waveReportSchema.parse(value));
      indexNext = await writeNextFile(indexPath, nextIndex, (value) => newsIndexSchema.parse(value));
      const committedStoryPaths: string[] = [];
      let indexCommitted = false;
      try {
        for (const file of staged) {
          await rename(file.nextPath, file.finalPath);
          committedStoryPaths.push(file.finalPath);
        }
        await rename(indexNext, indexPath);
        indexCommitted = true;
        await rename(reportNext, reportPath);
      } catch (error) {
        if (indexCommitted) await atomicWriteJson(indexPath, existingIndex, (value) => newsIndexSchema.parse(value));
        await Promise.all(committedStoryPaths.map((path) => unlink(path).catch(() => undefined)));
        if (previousReport) await atomicWriteJson(reportPath, previousReport, (value) => waveReportSchema.parse(value));
        else await unlink(reportPath).catch(() => undefined);
        throw error;
      }
      return report;
    } catch (error) {
      await Promise.all([
        ...staged.map((file) => unlink(file.nextPath).catch(() => undefined)),
        ...(reportNext ? [unlink(reportNext).catch(() => undefined)] : []),
        ...(indexNext ? [unlink(indexNext).catch(() => undefined)] : [])
      ]);
      throw error;
    }
  });
}

async function main() {
  await runPreviewBatch(parseBatchArguments(process.argv.slice(2)));
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath && fileURLToPath(import.meta.url) === invokedPath) {
  void main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Preview batch failed safely.");
    process.exitCode = 1;
  });
}
