import { pool } from '../config/db.js';
import { getUserId } from '../utils/db.js';

export async function create(req,res){
  try{
    const uid=getUserId(req); const { id:ouvrage_id }=req.params; const { contenu }=req.body;
    if(!contenu) return res.status(400).json({error:'contenu requis'});
    const [ok]=await pool.query('INSERT INTO commentaires (client_id,ouvrage_id,contenu,valide) VALUES (?,?,?,FALSE)',[uid,ouvrage_id,contenu]);
    res.status(201).json({id:ok.insertId,valide:false});
  }catch(e){ if(e.message==='AUTH_REQUIRED') return res.status(401).json({error:'Non authentifié'}); res.status(500).json({error:'Erreur serveur'}); }
}
export async function validate(req,res){
  try{
    const uid=getUserId(req); const { id }=req.params;
    await pool.query('UPDATE commentaires SET valide=TRUE, date_validation=CURRENT_TIMESTAMP, valide_par=? WHERE id=?',[uid,id]);
    res.json({message:'Commentaire validé'});
  }catch(e){ if(e.message==='AUTH_REQUIRED') return res.status(401).json({error:'Non authentifié'}); res.status(500).json({error:'Erreur serveur'}); }
}