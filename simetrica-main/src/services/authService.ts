// src/services/authService.ts
// Servicio de autenticación conectado al backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: 'USER' | 'ADMIN';
  };
}

/**
 * Registra un nuevo usuario
 * POST /api/auth/register
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al registrarse');
  }

  return response.json();
}

/**
 * Inicia sesión
 * POST /api/auth/login
 */
export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al iniciar sesión');
  }

  return response.json();
}

/**
 * Cierra sesión
 * POST /api/auth/logout
 */
export async function logout(token: string): Promise<void> {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    // No lanzar error, el logout local debe continuar
  }
}
