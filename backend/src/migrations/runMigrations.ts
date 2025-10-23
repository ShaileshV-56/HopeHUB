import { pool } from '../db/pool';
import fs from 'fs';
import path from 'path';

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public._migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT NOT NULL UNIQUE,
      run_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const res = await pool.query('SELECT filename FROM public._migrations ORDER BY id');
  return new Set(res.rows.map((r) => r.filename));
}

async function applyMigration(filePath: string, filename: string) {
  const sql = fs.readFileSync(filePath, 'utf8');
  await pool.query('BEGIN');
  try {
    await pool.query(sql);
    await pool.query('INSERT INTO public._migrations (filename) VALUES ($1)', [filename]);
    await pool.query('COMMIT');
    // eslint-disable-next-line no-console
    console.log(`Applied migration: ${filename}`);
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }
}

async function main() {
  try {
    await ensureMigrationsTable();
    const applied = await getAppliedMigrations();

    const migrationsDir = path.resolve(__dirname, 'sql');
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const filename of files) {
      if (!applied.has(filename)) {
        const filePath = path.join(migrationsDir, filename);
        await applyMigration(filePath, filename);
      }
    }

    // eslint-disable-next-line no-console
    console.log('All migrations up to date.');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Migration failed:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
