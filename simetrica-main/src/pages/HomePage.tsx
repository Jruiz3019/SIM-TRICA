// src/pages/HomePage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLayout from "../layouts/HeaderLayout.tsx";
import Footer from "../layouts/Footer/Footer.tsx";
import Button from "../components/Button";
import "./styles/HomeStyle.css"
import Fondo from "../assets/imagenInicio.jpg"
import LogoSimetrica from "../assets/logo-simetrica-blanco.png"
import ProjectsSectionComponents from "../components/ProjectsSectionComponents.tsx";
import SimetricaSectionComponents from "../components/SimetricaSectionComponents.tsx";
import NosotrosSection from "../components/NosotrosSectionComponents.tsx";
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
              <h1 className="hero-content__title">
                Bienvenido a SIMÉTRICA
              </h1>
              <p className="hero-content__subtitle">
                Diseños únicos y construcción profesional
              </p>
              
              <div className="hero-content__actions">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => navigate('/proyectos')}
                >
                  Ver Proyectos
                </Button>
                
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => navigate('/contacto')}
                >
                  Contactar
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="md"
                  onClick={scrollToSection}
                >
                  Más Información
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Indicador de scroll para UX mejorada */}
        <div 
          className="scroll-indicator" 
          aria-hidden="true"
          onClick={() => {
            const projectsSection = document.getElementById('sections-projects');
            if (projectsSection) {
              projectsSection.scrollIntoView({ behavior: "smooth" });
            }
          }}>
          <div className="scroll-indicator__arrow"></div>

        </div>
      </main>
      <main className="home-sections-projects" id="sections-projects">
        <div>
          <ProjectsSectionComponents />
        </div>
      </main>
      <main className="home-section-simetrica">
        <SimetricaSectionComponents />
      </main>
      <main className="home-section-whyUs">
        <NosotrosSection />
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