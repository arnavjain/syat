import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, unlink } from "node:fs/promises";
import { dirname } from "node:path";

import { z } from "zod";

import { authoriseGenerationBudget } from "./generation-budget";

const INR_PER_USD = 100;
const hashSchema = z.string().regex(/^[a-f0-9]{64}$/);
const monthSchema = z.string().regex(/^\d{4}-(?:0[1-9]|1[0-2])$/);
const retryReasonSchema = z.enum(["new_input", "transient_provider_error"]);

const ledgerAttemptSchema = z.object({
  reservationId: z.uuid(),
  inputHash: hashSchema,
  estimatedPaise: z.number().int().positive(),
  attempt: z.number().int().min(1).max(2),
  month: monthSchema,
  retryReason: retryReasonSchema,
  state: z.enum(["reserved", "completed", "failed"]),
  createdAt: z.iso.datetime(),
  lockOwnerId: z.uuid(),
  settledAt: z.iso.datetime().optional(),
  errorCode: z.string().regex(/^[a-z0-9_]+$/).max(80).optional(),
  conservativeEstimatedPaise: z.number().int().nonnegative().optional(),
  actualCostUsd: z.number().finite().nonnegative().optional(),
  actualPaise: z.number().int().nonnegative().optional(),
  inrPerUsd: z.literal(INR_PER_USD).optional(),
  promptTokens: z.number().int().nonnegative().optional(),
  completionTokens: z.number().int().nonnegative().optional(),
  outputHash: hashSchema.optional(),
  releasedPaise: z.number().int().nonnegative().optional()
}).strict().superRefine((attempt, ctx) => {
  if (attempt.state === "reserved" && attempt.settledAt !== undefined) {
    ctx.addIssue({ code: "custom", message: "A reserved attempt cannot be settled.", path: ["settledAt"] });
  }
  if (attempt.state === "reserved" && [attempt.errorCode, attempt.conservativeEstimatedPaise, attempt.actualCostUsd, attempt.actualPaise, attempt.inrPerUsd, attempt.promptTokens, attempt.completionTokens, attempt.outputHash, attempt.releasedPaise].some((value) => value !== undefined)) {
    ctx.addIssue({ code: "custom", message: "A reserved attempt cannot contain settlement fields.", path: ["state"] });
  }
  if (attempt.state === "completed" && [attempt.settledAt, attempt.actualCostUsd, attempt.actualPaise, attempt.inrPerUsd, attempt.promptTokens, attempt.completionTokens, attempt.outputHash, attempt.releasedPaise].some((value) => value === undefined)) {
    ctx.addIssue({ code: "custom", message: "A completed attempt requires complete provider usage and conversion fields.", path: ["state"] });
  }
  if (attempt.state === "completed" && [attempt.errorCode, attempt.conservativeEstimatedPaise].some((value) => value !== undefined)) {
    ctx.addIssue({ code: "custom", message: "A completed attempt cannot contain failure fields.", path: ["state"] });
  }
  if (attempt.state === "failed" && [attempt.settledAt, attempt.errorCode, attempt.conservativeEstimatedPaise].some((value) => value === undefined)) {
    ctx.addIssue({ code: "custom", message: "A failed attempt requires an auditable error and conservative charge.", path: ["state"] });
  }
  if (attempt.state === "failed" && [attempt.actualCostUsd, attempt.actualPaise, attempt.inrPerUsd, attempt.promptTokens, attempt.completionTokens, attempt.outputHash, attempt.releasedPaise].some((value) => value !== undefined)) {
    ctx.addIssue({ code: "custom", message: "A failed attempt cannot present an unknown provider charge as reconciled usage.", path: ["state"] });
  }
});

const ledgerSchema = z.object({
  contractVersion: z.literal("syat.local-generation-ledger.v1"),
  updatedAt: z.iso.datetime(),
  attempts: z.array(ledgerAttemptSchema).max(20_000)
}).strict().superRefine((ledger, ctx) => {
  const reservationIds = new Set<string>();
  const attemptsByInput = new Map<string, Array<{ attempt: z.infer<typeof ledgerAttemptSchema>; position: number }>>();
  for (const [index, attempt] of ledger.attempts.entries()) {
    if (reservationIds.has(attempt.reservationId)) ctx.addIssue({ code: "custom", message: "Reservation IDs must be unique.", path: ["attempts", index, "reservationId"] });
    reservationIds.add(attempt.reservationId);
    const group = attemptsByInput.get(attempt.inputHash) ?? [];
    group.push({ attempt, position: index });
    attemptsByInput.set(attempt.inputHash, group);
  }
  for (const group of attemptsByInput.values()) {
    if (group.length > 2) ctx.addIssue({ code: "custom", message: "An input hash can have at most two attempts.", path: ["attempts", group[2].position] });
    for (const [index, record] of group.entries()) {
      if (record.attempt.attempt !== index + 1) ctx.addIssue({ code: "custom", message: "Input attempts must be numbered in audit order.", path: ["attempts", record.position, "attempt"] });
      if (index === 0 && record.attempt.retryReason !== "new_input") ctx.addIssue({ code: "custom", message: "The first input attempt must record new input.", path: ["attempts", record.position, "retryReason"] });
      if (index === 1) {
        const prior = group[0].attempt;
        if (record.attempt.retryReason !== "transient_provider_error" || prior.state !== "failed" || prior.errorCode !== "transient_provider_error") {
          ctx.addIssue({ code: "custom", message: "A second input attempt requires a recorded transient provider failure.", path: ["attempts", record.position, "retryReason"] });
        }
      }
    }
  }
});

const reserveRequestSchema = z.object({
  inputHash: hashSchema,
  estimatedPaise: z.number().int().positive(),
  attempt: z.number().int().positive(),
  month: monthSchema,
  retryReason: retryReasonSchema,
  jobCommittedPaise: z.number().int().nonnegative().optional(),
  jobCapPaise: z.number().int().positive().optional()
}).strict();

const completionUsageSchema = z.object({
  actualCostUsd: z.number().finite().nonnegative(),
  promptTokens: z.number().int().nonnegative(),
  completionTokens: z.number().int().nonnegative(),
  outputHash: hashSchema
}).strict();

type Ledger = z.infer<typeof ledgerSchema>;
export type LedgerAttempt = z.infer<typeof ledgerAttemptSchema>;
export type LedgerReservationRequest = z.infer<typeof reserveRequestSchema>;
export type LedgerCompletionUsage = z.infer<typeof completionUsageSchema>;

export type LedgerReceipt = LedgerAttempt & {
  state: "reserved";
  reservationPaise: number;
  authoritativeTotalPaise: number;
  budgetStatus: "allowed" | "warning";
};

export type LedgerSummary = {
  month: string;
  spentPaise: number;
  actualProviderPaise: number;
  reservedPaise: number;
  conservativeFailedPaise: number;
  completedAttempts: number;
  failedAttempts: number;
};

function emptyLedger(): Ledger {
  return { contractVersion: "syat.local-generation-ledger.v1", updatedAt: new Date().toISOString(), attempts: [] };
}

function summaryFor(ledger: Ledger, month: string): LedgerSummary {
  monthSchema.parse(month);
  const attempts = ledger.attempts.filter((attempt) => attempt.month === month);
  const completed = attempts.filter((attempt) => attempt.state === "completed");
  const failed = attempts.filter((attempt) => attempt.state === "failed");
  return {
    month,
    spentPaise: completed.reduce((sum, attempt) => sum + (attempt.actualPaise ?? 0), 0) + failed.reduce((sum, attempt) => sum + (attempt.conservativeEstimatedPaise ?? 0), 0),
    actualProviderPaise: completed.reduce((sum, attempt) => sum + (attempt.actualPaise ?? 0), 0),
    reservedPaise: attempts.filter((attempt) => attempt.state === "reserved").reduce((sum, attempt) => sum + attempt.estimatedPaise, 0),
    conservativeFailedPaise: failed.reduce((sum, attempt) => sum + (attempt.conservativeEstimatedPaise ?? 0), 0),
    completedAttempts: completed.length,
    failedAttempts: failed.length
  };
}

function isMissingFile(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

export class LocalGenerationLedger {
  readonly path: string;
  readonly lockPath: string;
  private readonly lockContext = new AsyncLocalStorage<string>();
  private activeOwnerId: string | undefined;

  constructor(path: string) {
    this.path = path;
    this.lockPath = `${path}.lock`;
  }

  async withExclusiveLock<T>(work: () => Promise<T>): Promise<T> {
    if (this.lockContext.getStore() === this.activeOwnerId && this.activeOwnerId) return work();
    await mkdir(dirname(this.path), { recursive: true });
    const ownerId = randomUUID();
    let handle;
    try {
      handle = await open(this.lockPath, "wx", 0o600);
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "EEXIST") {
        throw new Error(`Generation ledger is already locked at ${this.lockPath}. The lock was left untouched; review it manually.`);
      }
      throw error;
    }

    try {
      await handle.writeFile(JSON.stringify({ ownerId, pid: process.pid, acquiredAt: new Date().toISOString() }), "utf8");
      await handle.sync();
    } finally {
      await handle.close();
    }
    this.activeOwnerId = ownerId;
    try {
      return await this.lockContext.run(ownerId, work);
    } finally {
      const current = await readFile(this.lockPath, "utf8").catch((error: unknown) => {
        if (isMissingFile(error)) return undefined;
        throw error;
      });
      if (current !== undefined) {
        let recordedOwner: unknown;
        try {
          recordedOwner = JSON.parse(current).ownerId;
        } catch {
          recordedOwner = undefined;
        }
        if (recordedOwner === ownerId) await unlink(this.lockPath);
      }
      this.activeOwnerId = undefined;
    }
  }

  async reserve(rawRequest: LedgerReservationRequest): Promise<LedgerReceipt> {
    const request = reserveRequestSchema.parse(rawRequest);
    return this.mutate((ledger) => {
      const existing = ledger.attempts.filter((attempt) => attempt.inputHash === request.inputHash);
      if (existing.some((attempt) => attempt.state === "completed")) throw new Error("A completed input must reuse its saved generation output.");
      if (existing.some((attempt) => attempt.state === "reserved")) throw new Error("Generation input already has an active reservation.");
      if (existing.length >= 2 || request.attempt > 2) throw new Error("Generation permits at most two attempts for one input hash.");
      if (existing.length === 0 && (request.attempt !== 1 || request.retryReason !== "new_input")) {
        throw new Error("A first attempt must use a new or changed input hash.");
      }
      if (existing.length === 1) {
        const prior = existing[0];
        if (prior.state !== "failed" || prior.errorCode !== "transient_provider_error" || request.retryReason !== "transient_provider_error" || request.attempt !== 2) {
          throw new Error("A same-input retry requires a recorded transient provider failure; otherwise use changed input.");
        }
      }

      const summary = summaryFor(ledger, request.month);
      const decision = authoriseGenerationBudget({ spentPaise: summary.spentPaise, reservedPaise: summary.reservedPaise, estimatedPaise: request.estimatedPaise });
      if (decision.status === "refused" || decision.authorisedTotalPaise === null) {
        throw new Error(`Generation hard stop: ${decision.reason}.`);
      }
      if (request.jobCapPaise !== undefined && (request.jobCommittedPaise ?? 0) + request.estimatedPaise >= request.jobCapPaise) {
        throw new Error("Generation job hard stop: the pilot cap would be reached.");
      }
      const ownerId = this.currentOwner();
      const attempt = ledgerAttemptSchema.parse({
        reservationId: randomUUID(),
        inputHash: request.inputHash,
        estimatedPaise: request.estimatedPaise,
        attempt: request.attempt,
        month: request.month,
        retryReason: request.retryReason,
        state: "reserved",
        createdAt: new Date().toISOString(),
        lockOwnerId: ownerId
      });
      ledger.attempts.push(attempt);
      return {
        ...attempt,
        state: "reserved" as const,
        reservationPaise: request.estimatedPaise,
        authoritativeTotalPaise: decision.authorisedTotalPaise,
        budgetStatus: decision.status
      };
    });
  }

  async complete(rawReceipt: LedgerReceipt, rawUsage: LedgerCompletionUsage): Promise<LedgerAttempt> {
    const usage = completionUsageSchema.parse(rawUsage);
    return this.mutate((ledger) => {
      const index = ledger.attempts.findIndex((attempt) => attempt.reservationId === rawReceipt.reservationId);
      if (index < 0 || ledger.attempts[index].state !== "reserved") throw new Error("Generation reservation cannot be completed because it is missing or already settled.");
      const reserved = ledger.attempts[index];
      const actualPaise = Math.ceil(usage.actualCostUsd * INR_PER_USD * 100);
      const completed = ledgerAttemptSchema.parse({
        ...reserved,
        ...usage,
        state: "completed",
        settledAt: new Date().toISOString(),
        actualPaise,
        inrPerUsd: INR_PER_USD,
        releasedPaise: Math.max(0, reserved.estimatedPaise - actualPaise)
      });
      ledger.attempts[index] = completed;
      return completed;
    });
  }

  async fail(rawReceipt: LedgerReceipt, errorCode: string): Promise<LedgerAttempt> {
    const checkedErrorCode = z.string().regex(/^[a-z0-9_]+$/).max(80).parse(errorCode);
    return this.mutate((ledger) => {
      const index = ledger.attempts.findIndex((attempt) => attempt.reservationId === rawReceipt.reservationId);
      if (index < 0 || ledger.attempts[index].state !== "reserved") throw new Error("Generation reservation cannot fail because it is missing or already settled.");
      const reserved = ledger.attempts[index];
      const failed = ledgerAttemptSchema.parse({
        ...reserved,
        state: "failed",
        settledAt: new Date().toISOString(),
        errorCode: checkedErrorCode,
        conservativeEstimatedPaise: reserved.estimatedPaise
      });
      ledger.attempts[index] = failed;
      return failed;
    });
  }

  async getByInputHash(inputHash: string): Promise<LedgerAttempt | undefined> {
    hashSchema.parse(inputHash);
    const ledger = await this.readLedger();
    return ledger.attempts.filter((attempt) => attempt.inputHash === inputHash).at(-1);
  }

  async summary(month: string): Promise<LedgerSummary> {
    return summaryFor(await this.readLedger(), month);
  }

  private currentOwner() {
    const ownerId = this.lockContext.getStore();
    if (!ownerId || ownerId !== this.activeOwnerId) throw new Error("Generation ledger mutation requires its owned lock.");
    return ownerId;
  }

  private async mutate<T>(change: (ledger: Ledger) => T): Promise<T> {
    const run = async () => {
      this.currentOwner();
      const ledger = await this.readLedger();
      const result = change(ledger);
      ledger.updatedAt = new Date().toISOString();
      await this.writeLedger(ledger);
      return result;
    };
    if (this.lockContext.getStore() === this.activeOwnerId && this.activeOwnerId) return run();
    return this.withExclusiveLock(run);
  }

  private async readLedger(): Promise<Ledger> {
    let contents: string;
    try {
      contents = await readFile(this.path, "utf8");
    } catch (error) {
      if (isMissingFile(error)) return emptyLedger();
      throw error;
    }
    try {
      return ledgerSchema.parse(JSON.parse(contents));
    } catch {
      throw new Error(`Generation ledger at ${this.path} is malformed; it was left untouched.`);
    }
  }

  private async writeLedger(ledger: Ledger) {
    const validated = ledgerSchema.parse(ledger);
    const serialised = `${JSON.stringify(validated, null, 2)}\n`;
    ledgerSchema.parse(JSON.parse(serialised));
    const nextPath = `${this.path}.next`;
    const handle = await open(nextPath, "w", 0o600);
    try {
      await handle.writeFile(serialised, "utf8");
      await handle.sync();
    } finally {
      await handle.close();
    }
    await rename(nextPath, this.path);
    const directoryHandle = await open(dirname(this.path), "r");
    try {
      await directoryHandle.sync();
    } finally {
      await directoryHandle.close();
    }
  }
}
