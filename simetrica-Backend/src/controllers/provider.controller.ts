import type { Request, Response, NextFunction } from 'express';
import providerService from '../services/provider.service.js';

export class ProviderController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        nombre,
        contacto,
        email,
        telefono,
        categoria,
        descripcion,
        ciudad,
        acepto,
      } = req.body;

      const sourceIp = (req.ip || req.socket.remoteAddress) as string | undefined;
      const sourceAgent = req.get('user-agent');

      const provider = await providerService.create({
        nombre,
        contacto,
        email,
        telefono,
        categoria,
        descripcion,
        ciudad,
        acepto,
        ipAddress: sourceIp || '',
        userAgent: sourceAgent || '',
      });

      res.status(201).json({
        success: true,
        message: 'Registro enviado correctamente. Nos pondremos en contacto contigo pronto.',
        data: provider,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const isAdmin = req.user?.role === 'ADMIN';

      if (isAdmin) {
        const page = parseInt(req.query.page as string) || 1;
        const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
        const status = req.query.status as string;
        const categoria = req.query.categoria as string;
        const search = req.query.search as string;

        const result = await providerService.getAllAdmin({
          page,
          limit,
          status,
          categoria,
          search,
        });

        res.json(result);
      } else {
        const providers = await providerService.getAllPublic();
        const categories = await providerService.getCategoriesSummary();

        res.json({
          data: providers,
          categories,
          total: providers.length,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const isAdmin = req.user?.role === 'ADMIN';
      const provider = isAdmin
        ? await providerService.getById(req.params.id!)
        : await providerService.getByIdPublic(req.params.id!);

      if (!provider) {
        return res.status(404).json({ message: 'Proveedor no encontrado' });
      }

      res.json(provider);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewedBy = req.user?.username || req.user?.email;
      const provider = await providerService.update(
        req.params.id!,
        req.body,
        reviewedBy
      );

      if (!provider) {
        return res.status(404).json({ message: 'Proveedor no encontrado' });
      }

      res.json(provider);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await providerService.delete(req.params.id!);

      if (!deleted) {
        return res.status(404).json({ message: 'Proveedor no encontrado' });
      }

      res.json({ message: 'Proveedor eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await providerService.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProviderController();
