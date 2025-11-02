import React from 'react';
import HeaderLayout from '../layouts/HeaderLayout';
import Footer from '../layouts/Footer/Footer';
import ContactForm from '../components/ContactForm';
import './styles/ContactPageStyle.css';

// Datos del Footer (reutilizados de HomePage)
import LogoSimetrica from '../assets/logo-simetrica-blanco.png';

// Iconos de redes sociales
import InstagramIcon from '../assets/instagram.png';
import TikTokIcon from '../assets/tiktok.png';
import WhatsAppIcon from '../assets/whatsapp.png';
import PinterestIcon from '../assets/pinterest.png';
import FacebookIcon from '../assets/facebook.png';
import PhoneIcon from '../assets/phone.png';
import EmailIcon from '../assets/email.png';

const ContactPage: React.FC = () => {
  // Configuración de datos para Footer (manteniendo consistencia con HomePage)
  const footerColumns = [
    {
      title: "Servicios",
      links: [
        { label: "Proyectos", href: "/proyectos" },
        { label: "Diseños", href: "/diseños" },
        { label: "Construcción", href: "/construccion" }
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

  // Callbacks para el formulario
  const handleContactSuccess = () => {
    console.log(' Formulario enviado exitosamente');
  };

  const handleContactError = (error: Error) => {
    console.error(' Error al enviar formulario:', error.message);
  };

  return (
    <>
      {/* Header fijo */}
      <HeaderLayout />
      
      {/* Contenido principal de la página */}
      <main className="contact-page">
        <div className="contact-page__container">
          
          {/* Sección del formulario con dos columnas */}
          <section className="contact-page__form-section">
            <div className="contact-page__form-wrapper">
              {/* Columna izquierda: Título y Formulario */}
              <div className="contact-page__form-column">
                {/* Hero section - ahora dentro de la columna izquierda */}
                <div className="contact-page__hero">
                  <h1 className="contact-page__title">
                    Contáctanos
                  </h1>
                </div>
                
                <ContactForm 
                  onSuccess={handleContactSuccess}
                  onError={handleContactError}
                  className="contact-page__form"
                  ariaLabel="Formulario de contacto principal"
                />
              </div>
              
              {/* Columna derecha: Información de contacto */}
              <aside className="contact-page__info">
                <div className="contact-page__info-grid">
                  {/* Teléfono */}
                  <a href="https://wa.me/573103858223" className="contact-page__info-item" target="_blank" rel="noopener noreferrer">
                    <img src={PhoneIcon} alt="Teléfono" className="contact-page__info-icon" />
                    <h3 className="contact-page__info-title">Teléfono</h3>
                    <p className="contact-page__info-value">Teléfono</p>
                  </a>

                  {/* Correo electrónico */}
                  <a href="mailto:contacto@simetrica.com" className="contact-page__info-item">
                    <img src={EmailIcon} alt="Correo electrónico" className="contact-page__info-icon" />
                    <h3 className="contact-page__info-title">Correo electrónico</h3>
                    <p className="contact-page__info-value">Correo</p>
                  </a>
                </div>
                
                {/* Redes sociales - Separadas y más abajo */}
                <div className="contact-page__social-links">
                  <a href="https://www.instagram.com/simetrica_ia/" className="contact-page__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                    <img src={InstagramIcon} alt="Instagram" className="contact-page__social-icon" />
                  </a>
                  <a href="https://www.tiktok.com/@simetrica7?_t=ZS-90L6hiOnqKe&_r=1" className="contact-page__social-link" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
                    <img src={TikTokIcon} alt="TikTok" className="contact-page__social-icon" />
                  </a>
                  <a href="https://wa.me/573103858223" className="contact-page__social-link" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                    <img src={WhatsAppIcon} alt="WhatsApp" className="contact-page__social-icon" />
                  </a>
                  <a href="https://co.pinterest.com/insonorizacion_acustica7/?invite_code=dd12bf69cdd14ac8aecd84e3f084a435&sender=595601256878326965" className="contact-page__social-link" aria-label="Pinterest" target="_blank" rel="noopener noreferrer">
                    <img src={PinterestIcon} alt="Pinterest" className="contact-page__social-icon" />
                  </a>
                  <a href="https://www.facebook.com/share/17PvCWuUtm/?mibextid=wwXIfr" className="contact-page__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                    <img src={FacebookIcon} alt="Facebook" className="contact-page__social-icon" />
                  </a>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </main>

      {/* Footer reutilizable */}
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

export default ContactPage;