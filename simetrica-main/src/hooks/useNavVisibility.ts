// src/hooks/useNavVisibility.ts
import { useEffect, useRef, useState, useCallback } from 'react';

interface UseNavVisibilityOptions {
  offset?: number;     // Píxeles de scroll antes de activar el comportamiento
  threshold?: number;  // Mínimo de píxeles de diferencia para considerar scroll
  autoHideDelay?: number; // Milisegundos antes de ocultar automáticamente (default: 4000ms)
}

/**
 * Hook personalizado para controlar visibilidad del navbar basado en scroll, mouse y tiempo
 * 
 * Comportamiento:
 * - Se oculta automáticamente después de 4 segundos de inactividad
 * - Se muestra al mover el mouse
 * - Se oculta al hacer scroll hacia abajo
 * - Se muestra al hacer scroll hacia arriba
 * - Usa requestAnimationFrame para mejor performance
 * 
 * @param options - Configuración del comportamiento
 * @returns visible - Boolean que indica si el navbar debe ser visible
 */
export function useNavVisibility({ 
  offset = 100, 
  threshold = 10,
  autoHideDelay = 2000
}: UseNavVisibilityOptions = {}): boolean {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef<number>(0);
  const ticking = useRef<boolean>(false);
  const autoHideTimer = useRef<number | null>(null);

  // Función para resetear el timer de auto-ocultamiento
  const resetAutoHideTimer = useCallback(() => {
    // Limpiar timer existente
    if (autoHideTimer.current !== null) {
      window.clearTimeout(autoHideTimer.current);
    }

    // Mostrar el navbar
    setVisible(true);

    // Crear nuevo timer para ocultar después del delay
    autoHideTimer.current = window.setTimeout(() => {
      // Solo ocultar si ya pasó el offset de scroll
      if (window.scrollY > offset) {
        setVisible(false);
      }
    }, autoHideDelay);
  }, [offset, autoHideDelay]);

  useEffect(() => {
    // Iniciar el timer cuando se monta el componente
    resetAutoHideTimer();

    const handleScroll = () => {
      if (ticking.current) return;
      
      ticking.current = true;
      
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
        
        // Solo procesar si el scroll supera el threshold (evita micro-movimientos)
        if (scrollDelta < threshold) {
          ticking.current = false;
          return;
        }

        // Lógica de visibilidad basada en dirección y posición
        if (currentScrollY > lastScrollY.current && currentScrollY > offset) {
          // Scroll hacia abajo y pasó el offset -> ocultar
          setVisible(false);
          // Cancelar timer ya que el usuario está scrolleando
          if (autoHideTimer.current !== null) {
            window.clearTimeout(autoHideTimer.current);
            autoHideTimer.current = null;
          }
        } else if (currentScrollY < lastScrollY.current) {
          // Scroll hacia arriba -> mostrar y resetear timer
          resetAutoHideTimer();
        }
        
        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    };

    // Handler para movimiento del mouse
    const handleMouseMove = () => {
      resetAutoHideTimer();
    };

    // Listeners optimizados con passive para mejor performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      // Limpiar timer al desmontar
      if (autoHideTimer.current !== null) {
        window.clearTimeout(autoHideTimer.current);
      }
    };
  }, [offset, threshold, resetAutoHideTimer]);

  return visible;
}