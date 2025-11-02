import type { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service.js';

export class AuthController {
  /**
   * Registrar usuario
   * POST /api/auth/register
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }

      const { user, token } = await authService.register(username, email, password);

      res.status(201).json({
        success: true,
        token,
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login de usuario
   * POST /api/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos' });
      }

      const { user, token } = await authService.login(email, password);

      res.json({
        success: true,
        token,
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout de usuario
   * POST /api/auth/logout
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // Obtener token del header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(400).json({ message: 'Token no proporcionado' });
      }

      const token = authHeader.substring(7);
      
      // Invalidar token
      authService.logout(token);

      res.json({
        success: true,
        message: 'Sesión cerrada correctamente',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
