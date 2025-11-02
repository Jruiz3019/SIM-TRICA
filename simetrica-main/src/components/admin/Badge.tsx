import type { ReactNode } from 'react';
import './Badge.css';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'sm' | 'md';
}

export default function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  return (
    <span className={`badge badge--${variant} badge--${size}`}>
      {children}
    </span>
  );
}
