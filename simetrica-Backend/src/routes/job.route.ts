import { Router } from 'express';
import jobController from '../controllers/job.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * GET /api/jobs - Listar vacantes activas (PÚBLICO)
 * Query params: search, ubicacion, modalidad, tipo
 */
router.get('/', jobController.getPublicJobs.bind(jobController));

/**
 * GET /api/jobs/stats - Estadísticas de vacantes (PÚBLICO)
 */
router.get('/stats', jobController.getStats.bind(jobController));

/**
 * GET /api/jobs/admin - Listar TODAS las vacantes (SOLO ADMIN)
 * Query params: page, limit
 */
router.get('/admin', authenticate, isAdmin, jobController.getAllAdmin.bind(jobController));

/**
 * GET /api/jobs/:id - Obtener vacante por ID (PÚBLICO)
 */
router.get('/:id', jobController.getById.bind(jobController));

/**
 * POST /api/jobs - Crear vacante (SOLO ADMIN)
 */
router.post('/', authenticate, isAdmin, jobController.create.bind(jobController));

/**
 * PATCH /api/jobs/:id - Actualizar vacante (SOLO ADMIN)
 */
router.patch('/:id', authenticate, isAdmin, jobController.update.bind(jobController));

/**
 * DELETE /api/jobs/:id - Eliminar vacante (SOLO ADMIN)
 */
router.delete('/:id', authenticate, isAdmin, jobController.delete.bind(jobController));

export default router;
