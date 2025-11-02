import { Router } from 'express';
import workWithUsController from '../controllers/work-with-us.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * POST /api/work-with-us - Crear una nueva aplicación (PÚBLICO - sin autenticación)
 */
router.post('/', workWithUsController.create.bind(workWithUsController));

/**
 * GET /api/work-with-us - Listar todas las aplicaciones (SOLO ADMIN)
 * Query params: page, limit
 */
router.get('/', authenticate, isAdmin, workWithUsController.getAll.bind(workWithUsController));

/**
 * GET /api/work-with-us/:id - Obtener una aplicación por ID (SOLO ADMIN)
 */
router.get('/:id', authenticate, isAdmin, workWithUsController.getById.bind(workWithUsController));

/**
 * PATCH /api/work-with-us/:id/status - Actualizar estado de aplicación (SOLO ADMIN)
 */
router.patch('/:id/status', authenticate, isAdmin, workWithUsController.updateStatus.bind(workWithUsController));

/**
 * DELETE /api/work-with-us/:id - Eliminar una aplicación (SOLO ADMIN)
 */
router.delete('/:id', authenticate, isAdmin, workWithUsController.delete.bind(workWithUsController));

export default router;
