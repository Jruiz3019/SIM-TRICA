import type { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service.js';
import { UserRole } from '../models/user.model.js';

// Extender Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
        role: UserRole;
      };
    }
  }
}

/**
 * Middleware para verificar que el usuario esté autenticado
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No autorizado. Token requerido' });
    }

    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

/**
 * Middleware para verificar que el usuario sea ADMIN
 */
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  if (req.user.role !== UserRole.ADMIN) {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador' });
  }

  next();
}

/**
 * Middleware para autenticación opcional (no lanza error si no hay token)
 * Útil para endpoints públicos que pueden tener funcionalidad extra si el usuario está autenticado
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = authService.verifyToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // Si el token es inválido, simplemente continuar sin usuario
    next();
  }
}
