// src/components/Button/Button.tsx
import React, { forwardRef } from 'react';
import './ButtonStyle.css';

/* 
 * COMPONENTE AÑADIDO: Button reutilizable con TypeScript completo
 * Sigue las convenciones del proyecto (CSS regular, variables globales, BEM naming)
 * Implementa accesibilidad WCAG 2.1 AA y responsividad total
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;     // Variantes de estilo usando colores del branding
  size?: ButtonSize;           // Tamaños responsive
  fullWidth?: boolean;         // Botón de ancho completo
  className?: string;          // Clase CSS adicional para personalización
  href?: string;               // Si se pasa, renderiza <a> en lugar de <button>
  target?: string;             // Target para enlaces (ej: '_blank')
  rel?: string;                // Rel para enlaces (ej: 'noopener noreferrer')
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  ariaLabel?: string;          // ARIA label para accesibilidad
  disabled?: boolean;          // Estado deshabilitado
  type?: 'button' | 'submit' | 'reset';  // Tipo de botón HTML
  loading?: boolean;           // Estado de carga opcional
}

/**
 * Componente Button reutilizable y accesible
 * 
 * CARACTERÍSTICAS IMPLEMENTADAS:
 * - Renderizado condicional: <button> para acciones, <a> para navegación
 * - Accesibilidad completa: ARIA labels, focus visible, navegación por teclado
 * - Responsive: Tamaños adaptativos con clamp() y media queries
 * - Performance: forwardRef para refs, transiciones optimizadas
 * - Branding: Variables CSS del sistema existente
 * 
 * @param props - Props del componente Button
 * @param ref - Ref forwarded para acceso directo al elemento DOM
 */
const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      className = '',
      href,
      target,
      rel,
      onClick,
      ariaLabel,
      disabled = false,
      type = 'button',
      loading = false
    },
    ref
  ) => {
    // Construcción de clases CSS siguiendo convención BEM del proyecto
    const classes = [
      'button',                              // Clase base
      `button--${variant}`,                  // Variante de estilo
      `button--${size}`,                     // Tamaño
      fullWidth ? 'button--full-width' : '', // Ancho completo
      disabled ? 'button--disabled' : '',    // Estado deshabilitado
      loading ? 'button--loading' : '',      // Estado de carga
      className                              // Clases adicionales
    ].filter(Boolean).join(' ');

    // Props comunes para ambos elementos
    const commonProps = {
      className: classes,
      onClick: disabled || loading ? undefined : onClick,
      'aria-label': ariaLabel,
      'aria-disabled': disabled || loading,
    };

    // Renderizado condicional: <a> si href está presente, <button> si no
    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...commonProps}
          href={disabled || loading ? undefined : href}
          target={target}
          rel={target === '_blank' && !rel ? 'noopener noreferrer' : rel}
          tabIndex={disabled || loading ? -1 : 0}
          role="button" // ARIA role para mantener semántica de botón
        >
          {loading ? (
            <span className="button__loading">
              <span className="button__spinner" aria-hidden="true"></span>
              Cargando...
            </span>
          ) : (
            children
          )}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        {...commonProps}
        disabled={disabled || loading}
        type={type}
      >
        {loading ? (
          <span className="button__loading">
            <span className="button__spinner" aria-hidden="true"></span>
            Cargando...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

// DisplayName para debugging en React DevTools
Button.displayName = 'Button';

export default Button;