import { readFile } from 'fs/promises';
import { pool } from '../src/config/db.js';

async function run() {
  const sql = await readFile(new URL('./schema.sql', import.meta.url), 'utf-8');
  for (const statement of sql.split(/;\s*\n/).map(s => s.trim()).filter(Boolean)) {
    console.log('> ' + statement.slice(0,80) + '...');
    await pool.query(statement);
  }
  console.log('Migrations terminées');
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
