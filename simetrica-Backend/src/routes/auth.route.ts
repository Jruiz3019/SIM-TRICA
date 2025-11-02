import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * POST /api/auth/register - Registrar usuario (público)
 */
router.post('/register', authController.register.bind(authController));

/**
 * POST /api/auth/login - Login (público)
 */
router.post('/login', authController.login.bind(authController));

/**
 * POST /api/auth/logout - Logout (requiere autenticación)
 */
router.post('/logout', authenticate, authController.logout.bind(authController));

export default router;
