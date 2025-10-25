import { Router } from 'express';
import * as controller from '../controllers/users.js';
import { verifyJWT, requireRoles, ROLES } from '../middleware/auth.js';
export const router = Router();
router.get('/', verifyJWT, requireRoles(ROLES.ADMIN), controller.list);
router.get('/me', verifyJWT, controller.me);
router.get('/:id', verifyJWT, requireRoles(ROLES.ADMIN), controller.detail);
