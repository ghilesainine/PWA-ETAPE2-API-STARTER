import jwt from 'jsonwebtoken';

export const ROLES = { CLIENT:'client', EDITEUR:'editeur', GESTIONNAIRE:'gestionnaire', ADMIN:'administrateur' };

export function verifyJWT(req, res, next) {
  const header = req.headers.authorization || '';
  const raw = header.startsWith('Bearer ') ? header.slice(7) : header;
  const token = (raw || '').trim().replace(/^"|"$/g, '');
  if (!token) return res.status(401).json({ error: 'Token manquant' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); return next(); }
  catch { return res.status(401).json({ error: 'Token invalide' }); }
}

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Non authentifié' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Accès refusé' });
    next();
  };
}