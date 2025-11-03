// src/pages/CookiesPolicyPage.tsx
import React from 'react';
import HeaderLayout from '../layouts/HeaderLayout';
import Footer from '../layouts/Footer/Footer';
import Logo from '../assets/logoSi-blanco.png';
import './styles/CookiesPolicyPageStyle.css';

const CookiesPolicyPage: React.FC = () => {
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
      <HeaderLayout />
      
      <main className="cookies-policy">
        <div className="cookies-policy__container">
          <div className="cookies-policy__header">
            <h1 className="cookies-policy__title">Política de Cookies</h1>
            <p className="cookies-policy__subtitle">Información sobre el uso de cookies en nuestro sitio web</p>
          </div>

          <div className="cookies-policy__content">
            <section className="cookies-policy__section">
              <div className="cookies-policy__company-info">
                <p><strong>SIMÉTRICA S.A.S</strong></p>
                <p>Nit 901.850.566-8</p>
              </div>
            </section>

            <section className="cookies-policy__section">
              <h3 className="cookies-policy__heading">I. ¿QUÉ SON LAS COOKIES?</h3>
              <p className="cookies-policy__text">
                Las cookies son pequeños archivos de texto que se instalan en el dispositivo del usuario al acceder a un 
                sitio web. Permiten reconocer al usuario, recordar sus preferencias y mejorar su experiencia de navegación.
              </p>
              <p className="cookies-policy__text">
                En cumplimiento de la Ley 1581 de 2012, el Decreto 1377 de 2013, la Circular Externa 002 de 2015 de la 
                Superintendencia de Industria y Comercio (SIC) y la Ley 1480 de 2011 – Estatuto del Consumidor, informamos 
                sobre el uso de cookies en nuestro sitio web con el fin de garantizar la transparencia en el tratamiento 
                de datos personales y brindar a los usuarios control sobre su información.
              </p>
              <p className="cookies-policy__text">
                En SIMÉTRICA utilizamos cookies con fines legítimos, principalmente para optimizar la funcionalidad del 
                sitio, facilitar la navegación y ofrecer una experiencia digital segura y personalizada a quienes consultan 
                nuestros servicios especializados.
              </p>
            </section>

            <section className="cookies-policy__section">
              <h3 className="cookies-policy__heading">II. ¿QUÉ TIPO DE COOKIES UTILIZA ESTA PÁGINA WEB?</h3>
              <p className="cookies-policy__text">
                En SIMÉTRICA utilizamos las siguientes cookies para mejorar su experiencia como usuario y optimizar 
                nuestros servicios digitales:
              </p>

              <ul className="cookies-policy__list">
                <li>
                  <strong>Cookies de Funcionalidad:</strong> Permiten recordar configuraciones del usuario, como idioma, 
                  formato de visualización y preferencias de acceso, con el fin de facilitar una navegación más ágil.
                </li>
                <li>
                  <strong>Cookies de análisis de uso:</strong> Son aquéllas que bien tratadas por nosotros o por terceros, 
                  nos permiten cuantificar el número de usuarios y así realizar la medición y análisis estadístico de la 
                  utilización que hacen los usuarios del servicio ofertado. Para ello se analiza su navegación en nuestra 
                  página web con el fin de mejorar la oferta de servicios que ofrecemos.
                </li>
                <li>
                  <strong>Cookies de Personalización:</strong> Facilitan la adaptación de contenidos y recursos a los 
                  intereses del usuario, ofreciendo una experiencia más acorde con sus necesidades.
                </li>
                <li>
                  <strong>Cookies de Seguridad:</strong> Se emplean para proteger la confidencialidad de las consultas y 
                  garantizar que las interacciones dentro del sitio web se desarrollen en un entorno seguro.
                </li>
                <li>
                  <strong>Formularios de contacto:</strong> Facilitar el envío de consultas y contacto.
                </li>
                <li>
                  <strong>Cookies de Rendimiento:</strong> Nos ayudan a comprender cómo interactúan los usuarios con nuestro 
                  sitio, recopilando información sobre páginas visitadas, tiempo de permanencia y posibles errores de 
                  navegación. Esto permite mejorar la calidad y eficacia de nuestros servicios digitales.
                </li>
                <li>
                  <strong>Cookies Estrictamente Necesarias:</strong> Son esenciales para el funcionamiento básico del sitio 
                  web y no pueden desactivarse. Permiten, entre otros, la navegación, la seguridad y el acceso a áreas 
                  restringidas del portal.
                </li>
                <li>
                  <strong>Cookies de Terceros:</strong> Nuestro sitio web puede utilizar servicios de terceros que establecen 
                  sus propias cookies, como:
                  <ul className="cookies-policy__sublist">
                    <li>Google Analytics: Análisis del tráfico web</li>
                    <li>Google Fonts: Optimización en la carga de fuentes web</li>
                    <li>Otros servicios de análisis y funcionalidad: Algunas cookies son esenciales para el funcionamiento 
                    del sitio, por ejemplo, el buscador incorporado o herramientas digitales asociadas al portal.</li>
                  </ul>
                </li>
              </ul>
            </section>

            <section className="cookies-policy__section">
              <h3 className="cookies-policy__heading">III. DERECHOS DEL USUARIO Y CONTROL DE COOKIES</h3>
              <p className="cookies-policy__text">
                Conforme a la Ley 1581 de 2012 y las directrices de la SIC, el usuario cuenta con los siguientes derechos 
                frente al uso de cookies:
              </p>

              <ul className="cookies-policy__list">
                <li>
                  <strong>Derecho a ser informado sobre el uso de cookies.</strong>
                </li>
                <li>
                  <strong>Derecho de acceso,</strong> para conocer qué cookies están activas en su dispositivo.
                </li>
                <li>
                  <strong>Derecho de rectificación,</strong> para modificar configuraciones.
                </li>
                <li>
                  <strong>Derecho de supresión,</strong> para eliminar cookies instaladas.
                </li>
                <li>
                  <strong>Derecho de oposición,</strong> para rechazar cookies no esenciales.
                </li>
              </ul>

              <p className="cookies-policy__text">
                El usuario podrá configurar su navegador para permitir, bloquear o eliminar cookies según sus preferencias. 
                Es importante señalar que, si se bloquean todas las cookies, es posible que ciertas funcionalidades del 
                sitio no se encuentren disponibles o que la experiencia de navegación se vea limitada.
              </p>
            </section>

            <section className="cookies-policy__section">
              <h3 className="cookies-policy__heading">IV. GUÍAS RÁPIDAS DE CONFIGURACIÓN</h3>
              <p className="cookies-policy__text">
                El Usuario puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración 
                de las opciones del navegador instalado en su ordenador.
              </p>
              <p className="cookies-policy__text">
                En la mayoría de los navegadores web se ofrece la posibilidad de permitir, bloquear o eliminar las cookies 
                instaladas en su equipo.
              </p>

              <ul className="cookies-policy__list">
                <li>Configurar su navegador para evitar nuevas cookies</li>
                <li>Modificar la configuración para cookies específicas</li>
                <li>Contactarnos para ejercer sus derechos</li>
              </ul>

              <p className="cookies-policy__text">
                El Usuario puede eliminar y bloquear todas las cookies de este sitio, pero parte del sitio no funcionará 
                o la calidad de la página web y de los Contenidos pueden verse afectados.
              </p>

              <h4 className="cookies-policy__subheading">IV.1. Configuración del Navegador</h4>
              <p className="cookies-policy__text">
                Para obtener información sobre cómo controlar las cookies en los navegadores más populares, visite:
              </p>

              <ul className="cookies-policy__list cookies-policy__list--browsers">
                <li>
                  <strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies
                </li>
                <li>
                  <strong>Firefox:</strong> Preferencias → Privacidad y seguridad
                </li>
                <li>
                  <strong>Safari:</strong> Preferencias → Privacidad
                </li>
                <li>
                  <strong>Microsoft Edge:</strong> Configuración → Privacidad, búsqueda y servicios
                </li>
              </ul>
            </section>

            <section className="cookies-policy__section">
              <h3 className="cookies-policy__heading">V. MARCO NORMATIVO</h3>
              <p className="cookies-policy__text">
                Nuestra política de cookies se fundamenta en la normatividad colombiana vigente:
              </p>

              <ul className="cookies-policy__list">
                <li><strong>Ley 1581 de 2012:</strong> Protección de datos personales</li>
                <li><strong>Decreto 1377 de 2013:</strong> Reglamentario de la Ley 1581</li>
                <li><strong>Circular Externa 002 de 2015:</strong> Superintendencia de Industria y Comercio</li>
                <li><strong>Ley 1480 de 2011:</strong> Estatuto del Consumidor</li>
              </ul>

              <p className="cookies-policy__text">
                Nos reservamos el derecho de actualizar esta política en caso de cambios regulatorios o tecnológicos. 
                Cualquier modificación sustancial será comunicada oportunamente, en cumplimiento de la normatividad vigente.
              </p>
            </section>

            <section className="cookies-policy__section">
              <h3 className="cookies-policy__heading">VI. INFORMACIÓN DE CONTACTO</h3>
              <p className="cookies-policy__text">
                Para ejercer sus derechos relacionados con el uso de cookies o resolver inquietudes sobre esta política, 
                puede contactarnos en:
              </p>
              
              <div className="cookies-policy__contact">
                <h4 className="cookies-policy__contact-title">Contacto Directo</h4>
                <ul className="cookies-policy__contact-list">
                  <li>
                    <strong>Teléfono:</strong> <a href="tel:+573103858223">+57 310 385 8223</a>
                  </li>
                  <li>
                    <strong>Correo electrónico:</strong> <a href="mailto:contacto@simetrica.com">contacto@simetrica.com</a>
                  </li>
                  <li>
                    <strong>Página web:</strong> <a href="https://www.simetrica.com" target="_blank" rel="noopener noreferrer">www.simetrica.com</a>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer
        logoSrc={Logo}
        logoAlt="Logo Simétrica - Empresa de diseño"
        columns={footerColumns}
        copyright="© 2025 Simétrica. Todos los derechos reservados."
        socialLinks={socialLinks}
      />
    </>
  );
};

export default CookiesPolicyPage;
