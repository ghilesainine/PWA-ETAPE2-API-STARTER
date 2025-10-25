import { pool } from '../config/db.js';

export async function list(req, res) {
  try {
    const [rows] = await pool.query('SELECT id, nom, email, role, actif, created_at, updated_at FROM users');
    res.json(rows);
  } catch (e) {
    res.status(500).json({error:'Erreur serveur'});
  }
}

export async function detail(req, res) {
  try {
    const [rows] = await pool.query('SELECT id, nom, email, role, actif, created_at, updated_at FROM users WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({error:'Introuvable'});
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({error:'Erreur serveur'});
  }
}

export async function create(req, res){ res.status(501).json({error:'À implémenter'})}
export async function update(req, res){ res.status(501).json({error:'À implémenter'})}
export async function remove(req, res){ res.status(501).json({error:'À implémenter'})}
export async function me(req, res){ res.json(req.user) }
