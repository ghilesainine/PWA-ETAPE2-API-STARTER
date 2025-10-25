import { pool } from '../config/db.js';
import { getUserId } from '../utils/db.js';

export async function create(req,res){
  try{
    const uid=getUserId(req); const { id:ouvrage_id }=req.params; const { note, commentaire }=req.body;
    if(!note || note<1 || note>5) return res.status(400).json({error:'note 1..5 requise'});
    const [rows]=await pool.query(
      `SELECT 1 FROM commandes c JOIN commande_items ci ON ci.commande_id=c.id
       WHERE c.client_id=? AND ci.ouvrage_id=? LIMIT 1`, [uid,ouvrage_id]);
    if(!rows.length) return res.status(403).json({error:'Vous devez avoir acheté ce produit pour laisser un avis'});
    await pool.query('INSERT INTO avis (client_id, ouvrage_id, note, commentaire) VALUES (?,?,?,?)',
      [uid,ouvrage_id,note,commentaire||null]);
    res.status(201).json({message:'Avis enregistré'});
  }catch(e){ if(e.code==='ER_DUP_ENTRY') return res.status(409).json({error:'Avis déjà existant'}); if(e.message==='AUTH_REQUIRED') return res.status(401).json({error:'Non authentifié'}); res.status(500).json({error:'Erreur serveur'}); }
}