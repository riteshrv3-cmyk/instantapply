import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";

// One small interface over two Postgres drivers:
// - local / tests: PGlite (Postgres running inside Node, data in .data/)
// - deploy: real Postgres (Fly.io) via DATABASE_URL
export interface Db {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]>;
  exec(sql: string): Promise<void>;
}

// Next.js can load this module more than once (pages and API routes are bundled separately).
// Keep one database per server process, or each copy would open its own private local database.
const holder = globalThis as unknown as { __iaDb?: Promise<Db> | null };
let current: Promise<Db> | null = holder.__iaDb ?? null;

async function open(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  let db: Db;
  if (url) {
    const { Pool } = await import("pg");
    const pool = new Pool({ connectionString: url });
    db = {
      async query(sql, params) {
        return (await pool.query(sql, params as unknown[])).rows;
      },
      async exec(sql) {
        await pool.query(sql);
      },
    };
  } else {
    db = await openPglite(path.join(process.cwd(), ".data", "pg"));
  }
  await migrate(db);
  return db;
}

export async function openPglite(dataDir?: string): Promise<Db> {
  const { PGlite } = await import("@electric-sql/pglite");
  if (dataDir) mkdirSync(dataDir, { recursive: true });
  const pg = dataDir ? new PGlite(dataDir) : new PGlite();
  return {
    async query(sql, params) {
      return (await pg.query(sql, params as unknown[])).rows as never[];
    },
    async exec(sql) {
      await pg.exec(sql);
    },
  };
}

export async function migrate(db: Db) {
  await db.exec(readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf8"));
}

export function getDb(): Promise<Db> {
  if (!current) current = holder.__iaDb ?? open();
  holder.__iaDb = current;
  return current;
}

// Tests swap in an in-memory database.
export function setDb(db: Db) {
  current = Promise.resolve(db);
  holder.__iaDb = current;
}
