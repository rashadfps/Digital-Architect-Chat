import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import type { ScopeDocument } from "../validators/scope";

type ScopeRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  intake: Record<string, unknown>;
  scope: ScopeDocument;
};

type ScopeDb = {
  scopes: ScopeRecord[];
};

const DB_PATH = path.join(process.cwd(), "data", "scopes.json");

async function ensureDbFile() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify({ scopes: [] }, null, 2), "utf8");
  }
}

async function readDb(): Promise<ScopeDb> {
  await ensureDbFile();
  const raw = await fs.readFile(DB_PATH, "utf8");
  return JSON.parse(raw) as ScopeDb;
}

async function writeDb(db: ScopeDb) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

export async function createScope(input: { intake: Record<string, unknown>; scope: ScopeDocument }): Promise<ScopeRecord> {
  const db = await readDb();
  const now = new Date().toISOString();
  const record: ScopeRecord = {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    intake: input.intake,
    scope: input.scope,
  };

  db.scopes.unshift(record);
  await writeDb(db);
  return record;
}

export async function getScopeById(id: string): Promise<ScopeRecord | null> {
  const db = await readDb();
  return db.scopes.find((scope) => scope.id === id) ?? null;
}

export async function updateScope(id: string, scope: ScopeDocument): Promise<ScopeRecord | null> {
  const db = await readDb();
  const record = db.scopes.find((item) => item.id === id);
  if (!record) {
    return null;
  }

  record.scope = scope;
  record.updatedAt = new Date().toISOString();
  await writeDb(db);
  return record;
}
