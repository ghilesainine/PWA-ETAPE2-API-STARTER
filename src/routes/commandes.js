import { Router } from 'express';
import * as controller from '../controllers/commandes.js';
import { verifyJWT, requireRoles, ROLES } from '../middleware/auth.js';
export const router = Router();
router.get('/', verifyJWT, controller.list);
router.get('/:id', verifyJWT, controller.detail);
router.post('/', verifyJWT, controller.create);
router.put('/:id/status', verifyJWT, requireRoles(ROLES.GESTIONNAIRE, ROLES.ADMIN), controller.update);