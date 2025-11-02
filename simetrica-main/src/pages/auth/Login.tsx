import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import * as authService from '../../services/authService';
import Button from '../../components/Button';
import './AuthStyles.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authService.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      // Guardar en contexto y localStorage
      login(response.token, response.user);

      // Redirigir según el rol
      if (response.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Error al iniciar sesión',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Botón de regreso al inicio */}
        <Link to="/" className="auth-back-link" aria-label="Volver al inicio">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver al inicio
        </Link>

        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Iniciar Sesión</h1>
            <p className="auth-subtitle">
              Bienvenido de vuelta a Simétrica
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {errors.general && (
              <div className="auth-error-banner" role="alert">
                {errors.general}
              </div>
            )}

            <div className="auth-form-group">
              <label htmlFor="email" className="auth-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`auth-input ${errors.email ? 'auth-input--error' : ''}`}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="tu@email.com"
                disabled={isLoading}
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <span id="email-error" className="auth-error" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="auth-form-group">
              <label htmlFor="password" className="auth-label">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                className={`auth-input ${errors.password ? 'auth-input--error' : ''}`}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <span id="password-error" className="auth-error" role="alert">
                  {errors.password}
                </span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading}
              loading={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="auth-link">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
