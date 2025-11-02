// src/hooks/useResponsive.ts
import { useState, useEffect } from 'react';

// Definición de breakpoints
const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
  tv: 1920,
} as const;

type BreakpointKey = keyof typeof breakpoints;

interface UseResponsiveReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTV: boolean;
  screenWidth: number;
  orientation: 'portrait' | 'landscape';
}

/**
 * Hook personalizado para manejar responsividad
 * Proporciona información sobre el tamaño de pantalla actual y orientación
 * @returns {UseResponsiveReturn} Objeto con información de responsividad
 */
export const useResponsive = (): UseResponsiveReturn => {
  const [screenWidth, setScreenWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    typeof window !== 'undefined' 
      ? window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      : 'landscape'
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenWidth(width);
      setOrientation(height > width ? 'portrait' : 'landscape');
    };

    // Throttle function para mejor performance
    let timeoutId: number;
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', throttledResize);
    window.addEventListener('orientationchange', throttledResize);

    return () => {
      window.removeEventListener('resize', throttledResize);
      window.removeEventListener('orientationchange', throttledResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return {
    isMobile: screenWidth < breakpoints.mobile,
    isTablet: screenWidth >= breakpoints.mobile && screenWidth < breakpoints.tablet,
    isDesktop: screenWidth >= breakpoints.tablet && screenWidth < breakpoints.tv,
    isTV: screenWidth >= breakpoints.tv,
    screenWidth,
    orientation,
  };
};

/**
 * Hook para detectar si estamos en un dispositivo específico
 * @param {BreakpointKey} breakpoint - El breakpoint a detectar
 * @returns {boolean} Si estamos en o por encima del breakpoint especificado
 */
export const useBreakpoint = (breakpoint: BreakpointKey): boolean => {
  const [matches, setMatches] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth >= breakpoints[breakpoint] : false
  );

  useEffect(() => {
    const handleResize = () => {
      setMatches(window.innerWidth >= breakpoints[breakpoint]);
    };

    let timeoutId: number;
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', throttledResize);
    
    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(timeoutId);
    };
  }, [breakpoint]);

  return matches;
};

export default useResponsive;