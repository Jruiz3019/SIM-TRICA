import { useState, useEffect, useCallback } from 'react';
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
  const [filteredDesigns, setFilteredDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadDesigns = useCallback(async () => {
    try {
      setLoading(true);
      const response = await designService.getAll(currentPage, 12);
      setDesigns(response.designs);
      setFilteredDesigns(response.designs);
      setTotalPages(response.totalPages);
      setError('');
    } catch (err) {
      console.error('Error cargando diseños:', err);
      setError('Error al cargar los diseños');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadDesigns();
  }, [loadDesigns]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = designs.filter((design) =>
        design.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        design.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDesigns(filtered);
    } else {
      setFilteredDesigns(designs);
    }
  }, [searchQuery, designs]);

  const handleDesignClick = (designId: string) => {
    navigate(`/diseno/${designId}`);
  };
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
        { label: "Contacto", href: "/contacto" },
      ],
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
    { label: "WhatsApp", href: "https://wa.me/573103858223", external: true },
  ];
  


  return (
    <>
      <HeaderLayout />
      <main className="designs-page">
        <section className="designs-hero">
          <h1>Diseño de Interiores</h1>
          <p>Transformamos tus espacios en lugares únicos y funcionales.</p>
        </section>

        <section className="designs-content">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar diseños..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="loading-container">Cargando diseños...</div>
          ) : error ? (
            <div className="error-container">{error}</div>
          ) : filteredDesigns.length === 0 ? (
            <div className="empty-state">
              <p>No se encontraron diseños</p>
            </div>
          ) : (
            <>
              <div className="designs-grid">
                {filteredDesigns.map((design) => (
                  <div
                    key={design._id}
                    className="design-card"
                    onClick={() => handleDesignClick(design._id)}
                  >
                    <div className="design-image">
                      <img
                        src={design.imagenes[0]?.url || PlaceholderImage}
                        alt={design.nombre}
                      />
                      <div className="design-overlay">
                        <button className="view-more-btn">Ver más</button>
                      </div>
                    </div>
                    <div className="design-info">
                      <h3>{design.nombre}</h3>
                      <p className="design-description">
                        {design.descripcion.substring(0, 100)}
                        {design.descripcion.length > 100 ? '...' : ''}
                      </p>
                      <div className="design-stats">
                        <span>♥ {design.likes}</span>
                        <span>× {design.dislikes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    ← Anterior
                  </button>
                  <span className="pagination-info">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}
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
  );
};

export default DesignPage;