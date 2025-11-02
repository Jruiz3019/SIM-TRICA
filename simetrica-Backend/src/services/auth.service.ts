import UserModel from '../models/user.model.js';
import type { IUser } from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambialo_en_produccion';

// Lista negra de tokens (en producción usar Redis)
const tokenBlacklist = new Set<string>();

export class AuthService {
  /**
   * Registra un nuevo usuario
   */
  async register(username: string, email: string, password: string): Promise<{ user: IUser; token: string }> {
    // Verificar si ya existe
    const exists = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      throw new Error('El email o nombre de usuario ya está registrado');
    }

    // Crear usuario
    const user = await UserModel.create({ username, email, password });

    // Generar token
    const token = this.generateToken(user);

    return { user, token };
  }

  /**
   * Login de usuario
   */
  async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    // Buscar usuario
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token
    const token = this.generateToken(user);

    return { user, token };
  }

  /**
   * Verifica un token JWT
   */
  verifyToken(token: string): any {
    try {
      // Verificar si el token está en la lista negra
      if (tokenBlacklist.has(token)) {
        throw new Error('Token inválido o expirado');
      }

      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  /**
   * Logout - Invalida el token
   */
  logout(token: string): void {
    // Agregar token a la lista negra
    tokenBlacklist.add(token);
  }

  /**
   * Genera un token JWT
   */
  private generateToken(user: IUser): string {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }
}

export default new AuthService();
