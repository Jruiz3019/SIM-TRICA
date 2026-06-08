import { Router } from 'express';
import providerController from '../controllers/provider.controller.js';
import { authenticate, isAdmin, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', providerController.create.bind(providerController));

router.get('/', optionalAuth, providerController.getAll.bind(providerController));

router.get('/:id', optionalAuth, providerController.getById.bind(providerController));

router.get('/admin/stats', authenticate, isAdmin, providerController.getStats.bind(providerController));

router.patch('/:id', authenticate, isAdmin, providerController.update.bind(providerController));

router.delete('/:id', authenticate, isAdmin, providerController.delete.bind(providerController));

export default router;
