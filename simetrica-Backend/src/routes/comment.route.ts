import { Router } from 'express';
import commentController from '../controllers/comment.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Rutas públicas (cualquiera puede ver comentarios)
router.get('/project/:id', optionalAuth, commentController.getByPublication);
router.get('/design/:id', optionalAuth, commentController.getByPublication);

// Rutas protegidas - usuarios autenticados pueden comentar
router.post('/project/:id', authenticate, commentController.create);
router.post('/design/:id', authenticate, commentController.create);

// Actualizar, eliminar y reaccionar a comentarios
router.put('/:id', authenticate, commentController.update);
router.delete('/:id', authenticate, commentController.delete);
router.post('/:id/react', authenticate, commentController.react);

export default router;
