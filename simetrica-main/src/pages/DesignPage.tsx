import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./styles/DesignPageStyle.css";
import HeaderLayout from "../layouts/HeaderLayout";
import Footer from "../layouts/Footer";
import LogoSimetrica from "../assets/logo-simetrica-blanco.png";
import PlaceholderImage from "../assets/Diseno.png";
import designService from '../services/designService';
import type { Design } from '../types/design.types';

const DesignPage = () => {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = async () => {
    try {
      setLoading(true);
      const response = await designService.getAll(1, 100);
      setDesigns(response.designs);
      setError('');
    } catch (err) {
      console.error('Error cargando diseños:', err);
      setError('Error al cargar los diseños');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadDesigns();
      return;
    }

    try {
      setLoading(true);
      const results = await designService.search(searchQuery);
      setDesigns(results);
      setError('');
    } catch (err) {
      console.error('Error en búsqueda:', err);
      setError('Error al buscar diseños');
    } finally {
      setLoading(false);
    }
  };

  const handleDesignClick = (designId: string) => {
    navigate(`/diseno/${designId}`);
  };
  const footerColumns = [
    {
      title: "Servicios",
      links: [
        { label: "Proyectos", href: "/proyectos" },
        { label: "Diseños", href: "/diseños" },
        { label: "Construcción", href: "/construccion" },
      ],
    },
    {
      title: "Empresa",
      links: [
        { label: "Asociados", href: "/asociados" },
        { label: "Trabaja con nosotros", href: "/trabaja-con-nosotros" },
        { label: "Contacto", href: "/contacto" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Política de Privacidad", href: "/privacidad" },
        { label: "Términos de Servicio", href: "/terminos" },
      ],
    },
  ];

  const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com/simetrica_ia/", external: true },
    { label: "Facebook", href: "https://www.facebook.com/share/17PvCWuUtm/?mibextid=wwXIfr", external: true },
    { label: "TikTok", href: "https://www.tiktok.com/@simetrica7?_t=ZS-90L6hiOnqKe&_r=1", external: true },
    { label: "Pinterest", href: "https://co.pinterest.com/insonorizacion_acustica7/?invite_code=dd12bf69cdd14ac8aecd84e3f084a435&sender=595601256878326965", external: true },
    { label: "WhatsApp", href: "https://wa.me/573103858223", external: true },
  ];
  


  return (
    <>
      <HeaderLayout />
      <main className="design-section">
        <div className="design-section__content">
          <h1>Diseño de Interiores</h1>
          <p>Transformamos tus espacios en lugares únicos y funcionales.</p>

          <div className="design-section__filters">
            <form onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Buscar diseños..."
                className="filter-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {loading ? (
            <div className="loading-state">Cargando diseños...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : designs.length === 0 ? (
            <div className="empty-state">No se encontraron diseños</div>
          ) : (
            <section className="design-gallery">
              {designs.map((design) => (
                <div 
                  className="design-card" 
                  key={design._id}
                  onClick={() => handleDesignClick(design._id)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={design.imagenes[0]?.url || PlaceholderImage}
                    alt={design.nombre}
                    className="design-card__img"
                  />
                  <div className="design-card__overlay">
                    <div className="design-card__content">
                      <h3 className="design-card__title">{design.nombre}</h3>
                      <span className="design-card__button">Ver más</span>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
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
  );
};

export default DesignPage;