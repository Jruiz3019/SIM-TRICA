// src/pages/TermsOfServicePage.tsx
import React from 'react';
import HeaderLayout from '../layouts/HeaderLayout';
import Footer from '../layouts/Footer/Footer';
import Logo from '../assets/logoSi-blanco.png';
import './styles/TermsOfServicePageStyle.css';

const TermsOfServicePage: React.FC = () => {
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
      <HeaderLayout />
      
      <main className="terms-of-service">
        <div className="terms-of-service__container">
          <div className="terms-of-service__header">
            <h1 className="terms-of-service__title">Términos de Servicio</h1>
            <p className="terms-of-service__subtitle">Condiciones de uso de nuestros servicios</p>
          </div>

          <div className="terms-of-service__content">
            <section className="terms-of-service__section">
              <div className="terms-of-service__company-info">
                <p><strong>SIMÉTRICA S.A.S</strong></p>
                <p>Nit 901.850.566-8</p>
              </div>
            </section>

            <section className="terms-of-service__section">
              <h3 className="terms-of-service__heading">I. ACEPTACIÓN DE LOS TÉRMINOS</h3>
              <p className="terms-of-service__text">
                Al acceder y utilizar el sitio web de SIMÉTRICA S.A.S (en adelante "SIMÉTRICA"), usted acepta cumplir 
                y estar sujeto a los siguientes términos y condiciones de uso. Si no está de acuerdo con estos términos, 
                le solicitamos que no utilice nuestro sitio web ni nuestros servicios.
              </p>
              <p className="terms-of-service__text">
                SIMÉTRICA se reserva el derecho de modificar estos términos en cualquier momento. Las modificaciones 
                entrarán en vigor inmediatamente después de su publicación en el sitio web. Es responsabilidad del 
                usuario revisar periódicamente estos términos para estar al tanto de cualquier cambio.
              </p>
            </section>

            <section className="terms-of-service__section">
              <h3 className="terms-of-service__heading">II. DESCRIPCIÓN DE SERVICIOS</h3>
              <p className="terms-of-service__text">
                SIMÉTRICA ofrece servicios profesionales de diseño y construcción, incluyendo pero no limitado a:
              </p>
              <ul className="terms-of-service__list">
                <li>Diseño arquitectónico y de interiores</li>
                <li>Planificación y ejecución de proyectos de construcción</li>
                <li>Asesoría técnica especializada</li>
                <li>Gestión integral de proyectos</li>
                <li>Consultoría en diseño y construcción</li>
              </ul>
              <p className="terms-of-service__text">
                Los servicios específicos, alcances, tiempos de entrega y costos serán acordados mediante contrato 
                individual con cada cliente. La información presentada en el sitio web tiene carácter informativo y 
                no constituye una oferta vinculante.
              </p>
            </section>

            <section className="terms-of-service__section">
              <h3 className="terms-of-service__heading">III. USO DEL SITIO WEB</h3>
              <p className="terms-of-service__text">
                El usuario se compromete a utilizar el sitio web de manera lícita y de conformidad con estos términos. 
                Está prohibido:
              </p>
              <ul className="terms-of-service__list">
                <li>
                  <strong>Uso indebido:</strong> Utilizar el sitio web para fines ilegales, fraudulentos o que infrinjan 
                  los derechos de terceros.
                </li>
                <li>
                  <strong>Contenido prohibido:</strong> Publicar, transmitir o compartir contenido ofensivo, difamatorio, 
                  obsceno o que viole derechos de propiedad intelectual.
                </li>
                <li>
                  <strong>Interferencia técnica:</strong> Intentar acceder de manera no autorizada a sistemas, servidores 
                  o redes conectadas al sitio web.
                </li>
                <li>
                  <strong>Uso comercial no autorizado:</strong> Reproducir, distribuir o explotar comercialmente el 
                  contenido del sitio sin autorización previa y por escrito de SIMÉTRICA.
                </li>
              </ul>
            </section>

            <section className="terms-of-service__section">
              <h3 className="terms-of-service__heading">IV. PROPIEDAD INTELECTUAL</h3>
              <p className="terms-of-service__text">
                Todo el contenido del sitio web, incluyendo pero no limitado a textos, gráficos, logotipos, imágenes, 
                fotografías, diseños, software y otros materiales, es propiedad de SIMÉTRICA o de sus licenciantes y 
                está protegido por las leyes de propiedad intelectual de Colombia y tratados internacionales.
              </p>
              <p className="terms-of-service__text">
                El usuario reconoce que los diseños, proyectos, planos y demás trabajos realizados por SIMÉTRICA son 
                propiedad intelectual de la empresa, salvo acuerdo específico en contrario. El uso, reproducción o 
                distribución no autorizada de dichos materiales está estrictamente prohibido y puede resultar en 
                acciones legales.
              </p>
            </section>

            <section className="terms-of-service__section">
              <h3 className="terms-of-service__heading">V. PROTECCIÓN DE DATOS PERSONALES</h3>
              <p className="terms-of-service__text">
                SIMÉTRICA se compromete a proteger la privacidad y los datos personales de sus usuarios de conformidad 
                con la Ley 1581 de 2012 y sus decretos reglamentarios. Para mayor información sobre cómo recopilamos, 
                utilizamos y protegemos su información personal, consulte nuestra Política de Privacidad.
              </p>
              <p className="terms-of-service__text">
                Al utilizar nuestros servicios, el usuario consiente expresamente el tratamiento de sus datos personales 
                conforme a lo establecido en nuestra Política de Privacidad y autoriza a SIMÉTRICA a:
              </p>
              <ul className="terms-of-service__list">
                <li>Recopilar y almacenar información personal proporcionada voluntariamente</li>
                <li>Utilizar dicha información para la prestación de servicios contratados</li>
                <li>Contactar al usuario con fines relacionados con los servicios</li>
                <li>Enviar información comercial y promocional, salvo que el usuario manifieste lo contrario</li>
              </ul>
            </section>

            <section className="terms-of-service__section">
              <h3 className="terms-of-service__heading">VI. LIMITACIÓN DE RESPONSABILIDAD</h3>
              <p className="terms-of-service__text">
                SIMÉTRICA se esfuerza por mantener la información del sitio web actualizada y precisa, sin embargo, 
                no garantiza la exactitud, integridad o actualidad de la información presentada. El uso de la información 
                del sitio web es bajo el propio riesgo del usuario.
              </p>
              <p className="terms-of-service__text">
                SIMÉTRICA no será responsable por:
              </p>
              <ul className="terms-of-service__list">
                <li>
                  <strong>Daños indirectos:</strong> Pérdidas o daños indirectos, incidentales, especiales o consecuentes 
                  derivados del uso o la imposibilidad de uso del sitio web.
                </li>
                <li>
                  <strong>Interrupciones del servicio:</strong> Interrupciones temporales del sitio web por mantenimiento, 
                  actualizaciones o causas de fuerza mayor.
                </li>
                <li>
                  <strong>Enlaces externos:</strong> El contenido de sitios web de terceros vinculados desde nuestro sitio.
                </li>
                <li>
                  <strong>Virus o malware:</strong> Daños causados por virus, malware u otros componentes tecnológicamente 
                  dañinos que puedan infectar el equipo del usuario.
                </li>
              </ul>
            </section>

            <section className="terms-of-service__section">
              <h3 className="terms-of-service__heading">VII. CONTRATACIÓN DE SERVICIOS</h3>
              <p className="terms-of-service__text">
                La contratación de servicios profesionales de SIMÉTRICA requerirá la formalización de un contrato 
                específico que detallará:
              </p>
              <ul className="terms-of-service__list">
                <li>Alcance detallado de los servicios a prestar</li>
                <li>Cronograma de ejecución y plazos de entrega</li>
                <li>Costos, forma de pago y condiciones económicas</li>
                <li>Obligaciones y responsabilidades de ambas partes</li>
                <li>Garantías y condiciones de finalización del proyecto</li>
              </ul>
              <p className="terms-of-service__text">
                Los términos específicos del contrato prevalecerán sobre estos términos generales de servicio en caso 
                de conflicto o contradicción.
              </p>
            </section>

            <section className="terms-of-service__section">
              <h3 className="terms-of-service__heading">VIII. LEGISLACIÓN APLICABLE Y JURISDICCIÓN</h3>
              <p className="terms-of-service__text">
                Estos términos de servicio se regirán e interpretarán de conformidad con las leyes de la República de 
                Colombia. Cualquier disputa relacionada con estos términos estará sujeta a la jurisdicción exclusiva 
                de los tribunales competentes de Colombia.
              </p>
              <p className="terms-of-service__text">
                En caso de controversia, las partes acuerdan buscar una solución amistosa antes de acudir a instancias 
                judiciales, privilegiando mecanismos alternativos de solución de conflictos como la mediación o la 
                conciliación.
              </p>
            </section>

            <section className="terms-of-service__section">
              <h3 className="terms-of-service__heading">IX. VIGENCIA Y MODIFICACIONES</h3>
              <p className="terms-of-service__text">
                Estos términos de servicio están vigentes desde la fecha de su publicación y permanecerán en vigor 
                hasta que sean modificados o reemplazados por SIMÉTRICA.
              </p>
              <p className="terms-of-service__text">
                SIMÉTRICA se reserva el derecho de actualizar, modificar o reemplazar estos términos en cualquier 
                momento sin previo aviso. Es responsabilidad del usuario revisar periódicamente esta página para 
                estar al tanto de cualquier cambio. El uso continuado del sitio web después de la publicación de 
                modificaciones constituye la aceptación de dichos cambios.
              </p>
            </section>

            <section className="terms-of-service__section">
              <h3 className="terms-of-service__heading">X. CONTACTO</h3>
              <p className="terms-of-service__text">
                Para cualquier pregunta, aclaración o solicitud relacionada con estos términos de servicio, puede 
                contactarnos a través de:
              </p>
              
              <div className="terms-of-service__contact">
                <h4 className="terms-of-service__contact-title">Información de Contacto</h4>
                <ul className="terms-of-service__contact-list">
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

              <p className="terms-of-service__text terms-of-service__text--final">
                <strong>Última actualización:</strong> Noviembre de 2025
              </p>
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

export default TermsOfServicePage;
