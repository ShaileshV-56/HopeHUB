import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { pool } from '../db/pool';

// Resolve migrations directory to support both local dev and Docker
// Priority: MIGRATIONS_DIR env -> ./migrations (inside app) -> ../database/migrations (monorepo)
const defaultMigrationsDir = fs.existsSync(path.resolve(process.cwd(), 'migrations'))
  ? path.resolve(process.cwd(), 'migrations')
  : path.resolve(__dirname, '../../../database/migrations');
const migrationsDir = process.env.MIGRATIONS_DIR
  ? path.resolve(process.env.MIGRATIONS_DIR)
  : defaultMigrationsDir;

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

async function getApplied(): Promise<Set<string>> {
  const { rows } = await pool.query('SELECT name FROM _migrations ORDER BY id');
  return new Set(rows.map((r: any) => r.name));
}

async function apply(name: string, sql: string) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('INSERT INTO _migrations (name) VALUES ($1)', [name]);
    await client.query('COMMIT');
    console.log(`Applied migration ${name}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`Failed migration ${name}:`, (err as Error).message);
    throw err;
  } finally {
    client.release();
  }
}

async function up() {
  await ensureMigrationsTable();
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  const applied = await getApplied();
  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    await apply(file, sql);
  }
}

async function down() {
  console.log('Down migrations are not implemented in this simple runner.');
}

async function main() {
  const dir = process.argv[2] || 'up';
  if (dir !== 'up' && dir !== 'down') {
    console.error('Usage: migrate.ts [up|down]');
    process.exit(1);
  }
  if (dir === 'up') await up();
  else await down();
  await pool.end();
}

main().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(1);
});
