import type { Request, Response, NextFunction } from 'express';
import imageService from '../services/image.service.js';
import { UserRole } from '../models/user.model.js';

class ImageController {
  /**
   * Guardar información de imagen (ADMIN)
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { url, filename, description, altText, size, mimeType } = req.body;

      if (!url || !filename || !mimeType) {
        return res.status(400).json({ 
          message: 'URL, nombre de archivo y tipo MIME son requeridos' 
        });
      }

      // Para URLs externas, size puede ser 0
      const finalSize = size || 0;

      const image = await imageService.createImage(
        { url, filename, description, altText, size: finalSize, mimeType },
        req.user!.id
      );

      res.status(201).json({
        success: true,
        data: image,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener imagen por ID (público)
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'ID requerido' });
      }
      const image = await imageService.getImageById(id);

      if (!image) {
        return res.status(404).json({ message: 'Imagen no encontrada' });
      }

      res.json({
        success: true,
        data: image,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener todas las imágenes con paginación (público)
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await imageService.getAllImages(page, limit);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener imágenes del usuario autenticado
   */
  async getMyImages(req: Request, res: Response, next: NextFunction) {
    try {
      const images = await imageService.getImagesByUser(req.user!.id);

      res.json({
        success: true,
        data: images,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar información de imagen (ADMIN o propietario)
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { description, altText } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'ID requerido' });
      }

      const isAdmin = req.user!.role === UserRole.ADMIN;

      const image = await imageService.updateImage(
        id,
        { description, altText },
        req.user!.id,
        isAdmin
      );

      res.json({
        success: true,
        data: image,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar imagen (ADMIN o propietario)
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'ID requerido' });
      }
      const isAdmin = req.user!.role === UserRole.ADMIN;

      const image = await imageService.deleteImage(id, req.user!.id, isAdmin);

      if (!image) {
        return res.status(404).json({ message: 'Imagen no encontrada' });
      }

      res.json({
        success: true,
        message: 'Imagen eliminada correctamente',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ImageController();
