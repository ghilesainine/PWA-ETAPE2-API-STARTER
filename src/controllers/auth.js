import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export async function register(req, res) {
  const { nom, email, password } = req.body;
  if (!email || !password) return res.status(400).json({error: 'email & password requis'});
  try {
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length) return res.status(409).json({error: 'email déjà utilisé'});
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (nom, email, password_hash) VALUES (?,?,?)', [nom || null, email, hash]);
    return res.status(201).json({id: result.insertId, email});
  } catch (e) {
    return res.status(500).json({error: 'Erreur serveur', details: e.message});
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT id, email, password_hash, role, actif FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({error: 'Identifiants invalides'});
    const user = rows[0];
    if (!user.actif) return res.status(403).json({error: 'Compte désactivé'});
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({error: 'Identifiants invalides'});
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
    res.json({ token });
  } catch (e) {
    res.status(500).json({error: 'Erreur serveur', details: e.message});
  }
}
