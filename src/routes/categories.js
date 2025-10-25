import { Router } from 'express';
import * as controller from '../controllers/categories.js';
import { verifyJWT, requireRoles, ROLES } from '../middleware/auth.js';

export const router = Router();

// Exemples d'endpoints — à compléter dans controllers/categories.js
router.get('/', controller.list);
router.get('/:id', controller.detail);

// Protégés selon besoin (exemples)
router.post('/', verifyJWT, requireRoles(ROLES.EDITEUR, ROLES.GESTIONNAIRE, ROLES.ADMIN), controller.create);
router.put('/:id', verifyJWT, requireRoles(ROLES.EDITEUR, ROLES.GESTIONNAIRE, ROLES.ADMIN), controller.update);
router.delete('/:id', verifyJWT, requireRoles(ROLES.ADMIN, ROLES.GESTIONNAIRE), controller.remove);
