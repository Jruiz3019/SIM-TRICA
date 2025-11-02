/* MOVED: src/components/Footer -> src/layouts/Footer — motivo: reorganización de layout - Fecha: 2025-10-01 */
// src/layouts/Footer/index.ts
// Exportación centralizada del componente Footer para imports limpios

export { default } from './Footer';
export type { FooterProps, LinkItem, Column } from './Footer';

/* 
 * NOTA DE REORGANIZACIÓN: El Footer ahora reside en src/layouts
 * Uso recomendado actualizado:
 * import Footer, { type FooterProps } from '@/layouts/Footer';
 * 
 * Razón del cambio: Footer es un componente de layout, no un componente reutilizable general
 * Esta nueva ubicación refleja mejor su función en la arquitectura de la aplicación
 */