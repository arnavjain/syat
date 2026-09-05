import { randomUUID } from "node:crypto";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { reviewGeneratedDraft } from "./draft-review";
import { findCloseCopyMatches, type GeneratedStoryV2 } from "./generation-contract";
import { reviewEditorialQuality } from "./editorial-quality";
import { LocalGenerationLedger } from "./local-generation-ledger";
import { runPaidGeneration, runPreviewBatch, validateOpenRouterModelMetadata } from "../../scripts/generate-preview-batch";
import { buildSmokeInput, makeNonDurableSmokeReservation } from "../../scripts/smoke-openrouter";

const temporaryDirectories: string[] = [];
const month = "2026-08";

async function makeLedger() {
  const directory = await mkdtemp(join(tmpdir(), "syat-ledger-"));
  temporaryDirectories.push(directory);
  const path = join(directory, "generation-ledger.json");
  return { ledger: new LocalGenerationLedger(path), path };
}

const request = {
  inputHash: "a".repeat(64),
  estimatedPaise: 10,
  attempt: 1,
  month,
  retryReason: "new_input" as const
};

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe("LocalGenerationLedger", () => {
  it("writes a reservation before completion and exposes the completed input for reuse", async () => {
    const { ledger, path } = await makeLedger();

    const receipt = await ledger.reserve(request);
    const reservedOnDisk = JSON.parse(await readFile(path, "utf8"));
    expect(reservedOnDisk.attempts).toMatchObject([{ reservationId: receipt.reservationId, state: "reserved", inputHash: request.inputHash }]);

    await ledger.complete(receipt, {
      actualCostUsd: 0.001,
      promptTokens: 100,
      completionTokens: 200,
      outputHash: "b".repeat(64)
    });

    expect(await ledger.getByInputHash(request.inputHash)).toMatchObject({
      state: "completed",
      outputHash: "b".repeat(64),
      actualPaise: 10,
      inrPerUsd: 100
    });
    await expect(ledger.reserve(request)).rejects.toThrow(/completed input/i);
  });

  it("refuses a reservation that reaches the ₹1,400 hard stop", async () => {
    const { ledger } = await makeLedger();
    const seed = await ledger.reserve({ ...request, estimatedPaise: 1 });
    await ledger.complete(seed, {
      actualCostUsd: 13.999,
      promptTokens: 1,
      completionTokens: 1,
      outputHash: "c".repeat(64)
    });

    await expect(ledger.reserve({ ...request, inputHash: "d".repeat(64), estimatedPaise: 10 })).rejects.toThrow(/hard stop/i);
  });

  it("leaves an existing lock untouched and reports its exact path", async () => {
    const { ledger, path } = await makeLedger();
    const lockPath = `${path}.lock`;
    await writeFile(lockPath, "another-owner", "utf8");

    await expect(ledger.reserve(request)).rejects.toThrow(lockPath);
    expect(await readFile(lockPath, "utf8")).toBe("another-owner");
  });

  it("keeps failed attempts and allows only one retry after a transient provider failure", async () => {
    const { ledger } = await makeLedger();
    const first = await ledger.reserve(request);
    await ledger.fail(first, "transient_provider_error");

    const second = await ledger.reserve({ ...request, attempt: 2, retryReason: "transient_provider_error" });
    await ledger.fail(second, "invalid_provider_output");

    expect(await ledger.getByInputHash(request.inputHash)).toMatchObject({ state: "failed", attempt: 2, errorCode: "invalid_provider_output" });
    await expect(ledger.reserve({ ...request, attempt: 3, retryReason: "transient_provider_error" })).rejects.toThrow(/two attempts/i);
    expect((await ledger.summary(month)).failedAttempts).toBe(2);
  });

  it("does not allow a same-input retry after a permanent failure", async () => {
    const { ledger } = await makeLedger();
    const first = await ledger.reserve(request);
    await ledger.fail(first, "invalid_provider_output");

    await expect(ledger.reserve({ ...request, attempt: 2, retryReason: "transient_provider_error" })).rejects.toThrow(/changed input|transient/i);
  });

  it("counts failed unknown charges conservatively and releases completed reservations", async () => {
    const { ledger } = await makeLedger();
    const failed = await ledger.reserve({ ...request, estimatedPaise: 40 });
    await ledger.fail(failed, "transient_provider_error");
    const completed = await ledger.reserve({ ...request, inputHash: "e".repeat(64), estimatedPaise: 80 });
    await ledger.complete(completed, {
      actualCostUsd: 0.001,
      promptTokens: 100,
      completionTokens: 200,
      outputHash: "f".repeat(64)
    });

    expect(await ledger.summary(month)).toMatchObject({
      spentPaise: 50,
      actualProviderPaise: 10,
      reservedPaise: 0,
      conservativeFailedPaise: 40,
      completedAttempts: 1,
      failedAttempts: 1
    });
  });

  it("fails closed without replacing a malformed ledger", async () => {
    const { ledger, path } = await makeLedger();
    await writeFile(path, "{not-json", "utf8");

    await expect(ledger.reserve(request)).rejects.toThrow(/ledger/i);
    expect(await readFile(path, "utf8")).toBe("{not-json");
  });

  it("rejects a shaped ledger that adds another attempt after completed output", async () => {
    const { ledger, path } = await makeLedger();
    const receipt = await ledger.reserve(request);
    await ledger.complete(receipt, { actualCostUsd: 0.001, promptTokens: 1, completionTokens: 1, outputHash: "9".repeat(64) });
    const tampered = JSON.parse(await readFile(path, "utf8"));
    tampered.attempts.push({
      reservationId: randomUUID(),
      inputHash: request.inputHash,
      estimatedPaise: 10,
      attempt: 2,
      month,
      retryReason: "transient_provider_error",
      state: "failed",
      createdAt: "2026-08-31T07:00:00.000Z",
      lockOwnerId: randomUUID(),
      settledAt: "2026-08-31T07:01:00.000Z",
      errorCode: "transient_provider_error",
      conservativeEstimatedPaise: 10
    });
    await writeFile(path, JSON.stringify(tampered), "utf8");

    await expect(ledger.getByInputHash(request.inputHash)).rejects.toThrow(/ledger/i);
  });

  it("holds one owner lock across a group of mutations and removes only that owned lock", async () => {
    const { ledger, path } = await makeLedger();

    await ledger.withExclusiveLock(async () => {
      const receipt = await ledger.reserve(request);
      expect(await readFile(`${path}.lock`, "utf8")).toContain(receipt.lockOwnerId);
      await ledger.fail(receipt, "transient_provider_error");
    });

    await expect(readFile(`${path}.lock`, "utf8")).rejects.toMatchObject({ code: "ENOENT" });
  });
});

describe("preview batch paid-call boundary", () => {
  it("reserves before a fake provider call and reuses its completed input without a second call", async () => {
    const { ledger } = await makeLedger();
    let providerCalls = 0;
    const generate = async (reserveAttempt: Parameters<Parameters<typeof runPaidGeneration<string>>[0]["generate"]>[0]) => {
      providerCalls += 1;
      await reserveAttempt({ attempt: 1, estimatedPaise: 20, previousReservationIds: [] });
      return {
        value: "reviewed-output",
        actualCostUsd: 0.001,
        promptTokens: 100,
        completionTokens: 200,
        outputHash: "1".repeat(64)
      };
    };

    const first = await runPaidGeneration({ ledger, inputHash: "2".repeat(64), month, generate });
    const reused = await runPaidGeneration({ ledger, inputHash: "2".repeat(64), month, generate });

    expect(first).toMatchObject({ kind: "generated", value: "reviewed-output" });
    expect(reused).toMatchObject({ kind: "reused", outputHash: "1".repeat(64) });
    expect(providerCalls).toBe(1);
  });

  it("rejects live model metadata that cannot honour the strict response contract", () => {
    const pricedModel = {
      data: [{
        id: "deepseek/deepseek-v4-flash-0731",
        context_length: 163_840,
        supported_parameters: ["max_tokens"],
        pricing: { prompt: "0.000000065", completion: "0.00000018" }
      }]
    };

    expect(() => validateOpenRouterModelMetadata(pricedModel)).toThrow(/structured/i);
    expect(() => validateOpenRouterModelMetadata({
      data: [{ ...pricedModel.data[0], supported_parameters: ["max_tokens", "response_format"] }]
    })).toThrow(/strict JSON schema|structured/i);
    expect(validateOpenRouterModelMetadata({
      data: [{ ...pricedModel.data[0], supported_parameters: ["max_tokens", "response_format", "structured_outputs"] }]
    })).toMatchObject({ id: "deepseek/deepseek-v4-flash-0731" });
  });
});

describe("paid smoke safety", () => {
  it("uses a complete fictional rights record and an explicitly non-durable reservation", async () => {
    const input = buildSmokeInput();
    expect(input.sourceDossier[0]).toMatchObject({
      sourceKind: "reputable_reporting",
      modelInputAllowed: true,
      mediaReuseAllowed: false,
      rightsBasis: "explicit_licence"
    });

    const reservation = makeNonDurableSmokeReservation();
    expect(await reservation({
      attempt: 1,
      estimatedPaise: 12,
      localDecision: { status: "allowed", reason: "within_monthly_cap", authorisedTotalPaise: 12 },
      previousReservationIds: [],
      promptUtf8Bytes: 100
    })).toMatchObject({ reservationPaise: 12, authoritativeTotalPaise: 12, budgetStatus: "allowed" });
  });
});

describe("preview wave transaction", () => {
  it("uses a fake provider and commits a validated story only after its one-item wave passes", async () => {
    const directory = await mkdtemp(join(tmpdir(), "syat-wave-"));
    temporaryDirectories.push(directory);
    await mkdir(join(directory, "data/source-packs"), { recursive: true });
    await mkdir(join(directory, "data/stories/news"), { recursive: true });
    await writeFile(join(directory, "data/stories/news/index.json"), JSON.stringify({ contractVersion: "syat.reader-story-index.v1", generatedAt: "2026-08-31T00:00:00.000Z", items: [] }), "utf8");
    const sourcePack = {
      contractVersion: "syat.source-pack.v1" as const,
      id: "district-water-review",
      title: "District water offices receive a dated review record",
      indiaConnection: "The official record concerns district water offices and public administration in India.",
      collectedAt: "2026-08-31T06:00:00.000Z",
      sources: [{
        id: "pib-water-note",
        publisherId: "pib",
        publisher: "Press Information Bureau",
        title: "District water review note",
        url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2999999",
        sourceKind: "official_statement" as const,
        publishedAt: "2026-08-31T05:00:00.000Z",
        accessedAt: "2026-08-31T06:00:00.000Z",
        evidenceText: "The ministry record is dated 1 September 2026. It lists a review involving 12 district water offices in India and describes the issuing department's planned administrative checks.",
        linkAllowed: true,
        modelInputAllowed: true,
        mediaReuseAllowed: false,
        rightsBasis: "government_reproduction_policy" as const,
        policyUrl: "https://www.pib.gov.in/Content/102_2_Copyright-Policy.aspx?lang=1&reg=3",
        reviewedAt: "2026-08-31T06:00:00.000Z",
        creditLine: "Source: Press Information Bureau"
      }],
      relatedCoverage: []
    };
    await writeFile(join(directory, "data/source-packs/approved-preview.json"), JSON.stringify([sourcePack]), "utf8");

    const paragraphs = [
      "Twelve district water offices sit at the centre of a ministry review dated 1 September. The public record describes an administrative check, identifies the offices as participants, and places the work inside an Indian government process. It does not show what staff found on the ground. That distinction matters for readers deciding whether this is a completed assessment or the start of one.",
      "The ministry is the only speaking institution in the supplied material. Its note can establish what the department says it plans to examine, which offices it names, and the date attached to that account. The same note cannot independently confirm field conditions, service quality, or residents' experience. Syāt treats each operational detail as an official claim with a narrow recorded scope.",
      "A useful reading starts with the process rather than a promised result. District teams have been placed inside a review structure, while measurements, inspection sheets, and office-level findings remain absent from this source pack. Readers can see the announced sequence without being asked to assume success. Later records would need to show which checks occurred, who conducted them, and what each office documented.",
      "People who depend on a district water office are associated with the subject, but they are not represented in the ministry note. Residents, local workers, and public-service staff may encounter different parts of the system. Their accounts would add experience that an administrative release does not contain. Independent reporting could also compare the stated review method with records kept at a district office.",
      "The date provides one firm point for a simple timeline. First comes the ministry's record on 1 September 2026. After that, the evidence path is open: office checks would need documents, observations, or published measurements before any outcome can be described. There is no supported completion date in the dossier. A visual should mark that blank clearly instead of turning an announced process into a finished result.",
      "For now, the reader can take away a limited but practical picture. The supplied account connects a national department with a dozen local offices, and that description deserves attribution to the issuing body. The source does not settle how services work, whether conditions differ by district, or what residents notice. Those are reporting questions for the next stage, not gaps to be filled with confident language."
    ];
    const draft: GeneratedStoryV2 = {
      contractVersion: "syat.story-draft.v2",
      sourcePackId: sourcePack.id,
      sourceIds: ["pib-water-note"],
      language: "en-IN",
      editorialStatus: "needs_editorial_review",
      format: "explainer",
      story: {
        mode: "news",
        title: "What a district water review record does and does not show",
        dek: "The ministry names 12 offices and a date, while local findings and resident experience remain outside the supplied evidence.",
        theme: "Public services",
        indiaConnection: sourcePack.indiaConnection,
        eventTime: { kind: "exact_date", value: "2026-09-01", label: "1 September 2026" },
        eventTimeEvidence: { claimIds: ["claim-1"], sourceIds: ["pib-water-note"] },
        reframe: { kind: "question", value: "What records would show whether the announced district review happened as described?" }
      },
      bodySections: [
        { id: "record", title: "What the record contains", paragraphs: [{ id: "record-one", text: paragraphs[0], claimIds: ["claim-1"], sourceIds: ["pib-water-note"] }, { id: "record-two", text: paragraphs[1], claimIds: ["claim-1", "claim-2"], sourceIds: ["pib-water-note"] }] },
        { id: "process", title: "How to read the process", paragraphs: [{ id: "process-one", text: paragraphs[2], claimIds: ["claim-1", "claim-2"], sourceIds: ["pib-water-note"] }, { id: "process-two", text: paragraphs[3], claimIds: ["claim-2"], sourceIds: ["pib-water-note"] }] },
        { id: "next", title: "What evidence comes next", paragraphs: [{ id: "next-one", text: paragraphs[4], claimIds: ["claim-1", "claim-2"], sourceIds: ["pib-water-note"] }, { id: "next-two", text: paragraphs[5], claimIds: ["claim-1", "claim-2"], sourceIds: ["pib-water-note"] }] }
      ],
      timeline: [{ id: "record-date", time: { kind: "exact_date", value: "2026-09-01", label: "1 September 2026" }, text: "The supplied ministry record carries this date for the described review process.", claimIds: ["claim-1"], sourceIds: ["pib-water-note"] }],
      statements: [
        { id: "claim-1", type: "documented", basis: "official_claim", text: "The ministry says its review involves 12 district water offices.", sourceIds: ["pib-water-note"], sourceScope: "This is limited to the issuing ministry's description of its administrative process.", limits: "The source does not independently verify implementation or any service outcome." },
        { id: "claim-2", type: "unresolved", basis: "evidence_gap", text: "District findings and resident experience are not present in the supplied record.", sourceIds: ["pib-water-note"], sourceScope: "The source pack contains one ministry record and no district-level evidence.", limits: "No inspection sheet, measurement, independent observation, or affected-person account is supplied." }
      ],
      perspectives: [{ id: "resident", label: "District resident", rationale: "Residents may use services connected with a district water office named by the review.", sees: "The local service and any practical change at the point where it is used.", values: "Reliable access, clear information, and accountable public administration.", uses: "The ministry's list as a starting point for questions about local records.", mayMiss: "Internal administrative constraints that are not visible from a service encounter.", sourceIds: ["pib-water-note"] }],
      people: [{ id: "water-ministry", kind: "institution", label: "Issuing ministry", association: "The institution issued the record describing the district review process.", sourceIds: ["pib-water-note"] }],
      unresolved: [{ id: "district-results", question: "Which district checks were completed and what records did they produce?", whatWouldHelp: "Inspection sheets, dated office records, published measurements, and independent local observation.", sourceIds: ["pib-water-note"] }],
      contextBridge: { topicSlug: "local-decision", question: "How should an administrative decision be assessed?", connection: "The review shows why an official plan and evidence of local implementation need separate treatment." },
      authoredVisual: { kind: "timeline", title: "Record, checks, and missing findings", description: "A source-bound sequence separates the dated ministry record from later checks and still-unpublished findings.", limitation: "Only the first step has a supported date in the supplied record.", claimIds: ["claim-1", "claim-2"], sourceIds: ["pib-water-note"] },
      mediaPlan: [],
      modelNotes: ["Keep every operational claim attributed to the ministry record."]
    };

    const previousCwd = process.cwd();
    const previousKey = process.env.OPENROUTER_API_KEY;
    process.chdir(directory);
    process.env.OPENROUTER_API_KEY = "test-key-never-sent";
    try {
      const genericLicencePack = { ...structuredClone(sourcePack), sources: [{ ...sourcePack.sources[0], rightsBasis: "explicit_licence" as const, policyUrl: "https://example.invalid/custom-licence" }] };
      await writeFile(join(directory, "data/source-packs/approved-preview.json"), JSON.stringify([genericLicencePack]), "utf8");
      let metadataCalls = 0;
      let providerCalls = 0;
      await expect(runPreviewBatch(
        { pilot: false, dryRun: false, start: 0, count: 1, mode: "news" as const, sourcePackPath: "data/source-packs/approved-preview.json", ledgerPath: ".syat-private/generation-ledger.json" },
        {
          fetchImpl: async () => {
            metadataCalls += 1;
            return new Response(JSON.stringify({ data: [{ id: "deepseek/deepseek-v4-flash-0731", context_length: 163_840, supported_parameters: ["structured_outputs"], pricing: { prompt: "0.000000065", completion: "0.00000018" } }] }), { status: 200 });
          },
          createDraft: async () => {
            providerCalls += 1;
            throw new Error("The provider must not run for an incompatible source pack.");
          }
        }
      )).rejects.toThrow(/licence-specific|explicit licence/i);
      expect({ metadataCalls, providerCalls }).toEqual({ metadataCalls: 0, providerCalls: 0 });
      await expect(readFile(join(directory, ".syat-private/generation-ledger.json"), "utf8")).rejects.toMatchObject({ code: "ENOENT" });
      await writeFile(join(directory, "data/source-packs/approved-preview.json"), JSON.stringify([sourcePack]), "utf8");

      expect(findCloseCopyMatches(draft, sourcePack.sources)).toEqual([]);
      expect(reviewEditorialQuality(draft, []).blockers).toEqual([]);
      const report = await runPreviewBatch(
        { pilot: false, dryRun: false, start: 0, count: 1, mode: "news" as const, sourcePackPath: "data/source-packs/approved-preview.json", ledgerPath: ".syat-private/generation-ledger.json" },
        {
          fetchImpl: async () => new Response(JSON.stringify({ data: [{ id: "deepseek/deepseek-v4-flash-0731", context_length: 163_840, supported_parameters: ["structured_outputs"], pricing: { prompt: "0.000000065", completion: "0.00000018" } }] }), { status: 200 }),
          createDraft: async ({ reserveAttempt }) => {
            await reserveAttempt({ attempt: 1, estimatedPaise: 20, localDecision: { status: "allowed", reason: "within_monthly_cap", authorisedTotalPaise: 20 }, previousReservationIds: [], promptUtf8Bytes: 1000 });
            return { draft, review: reviewGeneratedDraft(draft, sourcePack.sources, { indiaConnection: sourcePack.indiaConnection }), usage: { promptTokens: 100, completionTokens: 200 }, reservedMaximumPaise: 20, actualCostUsd: 0.001, reservations: [] };
          }
        }
      );

      expect(report).toMatchObject({ status: "passed", count: 1, items: [{ slug: "district-water-review" }] });
      const index = JSON.parse(await readFile(join(directory, "data/stories/news/index.json"), "utf8"));
      expect(index.items).toHaveLength(1);
      const savedStory = JSON.parse(await readFile(join(directory, "data/stories/news/district-water-review.json"), "utf8"));
      expect(savedStory).toMatchObject({ publicationAllowed: false, disclosure: "AI-assisted private preview" });
      const durableInputHash = report!.items[0].inputHash;
      const ledgerFile = JSON.parse(await readFile(join(directory, ".syat-private/generation-ledger.json"), "utf8"));
      expect(savedStory.generation.inputHash).toBe(durableInputHash);
      expect(ledgerFile.attempts[0].inputHash).toBe(durableInputHash);
      expect(await readdir(join(directory, ".syat-private/generated-drafts"))).toContain(`${durableInputHash}.json`);
      expect(report!.items[0].outputHash).not.toBe(durableInputHash);

      const resumed = await runPreviewBatch(
        { pilot: false, dryRun: false, start: 0, count: 1, mode: "news" as const, sourcePackPath: "data/source-packs/approved-preview.json", ledgerPath: ".syat-private/generation-ledger.json" },
        {
          fetchImpl: async () => new Response(JSON.stringify({ data: [{ id: "deepseek/deepseek-v4-flash-0731", context_length: 163_840, supported_parameters: ["structured_outputs"], pricing: { prompt: "0.000000065", completion: "0.00000018" } }] }), { status: 200 }),
          createDraft: async () => { throw new Error("A completed input must not call the provider again."); }
        }
      );
      expect(resumed!.items).toMatchObject([{ slug: "district-water-review", reused: true }]);

      const failingPack = { ...structuredClone(sourcePack), id: "district-water-review-two", title: "A second district water record enters review" };
      const failingDraft = structuredClone(draft);
      failingDraft.sourcePackId = failingPack.id;
      failingDraft.bodySections = failingDraft.bodySections.map((section) => ({ ...section, paragraphs: [section.paragraphs[0]] }));
      await writeFile(join(directory, "data/source-packs/approved-preview.json"), JSON.stringify([failingPack]), "utf8");
      const previousExitCode = process.exitCode;
      const blockedRun = await runPreviewBatch(
        { pilot: false, dryRun: false, start: 0, count: 1, mode: "news" as const, sourcePackPath: "data/source-packs/approved-preview.json", ledgerPath: ".syat-private/generation-ledger.json" },
        {
          fetchImpl: async () => new Response(JSON.stringify({ data: [{ id: "deepseek/deepseek-v4-flash-0731", context_length: 163_840, supported_parameters: ["structured_outputs"], pricing: { prompt: "0.000000065", completion: "0.00000018" } }] }), { status: 200 }),
          createDraft: async ({ reserveAttempt }) => {
            await reserveAttempt({ attempt: 1, estimatedPaise: 20, localDecision: { status: "allowed", reason: "within_monthly_cap", authorisedTotalPaise: 20 }, previousReservationIds: [], promptUtf8Bytes: 1000 });
            return { draft: failingDraft, review: reviewGeneratedDraft(failingDraft, failingPack.sources, { indiaConnection: failingPack.indiaConnection }), usage: { promptTokens: 100, completionTokens: 200 }, reservedMaximumPaise: 20, actualCostUsd: 0.001, reservations: [] };
          }
        }
      );
      expect(blockedRun).toBeUndefined();
      expect(process.exitCode).toBe(2);
      process.exitCode = previousExitCode;
      expect(JSON.parse(await readFile(join(directory, "data/stories/news/index.json"), "utf8")).items).toHaveLength(1);
      await expect(readFile(join(directory, "data/stories/news/district-water-review-two.json"), "utf8")).rejects.toMatchObject({ code: "ENOENT" });
    } finally {
      process.chdir(previousCwd);
      if (previousKey === undefined) delete process.env.OPENROUTER_API_KEY;
      else process.env.OPENROUTER_API_KEY = previousKey;
    }
  });
});
