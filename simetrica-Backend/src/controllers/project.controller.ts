import type { Request, Response, NextFunction } from 'express';
import projectService from '../services/project.service.js';

class ProjectController {
  /**
   * Crear proyecto (solo ADMIN)
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre, cliente, descripcion, ubicacion, duracion, personasInvolucradas, imagenes } = req.body;

      if (!nombre || !cliente || !descripcion || !ubicacion || !duracion || !personasInvolucradas) {
        return res.status(400).json({ 
          message: 'Todos los campos son requeridos' 
        });
      }

      const project = await projectService.createProject(
        { nombre, cliente, descripcion, ubicacion, duracion, personasInvolucradas, imagenes },
        req.user!.id
      );

      res.status(201).json({
        success: true,
        project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener todos los proyectos (público)
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await projectService.getAllProjects(page, limit);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener un proyecto por ID (público)
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'ID requerido' });
      }
      const project = await projectService.getProjectById(id);

      if (!project) {
        return res.status(404).json({ message: 'Proyecto no encontrado' });
      }

      res.json({
        success: true,
        project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar proyecto (solo ADMIN)
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'ID requerido' });
      }
      const project = await projectService.updateProject(id, req.body);

      if (!project) {
        return res.status(404).json({ message: 'Proyecto no encontrado' });
      }

      res.json({
        success: true,
        project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar proyecto (solo ADMIN)
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'ID requerido' });
      }
      const project = await projectService.deleteProject(id);

      if (!project) {
        return res.status(404).json({ message: 'Proyecto no encontrado' });
      }

      res.json({
        success: true,
        message: 'Proyecto eliminado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reaccionar a un proyecto (like/dislike)
   */
  async react(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { type } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'ID requerido' });
      }

      if (!type || !['like', 'dislike'].includes(type)) {
        return res.status(400).json({ 
          message: 'El tipo de reacción debe ser "like" o "dislike"' 
        });
      }

      const project = await projectService.reactToProject(id, req.user!.id, type);

      res.json({
        success: true,
        project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener conteo de proyectos (público)
   */
  async getCount(req: Request, res: Response, next: NextFunction) {
    try {
      const total = await projectService.getProjectCount();
      res.json({ success: true, total });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Buscar proyectos (público)
   */
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: 'Parámetro de búsqueda requerido' });
      }

      const projects = await projectService.searchProjects(q);

      res.json({
        success: true,
        projects,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProjectController();
