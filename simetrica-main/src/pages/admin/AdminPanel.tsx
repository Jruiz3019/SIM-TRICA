import { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import HeaderLayout from '../../layouts/HeaderLayout';
import Footer from '../../layouts/Footer';
import Tabs from '../../components/admin/Tabs';
import type { Tab } from '../../components/admin/Tabs';
import ContactMessagesSection from './ContactMessagesSection';
import WorkWithUsSection from './WorkWithUsSection';
import ProjectsSection from './ProjectsSection';
import DesignsSection from './DesignsSection';
import ImagesSection from './ImagesSection';
import CommentsSection from './CommentsSection';
import LogoSimetrica from '../../assets/logo-simetrica-blanco.png';
import './AdminPanelStyles.css';

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  // Definir las pestañas del panel administrativo
  const adminTabs: Tab[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
      content: <DashboardSection onNavigate={setActiveSection} />,
    },
    {
      id: 'messages',
      label: 'Mensajes',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
      ),
      content: <ContactMessagesSection />,
    },
    {
      id: 'applications',
      label: 'Aplicaciones',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      content: <WorkWithUsSection />,
    },
    {
      id: 'projects',
      label: 'Proyectos',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <path d="M3 9h18M9 21V9"/>
        </svg>
      ),
      content: <ProjectsSection />,
    },
    {
      id: 'designs',
      label: 'Diseños',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6"/>
        </svg>
      ),
      content: <DesignsSection />,
    },
    {
      id: 'images',
      label: 'Imágenes',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      ),
      content: <ImagesSection />,
    },
    {
      id: 'comments',
      label: 'Comentarios',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      content: <CommentsSection />,
    },
  ];

  return (
    <div className="admin-panel">
      <HeaderLayout />
      
      <main className="admin-panel__content">
        <div className="admin-panel__container">
          {/* Header del panel */}
          <header className="admin-panel__header">
            <h1 className="admin-panel__title">Panel Administrativo</h1>
            <p className="admin-panel__welcome">
              Bienvenido, <strong>{user?.username}</strong>
            </p>
          </header>

          {/* Sistema de Tabs */}
          <Tabs tabs={adminTabs} defaultTab={activeSection} />
        </div>
      </main>

      <Footer
        logoSrc={LogoSimetrica}
        logoAlt="Simétrica"
        columns={[
          {
            title: 'Servicios',
            links: [
              { label: 'Proyectos', href: '/proyectos' },
              { label: 'Diseños', href: '/diseños' },
              { label: 'Construcción', href: '/construccion' },
            ],
          },
          {
            title: 'Empresa',
            links: [
              { label: 'Asociados', href: '/asociados' },
              { label: 'Trabaja con nosotros', href: '/trabaja-con-nosotros' },
              { label: 'Contacto', href: '/contacto' },
            ],
          },
          {
            title: 'Legal',
            links: [
              { label: 'Política de Privacidad', href: '/privacidad' },
              { label: 'Términos de Servicio', href: '/terminos' },
            ],
          },
        ]}
        copyright="© 2025 Simétrica. Todos los derechos reservados."
        socialLinks={[
          { label: 'Instagram', href: '#', external: true },
          { label: 'Facebook', href: '#', external: true },
          { label: 'TikTok', href: '#', external: true },
          { label: 'Pinterest', href: '#', external: true },
          { label: 'WhatsApp', href: '#', external: true },
        ]}
      />
    </div>
  );
}

// Componente Dashboard con las cards
interface DashboardSectionProps {
  onNavigate: (section: string) => void;
}

function DashboardSection({ onNavigate }: DashboardSectionProps) {
  return (
    <div className="admin-panel__grid">
      {/* Proyectos */}
      <section className="admin-panel__card">
        <div className="admin-panel__card-icon">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
        </div>
        <h2 className="admin-panel__card-title">Proyectos</h2>
        <p className="admin-panel__card-description">
          Gestiona los proyectos de construcción
        </p>
        <button 
          className="admin-panel__card-button"
          onClick={() => onNavigate('projects')}
        >
          Administrar
        </button>
      </section>

      {/* Diseños */}
      <section className="admin-panel__card">
        <div className="admin-panel__card-icon">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6m6-12h-6m-6 0h6m5.657 5.657l-4.242-4.242m-2.829 0l-4.242 4.242M1 12h6m6 0h6"/>
          </svg>
        </div>
        <h2 className="admin-panel__card-title">Diseños</h2>
        <p className="admin-panel__card-description">
          Gestiona los diseños arquitectónicos
        </p>
        <button 
          className="admin-panel__card-button"
          onClick={() => onNavigate('designs')}
        >
          Administrar
        </button>
      </section>

      {/* Imágenes */}
      <section className="admin-panel__card">
        <div className="admin-panel__card-icon">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
        <h2 className="admin-panel__card-title">Imágenes</h2>
        <p className="admin-panel__card-description">
          Gestiona la galería de imágenes
        </p>
        <button 
          className="admin-panel__card-button"
          onClick={() => onNavigate('images')}
        >
          Administrar
        </button>
      </section>

      {/* Contactos */}
      <section className="admin-panel__card">
        <div className="admin-panel__card-icon">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </div>
        <h2 className="admin-panel__card-title">Mensajes</h2>
        <p className="admin-panel__card-description">
          Revisa mensajes de contacto
        </p>
        <button 
          className="admin-panel__card-button"
          onClick={() => onNavigate('messages')}
        >
          Administrar
        </button>
      </section>

      {/* Trabaja con Nosotros */}
      <section className="admin-panel__card">
        <div className="admin-panel__card-icon">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <h2 className="admin-panel__card-title">Aplicaciones</h2>
        <p className="admin-panel__card-description">
          Revisa solicitudes de empleo
        </p>
        <button 
          className="admin-panel__card-button"
          onClick={() => onNavigate('applications')}
        >
          Administrar
        </button>
      </section>

      {/* Comentarios */}
      <section className="admin-panel__card">
        <div className="admin-panel__card-icon">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <h2 className="admin-panel__card-title">Comentarios</h2>
        <p className="admin-panel__card-description">
          Modera comentarios de usuarios
        </p>
        <button 
          className="admin-panel__card-button"
          onClick={() => onNavigate('comments')}
        >
          Administrar
        </button>
      </section>
    </div>
  );
}
