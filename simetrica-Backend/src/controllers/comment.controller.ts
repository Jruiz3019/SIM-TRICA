import type { Request, Response, NextFunction } from 'express';
import commentService from '../services/comment.service.js';
import { UserRole } from '../models/user.model.js';

class CommentController {
  /**
   * Crear comentario (usuario autenticado)
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      
      // Detectar el tipo desde la ruta
      const publicacionTipo = req.path.includes('/project/') ? 'Project' : 'Design';

      if (!content) {
        return res.status(400).json({ 
          message: 'El contenido es requerido' 
        });
      }

      if (!id) {
        return res.status(400).json({ 
          message: 'ID de publicación requerido' 
        });
      }

      const comment = await commentService.createComment(
        { contenido: content, publicacionTipo, publicacionId: id },
        req.user!.id
      );

      res.status(201).json({
        success: true,
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener comentarios de una publicación (público)
   */
  async getByPublication(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      // Detectar el tipo desde la ruta
      const tipo = req.path.includes('/project/') ? 'Project' : 'Design';

      if (!id) {
        return res.status(400).json({ message: 'ID requerido' });
      }

      const result = await commentService.getCommentsByPublication(
        tipo as 'Project' | 'Design',
        id,
        page,
        limit
      );

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar comentario (solo el autor)
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { content } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'ID requerido' });
      }

      if (!content) {
        return res.status(400).json({ message: 'El contenido es requerido' });
      }

      const comment = await commentService.updateComment(id, content, req.user!.id);

      res.json({
        success: true,
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar comentario (autor o ADMIN)
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'ID requerido' });
      }
      const isAdmin = req.user!.role === UserRole.ADMIN;

      const comment = await commentService.deleteComment(id, req.user!.id, isAdmin);

      if (!comment) {
        return res.status(404).json({ message: 'Comentario no encontrado' });
      }

      res.json({
        success: true,
        message: 'Comentario eliminado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reaccionar a un comentario (like/dislike)
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

      const comment = await commentService.reactToComment(id, req.user!.id, type);

      res.json({
        success: true,
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CommentController();
