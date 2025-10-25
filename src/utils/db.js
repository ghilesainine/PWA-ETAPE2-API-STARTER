import { pool } from '../config/db.js';

export function getUserId(req) {
  if (!req.user || !req.user.id) throw new Error('AUTH_REQUIRED');
  return req.user.id;
}

export async function begin() {
  const conn = await pool.getConnection();
  try { await conn.beginTransaction(); return conn; }
  catch (e) { conn.release(); throw e; }
}
export async function commitRelease(conn) { try { await conn.commit(); } finally { conn.release(); } }
export async function rollbackRelease(conn) { try { await conn.rollback(); } finally { conn.release(); } }