import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import * as authService from '../../services/authService';
import Button from '../../components/Button';
import './AuthStyles.css';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Mínimo 3 caracteres';
    } else if (formData.username.trim().length > 50) {
      newErrors.username = 'Máximo 50 caracteres';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
      const response = await authService.register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      // Guardar en contexto y localStorage
      login(response.token, response.user);

      // Redirigir a home
      navigate('/');
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Error al registrarse',
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
            <h1 className="auth-title">Crear Cuenta</h1>
            <p className="auth-subtitle">
              Únete a la comunidad de Simétrica
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {errors.general && (
              <div className="auth-error-banner" role="alert">
                {errors.general}
              </div>
            )}

            <div className="auth-form-group">
              <label htmlFor="username" className="auth-label">
                Nombre de usuario
              </label>
              <input
                type="text"
                id="username"
                className={`auth-input ${errors.username ? 'auth-input--error' : ''}`}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="johndoe"
                disabled={isLoading}
                autoComplete="username"
                aria-invalid={!!errors.username}
                aria-describedby={errors.username ? 'username-error' : undefined}
              />
              {errors.username && (
                <span id="username-error" className="auth-error" role="alert">
                  {errors.username}
                </span>
              )}
            </div>

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
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <span id="password-error" className="auth-error" role="alert">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="auth-form-group">
              <label htmlFor="confirmPassword" className="auth-label">
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                className={`auth-input ${errors.confirmPassword ? 'auth-input--error' : ''}`}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              />
              {errors.confirmPassword && (
                <span id="confirmPassword-error" className="auth-error" role="alert">
                  {errors.confirmPassword}
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
              {isLoading ? 'Creando cuenta...' : 'Registrarse'}
            </Button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="auth-link">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
