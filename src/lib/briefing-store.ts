import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "briefings.json");

export interface BriefingRecord {
  id: string;
  createdAt: string;
  data: Record<string, unknown>;
  logoPath?: string;
  refsPath?: string;
  generatedImagePath?: string;
  iaProvider?: string;
  regeneracoes: number;
  status: "novo" | "gerado" | "erro";
}

function readAll(): BriefingRecord[] {
  if (!fs.existsSync(DATA_PATH)) return [];
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}

function writeAll(records: BriefingRecord[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(records, null, 2), "utf-8");
}

export function createBriefing(
  id: string,
  data: Record<string, unknown>
): BriefingRecord {
  const record: BriefingRecord = {
    id,
    createdAt: new Date().toISOString(),
    data,
    regeneracoes: 0,
    status: "novo",
  };
  const all = readAll();
  all.push(record);
  writeAll(all);
  return record;
}

export function getBriefing(id: string): BriefingRecord | undefined {
  return readAll().find((b) => b.id === id);
}

export function updateBriefing(
  id: string,
  updates: Partial<BriefingRecord>
): BriefingRecord | undefined {
  const all = readAll();
  const idx = all.findIndex((b) => b.id === id);
  if (idx === -1) return undefined;
  all[idx] = { ...all[idx], ...updates };
  writeAll(all);
  return all[idx];
}
