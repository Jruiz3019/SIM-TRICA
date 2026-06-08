import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware de manejo de errores
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error capturado:', err);

  // Duplicado MongoDB
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];
    const fieldNames: Record<string, string> = {
      email: 'correo electrónico',
      identificationNumber: 'número de identificación',
      nombre: 'nombre de empresa',
    };
    const fieldName = field ? (fieldNames[field] || field) : 'este campo';
    return res.status(409).json({ 
      message: `Ya existe un registro con ${fieldName}`
    });
  }

  // Validación Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Error de validación',
      errors: Object.values(err.errors).map((e: any) => e.message),
    });
  }

  // ID inválido
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'ID inválido' });
  }

  // Errores personalizados
  if (err.message) {
    return res.status(400).json({ message: err.message });
  }

  // Genérico
  res.status(500).json({ message: 'Error del servidor' });
}
