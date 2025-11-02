import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../context/useAuth';
import './PrivateRouteStyles.css';

interface PrivateRouteProps {
  children: ReactNode;
  requiredRole?: 'USER' | 'ADMIN';
}

/**
 * Componente para proteger rutas que requieren autenticación
 * y opcionalmente un rol específico
 */
export default function PrivateRoute({ children, requiredRole }: PrivateRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="private-route-loading">
        <div className="loading-spinner"></div>
        <span>Verificando acceso...</span>
      </div>
    );
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar rol requerido si se especifica
  if (requiredRole && user?.role !== requiredRole) {
    // Si requiere ADMIN pero el usuario no es admin, redirigir al inicio
    return <Navigate to="/" replace />;
  }

  // Usuario autenticado y con rol correcto, renderizar children
  return <>{children}</>;
}
