import { pool } from '../config/db.js';

export async function list(req, res) {
  const { q, categorie_id } = req.query;
  let sql = 'SELECT * FROM ouvrages WHERE stock > 0';
  const params = [];
  if (q) { sql += ' AND (titre LIKE ? OR auteur LIKE ?)'; params.push(`%${q}%`, `%${q}%`); }
  if (categorie_id) { sql += ' AND categorie_id = ?'; params.push(categorie_id); }
  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch(e) { res.status(500).json({error:'Erreur serveur'}); }
}
export async function detail(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM ouvrages WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({error:'Introuvable'});
    const [avis] = await pool.query('SELECT a.id, a.note, a.commentaire, a.date, u.nom FROM avis a JOIN users u ON a.client_id=u.id WHERE a.ouvrage_id=?', [req.params.id]);
    res.json({ ...rows[0], avis });
  } catch(e){ res.status(500).json({error:'Erreur serveur'}); }
}
export async function create(req,res){ res.status(501).json({error:'À implémenter'})}
export async function update(req,res){ res.status(501).json({error:'À implémenter'})}
export async function remove(req,res){ res.status(501).json({error:'À implémenter'})}
