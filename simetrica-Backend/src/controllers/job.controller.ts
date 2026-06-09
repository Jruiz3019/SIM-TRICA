import type { Request, Response, NextFunction } from 'express';
import jobService from '../services/job.service.js';

export class JobController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await jobService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Vacante creada correctamente',
        data: job,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPublicJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        search: req.query.search as string | undefined,
        ubicacion: req.query.ubicacion as string | undefined,
        modalidad: req.query.modalidad as string | undefined,
        tipo: req.query.tipo as string | undefined,
      };

      const result = await jobService.getPublicJobs(filters);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await jobService.getById(req.params.id!);

      if (!job) {
        return res.status(404).json({ message: 'Vacante no encontrada' });
      }

      res.json(job);
    } catch (error) {
      next(error);
    }
  }

  async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await jobService.getAllAdmin(page, limit);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await jobService.update(req.params.id!, req.body);

      if (!job) {
        return res.status(404).json({ message: 'Vacante no encontrada' });
      }

      res.json({
        success: true,
        message: 'Vacante actualizada correctamente',
        data: job,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await jobService.delete(req.params.id!);

      if (!deleted) {
        return res.status(404).json({ message: 'Vacante no encontrada' });
      }

      res.json({ message: 'Vacante eliminada correctamente' });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await jobService.getStats();

      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

export default new JobController();
