import { Router } from 'express';
import imageController from '../controllers/image.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Rutas públicas
router.get('/', imageController.getAll);
router.get('/:id', imageController.getById);

// Rutas protegidas - usuarios autenticados
router.get('/user/me', authenticate, imageController.getMyImages);

// Rutas de administrador
router.post('/', authenticate, isAdmin, imageController.create);
router.put('/:id', authenticate, imageController.update);
router.delete('/:id', authenticate, imageController.delete);

export default router;
