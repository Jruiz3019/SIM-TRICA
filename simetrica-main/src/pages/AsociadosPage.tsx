import HeaderLayout from '../layouts/HeaderLayout';
import Footer from '../layouts/Footer/Footer';
import LogoSimetrica from '../assets/logo-simetrica-blanco.png';
import HeroBackground from '../assets/Diseno.png';  // Asumiendo que la imagen está en assets, ajusta la ruta si es necesario
import './styles/AsociadosPageStyle.css';

const AsociadosPage = () => {
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

    return (
        <>
      <HeaderLayout />

      <main className="asociados-page">
        <section className="asociados-hero">
          <div className="hero-image">
            <img src={HeroBackground} alt="Hero background" />
          </div>
          <div className="hex-box">
            <h2>Nuestros Asociados</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur euismod
              tellus sed lacus tincidunt lacinia sed sit amet odio. Etiam vitae bibendum elit.
            </p>
          </div>
        </section>

        <section className="asociados-list">
          <div className="asociados-grid">
            {/* ejemplo: 3 tarjetas */}
            {[
              { id: 1, name: 'Nombre Asociado 1', logo: LogoSimetrica, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur euismod tellus sed lacus tincidunt.' },
              { id: 2, name: 'Nombre Asociado 2', logo: LogoSimetrica, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur euismod tellus sed lacus tincidunt.' },
              { id: 3, name: 'Nombre Asociado 3', logo: LogoSimetrica, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur euismod tellus sed lacus tincidunt.' }
            ].map(a => (
              <article key={a.id} className="asociado-card">
                <div className="asociado-logo">
                  <img src={a.logo} alt={a.name} />
                </div>
                <div className="asociado-name">{a.name}</div>
                <div className="asociado-desc">{a.text}</div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer
        logoSrc={LogoSimetrica}
        logoAlt="Logo Simétrica - Empresa de diseño y construcción"
        columns={footerColumns}
        socialLinks={socialLinks}
        copyright="© 2025 Simétrica. Todos los derechos reservados."
        ariaLabel="Pie de página de Simétrica"
      />
        </>
    )
}

export default AsociadosPage;