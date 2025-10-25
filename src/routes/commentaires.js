import { Router } from 'express';
import * as controller from '../controllers/commentaires.js';
import { verifyJWT, requireRoles, ROLES } from '../middleware/auth.js';
export const router = Router();
router.post('/ouvrages/:id/commentaires', verifyJWT, controller.create);
router.put('/commentaires/:id/valider', verifyJWT, requireRoles(ROLES.EDITEUR, ROLES.GESTIONNAIRE), controller.validate);