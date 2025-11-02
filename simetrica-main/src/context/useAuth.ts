import { useContext } from 'react';
import { AuthContext } from './AuthContext.tsx';
import type { AuthContextType } from './AuthContext.tsx';

/**
 * Hook para acceder al contexto de autenticación
 * Debe ser usado dentro de un AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
