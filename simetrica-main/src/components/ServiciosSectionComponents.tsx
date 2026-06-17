import { useEffect, useState } from 'react';
import './styles/ServiciosSectionStyles.css';

const servicios = [
  {
    title: 'Insonorización acústica',
    desc: 'Reducción de ruido y control de transmisión sonora en espacios arquitectónicos.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    ),
  },
  {
    title: 'Acondicionamiento acústico',
    desc: 'Optimización de la calidad sonora interior mediante tratamiento de superficies.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
      </svg>
    ),
  },
  {
    title: 'Remodelación de templos',
    desc: 'Restauración y adecuación acústica de iglesias y espacios religiosos.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-4" />
        <circle cx="18" cy="7" r="3" />
        <circle cx="12" cy="1" r="3" />
        <circle cx="6" cy="13" r="3" />
      </svg>
    ),
  },
  {
    title: 'Carpintería especializada',
    desc: 'Fabricación e instalación de mobiliario a medida en madera.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="2" />
        <path d="M9 9v10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V9" />
        <path d="M8 4h8l1 3H7l1-3z" />
        <line x1="4" y1="12" x2="20" y2="12" />
      </svg>
    ),
  },
  {
    title: 'Drywall',
    desc: 'Construcción y acabados con sistemas de tabiquería ligera y cielos rasos.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <line x1="15" y1="3" x2="15" y2="21" />
      </svg>
    ),
  },
  {
    title: 'Iluminación',
    desc: 'Diseño e instalación de sistemas de iluminación arquitectónica y decorativa.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
      </svg>
    ),
  },
  {
    title: 'Supervisión de obra',
    desc: 'Control y seguimiento técnico de proyectos en todas sus etapas.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="M9 14l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Diseño 3D',
    desc: 'Modelado y visualización tridimensional de espacios y proyectos.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
];

const duplicatedServicios = [...servicios, ...servicios];

const ServiciosSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    const element = document.querySelector('.servicios-section');
    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`servicios-section ${isVisible ? 'servicios-section--visible' : ''}`}>
      <div className="servicios-section__header servicios-stagger" style={{ '--s': '0ms' } as React.CSSProperties}>
        <p className="servicios-section__eyebrow">Lo que hacemos</p>
        <h2 className="servicios-section__title">Nuestros Servicios</h2>
        <p className="servicios-section__subtitle">
          Soluciones integrales en diseño, acústica y construcción
        </p>
      </div>

      <div className="servicios-section__wrapper">
        <div className="servicios-section__track">
          {duplicatedServicios.map((svc, i) => (
            <div
              key={`${svc.title}-${i}`}
              className="servicios-section__card"
            >
              <div className="servicios-section__card-icon">{svc.icon}</div>
              <h3 className="servicios-section__card-title">{svc.title}</h3>
              <p className="servicios-section__card-desc">{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiciosSection;
