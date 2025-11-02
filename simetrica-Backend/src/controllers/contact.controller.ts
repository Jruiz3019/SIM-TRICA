import type { Request, Response, NextFunction } from 'express';
import contactService from '../services/contact.service.js';

/**
 * Controlador de Contactos
 */
export class ContactController {
  /**
   * Crea un nuevo contacto
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await contactService.create({
        ...req.body,
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.get('user-agent'),
      });

      res.status(201).json({
        success: true,
        message: 'Mensaje enviado correctamente',
        data: contact,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lista contactos con paginación
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await contactService.getAll(page, limit);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene un contacto por ID
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await contactService.getById(req.params.id!);

      if (!contact) {
        return res.status(404).json({ message: 'No encontrado' });
      }

      res.json(contact);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Marca un contacto como leído
   */
  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await contactService.markAsRead(req.params.id!);

      if (!contact) {
        return res.status(404).json({ message: 'Contacto no encontrado' });
      }

      res.json(contact);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualiza el estado de un contacto
   */
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'El estado es requerido' });
      }

      const contact = await contactService.updateStatus(req.params.id!, status);

      if (!contact) {
        return res.status(404).json({ message: 'Contacto no encontrado' });
      }

      res.json(contact);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Elimina un contacto
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await contactService.delete(req.params.id!);

      if (!deleted) {
        return res.status(404).json({ message: 'Contacto no encontrado' });
      }

      res.json({ message: 'Contacto eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  }
}

export default new ContactController();
