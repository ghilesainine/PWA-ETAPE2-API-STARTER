import { Router } from 'express';
import * as controller from '../controllers/panier.js';
import { verifyJWT } from '../middleware/auth.js';
export const router = Router();
router.get('/', verifyJWT, controller.list);
router.post('/items', verifyJWT, controller.create);
router.put('/items/:id', verifyJWT, controller.update);
router.delete('/items/:id', verifyJWT, controller.remove);