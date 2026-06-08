import type { Request, Response, NextFunction } from 'express';
import workWithUsService from '../services/work-with-us.service.js';

export class WorkWithUsController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dataToCreate = {
        ...req.body,
        birthDate: new Date(req.body.birthDate),
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.get('user-agent'),
      };

      const application = await workWithUsService.create(dataToCreate);

      res.status(201).json({
        success: true,
        message: 'Aplicación enviada correctamente. Nos pondremos en contacto contigo pronto.',
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await workWithUsService.getAll(page, limit);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await workWithUsService.getById(req.params.id!);

      if (!application) {
        return res.status(404).json({ message: 'No encontrado' });
      }

      res.json(application);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'El estado es requerido' });
      }

      const application = await workWithUsService.updateStatus(req.params.id!, status);

      if (!application) {
        return res.status(404).json({ message: 'Aplicación no encontrada' });
      }

      res.json(application);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await workWithUsService.delete(req.params.id!);

      if (!deleted) {
        return res.status(404).json({ message: 'Aplicación no encontrada' });
      }

      res.json({ message: 'Aplicación eliminada correctamente' });
    } catch (error) {
      next(error);
    }
  }
}

export default new WorkWithUsController();
