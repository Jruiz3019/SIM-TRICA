import type { Request, Response, NextFunction } from 'express';
import designService from '../services/design.service.js';

class DesignController {
  /**
   * Crear diseño (solo ADMIN)
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre, descripcion, imagenes } = req.body;

      if (!nombre || !descripcion) {
        return res.status(400).json({ 
          message: 'El nombre y la descripción son requeridos' 
        });
      }

      const design = await designService.createDesign(
        { nombre, descripcion, imagenes },
        req.user!.id
      );

      res.status(201).json({
        success: true,
        design,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener todos los diseños (público)
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await designService.getAllDesigns(page, limit);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener un diseño por ID (público)
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'ID requerido' });
      }
      const design = await designService.getDesignById(id);

      if (!design) {
        return res.status(404).json({ message: 'Diseño no encontrado' });
      }

      res.json({
        success: true,
        design,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar diseño (solo ADMIN)
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'ID requerido' });
      }
      const design = await designService.updateDesign(id, req.body);

      if (!design) {
        return res.status(404).json({ message: 'Diseño no encontrado' });
      }

      res.json({
        success: true,
        design,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar diseño (solo ADMIN)
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'ID requerido' });
      }
      const design = await designService.deleteDesign(id);

      if (!design) {
        return res.status(404).json({ message: 'Diseño no encontrado' });
      }

      res.json({
        success: true,
        message: 'Diseño eliminado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reaccionar a un diseño (like/dislike)
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

      const design = await designService.reactToDesign(id, req.user!.id, type);

      res.json({
        success: true,
        design,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Buscar diseños (público)
   */
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: 'Parámetro de búsqueda requerido' });
      }

      const designs = await designService.searchDesigns(q);

      res.json({
        success: true,
        designs,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DesignController();
