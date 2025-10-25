import { pool } from '../config/db.js';
import { getUserId, begin, commitRelease, rollbackRelease } from '../utils/db.js';

export async function list(req,res){ try{ const uid=getUserId(req); const [rows]=await pool.query('SELECT * FROM commandes WHERE client_id=? ORDER BY date DESC',[uid]); res.json(rows);}catch(e){ if(e.message==='AUTH_REQUIRED') return res.status(401).json({error:'Non authentifié'}); res.status(500).json({error:'Erreur serveur'});} }
export async function detail(req,res){ try{ const uid=getUserId(req); const {id}=req.params; const [c]=await pool.query('SELECT * FROM commandes WHERE id=? AND client_id=?',[id,uid]); if(!c.length) return res.status(404).json({error:'Introuvable'}); const [items]=await pool.query('SELECT * FROM commande_items WHERE commande_id=?',[id]); res.json({...c[0],items}); }catch(e){ if(e.message==='AUTH_REQUIRED') return res.status(401).json({error:'Non authentifié'}); res.status(500).json({error:'Erreur serveur'});} }

export async function create(req,res){
  let conn;
  try{
    const uid=getUserId(req);
    const { adresse_livraison=null, mode_livraison=null, mode_paiement='simulation' } = req.body || {};
    conn = await begin();

    const [p] = await conn.query('SELECT id FROM panier WHERE client_id=? AND actif=TRUE FOR UPDATE',[uid]);
    if(!p.length) throw new Error('PANIER_VIDE');
    const panierId = p[0].id;

    const [items] = await conn.query(
      `SELECT pi.ouvrage_id, pi.quantite, pi.prix_unitaire, o.stock, o.titre
       FROM panier_items pi JOIN ouvrages o ON o.id=pi.ouvrage_id
       WHERE pi.panier_id=? FOR UPDATE`, [panierId]);
    if(!items.length) throw new Error('PANIER_VIDE');

    let total=0;
    for(const it of items){ if(it.stock < it.quantite) throw new Error('STOCK_INSUFFISANT:'+it.titre); total += it.prix_unitaire*it.quantite; }

    const [ins] = await conn.query(
      `INSERT INTO commandes (client_id,total,statut,adresse_livraison,mode_livraison,mode_paiement)
       VALUES (?,?,?,?,?,?)`, [uid,total,'en_cours',adresse_livraison,mode_livraison,mode_paiement]);
    const commandeId = ins.insertId;

    for(const it of items){
      await conn.query('INSERT INTO commande_items (commande_id,ouvrage_id,quantite,prix_unitaire) VALUES (?,?,?,?)',
        [commandeId,it.ouvrage_id,it.quantite,it.prix_unitaire]);
      await conn.query('UPDATE ouvrages SET stock=stock-? WHERE id=?',[it.quantite,it.ouvrage_id]);
    }
    await conn.query('DELETE FROM panier_items WHERE panier_id=?',[panierId]);
    await conn.query('UPDATE panier SET actif=FALSE WHERE id=?',[panierId]);

    await commitRelease(conn);
    res.status(201).json({id:commandeId,total,statut:'en_cours'});
  }catch(e){
    if(conn) await rollbackRelease(conn);
    if(e.message==='AUTH_REQUIRED') return res.status(401).json({error:'Non authentifié'});
    if(e.message==='PANIER_VIDE') return res.status(400).json({error:'Panier vide'});
    if(e.message.startsWith('STOCK_INSUFFISANT')) return res.status(409).json({error:e.message});
    res.status(500).json({error:'Erreur serveur', details:e.message});
  }
}

export async function update(req,res){
  try{
    const {id}=req.params; const {statut}=req.body;
    const allowed=['en_cours','payee','annulee','expediee'];
    if(!allowed.includes(statut)) return res.status(400).json({error:'Statut invalide'});
    const [r]=await pool.query('UPDATE commandes SET statut=? WHERE id=?',[statut,id]);
    if(!r.affectedRows) return res.status(404).json({error:'Commande introuvable'});
    res.json({message:'Statut mis à jour'});
  }catch{ res.status(500).json({error:'Erreur serveur'}); }
}
export async function remove(req,res){ res.status(405).json({error:'Suppression non autorisée'}); }