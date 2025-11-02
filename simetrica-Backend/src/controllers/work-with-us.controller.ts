import type { Request, Response, NextFunction } from 'express';
import workWithUsService from '../services/work-with-us.service.js';

/**
 * Mapeo de texto a valores de enum para completedProjectsRange
 */
const projectsRangeMap: Record<string, string> = {
  '0 a 5 proyectos': '0_5',
  '5 a 10 proyectos': '5_10',
  '10 a 15 proyectos': '10_20',
  '15 a 20 proyectos': '10_20',
  '10 a 20 proyectos': '10_20',
  '20 a 25 proyectos': '20_30',
  '25 a 30 proyectos': '20_30',
  '20 a 30 proyectos': '20_30',
  '30 a 35 proyectos': '30_35',
  '35 a 40 proyectos': 'MORE_THAN_35',
  '40 a 45 proyectos': 'MORE_THAN_35',
  '45 a 50 proyectos': 'MORE_THAN_35',
  'Más de 50 proyectos': 'MORE_THAN_35',
};

/**
 * Controlador de Trabaja con Nosotros
 */
export class WorkWithUsController {
  /**
   * Crea una nueva aplicación
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('=== DATOS RECIBIDOS EN BACKEND ===');
      console.log(JSON.stringify(req.body, null, 2));

      // Mapear completedProjectsRange si viene como texto
      let completedProjectsRange = req.body.completedProjectsRange;
      if (completedProjectsRange && projectsRangeMap[completedProjectsRange]) {
        completedProjectsRange = projectsRangeMap[completedProjectsRange];
      }

      const dataToCreate = {
        ...req.body,
        completedProjectsRange,
        birthDate: new Date(req.body.birthDate),
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.get('user-agent'),
      };

      console.log('=== DATOS A GUARDAR EN DB ===');
      console.log(JSON.stringify(dataToCreate, null, 2));

      const application = await workWithUsService.create(dataToCreate);

      res.status(201).json({
        success: true,
        message: 'Aplicación enviada correctamente. Nos pondremos en contacto contigo pronto.',
        data: application,
      });
    } catch (error) {
      console.error('=== ERROR EN CONTROLADOR ===');
      console.error(error);
      next(error);
    }
  }

  /**
   * Lista aplicaciones con paginación
   */
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

  /**
   * Obtiene una aplicación por ID
   */
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

  /**
   * Actualiza el estado de una aplicación
   */
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

  /**
   * Elimina una aplicación (soft delete)
   */
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
