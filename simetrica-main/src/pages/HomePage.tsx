// src/pages/HomePage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLayout from "../layouts/HeaderLayout.tsx";
import Footer from "../layouts/Footer/Footer.tsx";
import Button from "../components/Button";
import "./styles/HomeStyle.css"
import Fondo from "../assets/DSCN7066.png"
import LogoSimetrica from "../assets/logo-simetrica-blanco.png"
import ProjectsSectionComponents from "../components/ProjectsSectionComponents.tsx";
import SimetricaSectionComponents from "../components/SimetricaSectionComponents.tsx";
import NosotrosSection from "../components/NosotrosSectionComponents.tsx";
import ServiciosSection from "../components/ServiciosSectionComponents.tsx";
import DisenosSection from "../components/DiseñosSectionComponents.tsx";
 
const Home = () => {
  const navigate = useNavigate();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsImageLoaded(true);
    img.src = Fondo;
  }, []);

  const scrollToSection = () => {
    const projectsSection = document.getElementById('sections-projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // AÑADIDO: Configuración de datos para Footer (manteniendo colores y branding existentes)
  const footerColumns = [
    {
      title: "Servicios",
      links: [
        { label: "Proyectos", href: "/proyectos" },
        { label: "Diseños", href: "/diseños" }
      ]
    },
    {
      title: "Empresa",
      links: [
        { label: "Asociados", href: "/asociados" },
        { label: "Trabaja con nosotros", href: "/trabaja-con-nosotros" },
        { label: "Contacto", href: "/contacto" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Política de Privacidad", href: "/privacidad" },
        { label: "Política de Cookies", href: "/cookies" },
        { label: "Términos de Servicio", href: "/terminos" }
      ]
    }
  ];

  const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com/simetrica_ia/", external: true },
    { label: "Facebook", href: "https://www.facebook.com/share/17PvCWuUtm/?mibextid=wwXIfr", external: true },
    { label: "TikTok", href: "https://www.tiktok.com/@simetrica7?_t=ZS-90L6hiOnqKe&_r=1", external: true },
    { label: "Pinterest", href: "https://co.pinterest.com/insonorizacion_acustica7/?invite_code=dd12bf69cdd14ac8aecd84e3f084a435&sender=595601256878326965", external: true },
    { label: "WhatsApp", href: "https://wa.me/573103858223", external: true }
  ];

  return (
    <>
      {/* Header fijo */}
      <HeaderLayout />
      
      {/* Sección principal con imagen de fondo */}
      <main className={`home-section ${isImageLoaded ? 'home-section--loaded' : ''}`}>
        {/* Imagen de fondo optimizada */}
        <div 
          className="home-section__background"
          style={{ 
            backgroundImage: isImageLoaded ? `url(${Fondo})` : 'none',
          }}
          role="img"
          aria-label="Imagen de fondo de la página principal de Simétrica"
        >
          {/* Overlay para mejorar legibilidad del contenido */}
          <div className="home-section__overlay"></div>
        </div>

        <div className="home-section__content">
          <div className="container">
            <div className="hero-content">
              <p className="hero-content__eyebrow hero-animate" style={{ '--d' : '0ms' } as React.CSSProperties}>
                SIMÉTRICA
              </p>
              <h1 className="hero-content__title">
                <span className="hero-animate" style={{ '--d': '150ms', '--y': '40px' } as React.CSSProperties}>
                  Bienvenido a{' '}
                </span>
                <span className="hero-animate hero-content__title-word" style={{ '--d': '230ms', '--y': '40px', '--dur': '800ms' } as React.CSSProperties}>
                  SIMÉTRICA
                </span>
              </h1>
              <p className="hero-content__subtitle hero-animate" style={{ '--d': '350ms', '--y': '20px', '--dur': '700ms' } as React.CSSProperties}>
                Diseños únicos y construcción profesional
              </p>
              
              <div className="hero-content__actions">
                <span className="hero-animate" style={{ '--d': '550ms', '--y': '16px', '--dur': '600ms' } as React.CSSProperties}>
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => navigate('/proyectos')}
                  >
                    Ver Proyectos
                  </Button>
                </span>
                
                <span className="hero-animate" style={{ '--d': '630ms', '--y': '16px', '--dur': '600ms' } as React.CSSProperties}>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={() => navigate('/contacto')}
                  >
                    Contactar
                  </Button>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div 
          className="scroll-indicator hero-animate" 
          aria-hidden="true"
          style={{ '--d': '900ms' } as React.CSSProperties}
          onClick={scrollToSection}
        >
          <div className="scroll-indicator__arrow"></div>
        </div>
      </main>
      <main className="home-sections-projects" id="sections-projects">
        <ProjectsSectionComponents />
      </main>
      <main className="home-section-simetrica">
        <SimetricaSectionComponents />
      </main>
      <main className="home-section-whyUs">
        <NosotrosSection />
      </main>
      <main className="home-section-servicios">
        <ServiciosSection />
      </main>
      <main>
        <DisenosSection />
      </main>

      {/* AÑADIDO: Footer reutilizable con configuración específica */}
      <Footer
        logoSrc={LogoSimetrica}
        logoAlt="Logo Simétrica - Empresa de diseño y construcción"
        columns={footerColumns}
        socialLinks={socialLinks}
        copyright="© 2025 Simétrica. Todos los derechos reservados."
        ariaLabel="Pie de página de Simétrica"
      />
    </>
  );
};

export default Home;