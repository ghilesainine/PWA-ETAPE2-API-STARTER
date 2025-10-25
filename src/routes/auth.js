import { Router } from 'express';
import * as controller from '../controllers/auth.js';
export const router = Router();
router.post('/register', controller.register);
router.post('/login', controller.login);
