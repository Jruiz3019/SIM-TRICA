import { Router } from 'express';
import designController from '../controllers/design.controller.js';
import { authenticate, isAdmin, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Rutas públicas (cualquiera puede ver diseños)
router.get('/', optionalAuth, designController.getAll);
router.get('/search', optionalAuth, designController.search);
router.get('/:id', optionalAuth, designController.getById);

// Rutas protegidas - solo usuarios autenticados pueden reaccionar
router.post('/:id/react', authenticate, designController.react);

// Rutas de administrador - solo ADMIN puede crear/editar/eliminar
router.post('/', authenticate, isAdmin, designController.create);
router.put('/:id', authenticate, isAdmin, designController.update);
router.delete('/:id', authenticate, isAdmin, designController.delete);

export default router;
