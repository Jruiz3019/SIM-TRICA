import { Router } from 'express';
import projectController from '../controllers/project.controller.js';
import { authenticate, isAdmin, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Rutas públicas (cualquiera puede ver proyectos)
router.get('/', optionalAuth, projectController.getAll);
router.get('/count', optionalAuth, projectController.getCount);
router.get('/search', optionalAuth, projectController.search);
router.get('/:id', optionalAuth, projectController.getById);

// Rutas protegidas - solo usuarios autenticados pueden reaccionar
router.post('/:id/react', authenticate, projectController.react);

// Rutas de administrador - solo ADMIN puede crear/editar/eliminar
router.post('/', authenticate, isAdmin, projectController.create);
router.put('/:id', authenticate, isAdmin, projectController.update);
router.delete('/:id', authenticate, isAdmin, projectController.delete);

export default router;
