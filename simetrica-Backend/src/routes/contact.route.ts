import { Router } from 'express';
import contactController from '../controllers/contact.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * POST /api/contact - Crear un nuevo contacto (PÚBLICO - sin autenticación)
 */
router.post('/', contactController.create.bind(contactController));

/**
 * GET /api/contact - Listar todos los contactos (SOLO ADMIN)
 * Query params: page, limit
 */
router.get('/', authenticate, isAdmin, contactController.getAll.bind(contactController));

/**
 * GET /api/contact/:id - Obtener un contacto por ID (SOLO ADMIN)
 */
router.get('/:id', authenticate, isAdmin, contactController.getById.bind(contactController));

/**
 * PATCH /api/contact/:id/read - Marcar contacto como leído (SOLO ADMIN)
 */
router.patch('/:id/read', authenticate, isAdmin, contactController.markAsRead.bind(contactController));

/**
 * PATCH /api/contact/:id/status - Actualizar estado del contacto (SOLO ADMIN)
 */
router.patch('/:id/status', authenticate, isAdmin, contactController.updateStatus.bind(contactController));

/**
 * DELETE /api/contact/:id - Eliminar un contacto (SOLO ADMIN)
 */
router.delete('/:id', authenticate, isAdmin, contactController.delete.bind(contactController));

export default router;
