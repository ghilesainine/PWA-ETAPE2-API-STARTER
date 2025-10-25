import { pool } from '../config/db.js';
import { getUserId } from '../utils/db.js';

export async function list(req, res) {
  try {
    const userId = getUserId(req);
    let [rows] = await pool.query('SELECT * FROM panier WHERE client_id=? AND actif=TRUE', [userId]);
    let panierId = rows.length ? rows[0].id : (await pool.query('INSERT INTO panier (client_id, actif) VALUES (?, TRUE)', [userId]))[0].insertId;
    const [panier] = await pool.query('SELECT * FROM panier WHERE id=?', [panierId]);
    const [items] = await pool.query(
      `SELECT pi.id, pi.quantite, pi.prix_unitaire, o.id AS ouvrage_id, o.titre, o.auteur
       FROM panier_items pi JOIN ouvrages o ON o.id=pi.ouvrage_id WHERE pi.panier_id=?`, [panierId]);
    res.json({ ...panier[0], items });
  } catch (e) { if (e.message==='AUTH_REQUIRED') return res.status(401).json({error:'Non authentifié'}); res.status(500).json({error:'Erreur serveur', details:e.message}); }
}

export async function create(req, res) {
  try {
    const userId = getUserId(req);
    const { ouvrage_id, quantite } = req.body;
    if (!ouvrage_id || !quantite || quantite <= 0) return res.status(400).json({error:'ouvrage_id et quantite > 0 requis'});
    let [rows] = await pool.query('SELECT * FROM panier WHERE client_id=? AND actif=TRUE', [userId]);
    let panierId = rows.length ? rows[0].id : (await pool.query('INSERT INTO panier (client_id, actif) VALUES (?, TRUE)', [userId]))[0].insertId;
    const [ouvr] = await pool.query('SELECT prix, stock FROM ouvrages WHERE id=?', [ouvrage_id]);
    if (!ouvr.length) return res.status(404).json({error:'Ouvrage introuvable'});
    if (ouvr[0].stock <= 0) return res.status(409).json({error:'Stock insuffisant'});
    await pool.query('INSERT INTO panier_items (panier_id, ouvrage_id, quantite, prix_unitaire) VALUES (?,?,?,?)', [panierId, ouvrage_id, quantite, ouvr[0].prix]);
    res.status(201).json({message:'Item ajouté', panier_id:panierId});
  } catch (e) { if (e.message==='AUTH_REQUIRED') return res.status(401).json({error:'Non authentifié'}); res.status(500).json({error:'Erreur serveur'}); }
}

export async function update(req, res) {
  try {
    const userId = getUserId(req); const { id } = req.params; const { quantite } = req.body;
    if (!quantite || quantite <= 0) return res.status(400).json({error:'quantite > 0 requise'});
    const [rows] = await pool.query(
      `SELECT pi.id FROM panier_items pi JOIN panier p ON p.id=pi.panier_id
       WHERE pi.id=? AND p.client_id=? AND p.actif=TRUE`, [id, userId]);
    if (!rows.length) return res.status(404).json({error:'Item introuvable'});
    await pool.query('UPDATE panier_items SET quantite=? WHERE id=?', [quantite, id]);
    res.json({message:'Quantité mise à jour'});
  } catch { res.status(500).json({error:'Erreur serveur'}); }
}

export async function remove(req, res) {
  try {
    const userId = getUserId(req); const { id } = req.params;
    const [r] = await pool.query(
      `DELETE pi FROM panier_items pi JOIN panier p ON p.id=pi.panier_id
       WHERE pi.id=? AND p.client_id=? AND p.actif=TRUE`, [id, userId]);
    if (!r.affectedRows) return res.status(404).json({error:'Item introuvable'});
    res.json({message:'Item supprimé'});
  } catch { res.status(500).json({error:'Erreur serveur'}); }
}