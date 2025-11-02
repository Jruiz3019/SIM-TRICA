import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLayout from "../layouts/HeaderLayout";
import Footer from "../layouts/Footer";
import LogoSimetrica from "../assets/logo-simetrica-blanco.png";
import PlaceholderImage from "../assets/project1.png";
import projectService, { type Project } from '../services/projectService';
import "./styles/ProjectsPageStyle.css";

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await projectService.getAll(currentPage, 12);
      setProjects(response.projects);
      setFilteredProjects(response.projects);
      setTotalPages(response.totalPages);
      setError('');
    } catch (err) {
      console.error('Error cargando proyectos:', err);
      setError('Error al cargar los proyectos');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = projects.filter((project) =>
        project.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  }, [searchQuery, projects]);

  const handleProjectClick = (projectId: string) => {
    navigate(`/proyecto/${projectId}`);
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
      <main className="projects-page">
        <section className="projects-hero">
          <h1>Nuestros Proyectos</h1>
          <p>Transformamos espacios en lugares únicos y funcionales.</p>
        </section>

        <section className="projects-content">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar proyectos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="loading-container">Cargando proyectos...</div>
          ) : error ? (
            <div className="error-container">{error}</div>
          ) : filteredProjects.length === 0 ? (
            <div className="empty-state">
              <p>No se encontraron proyectos</p>
            </div>
          ) : (
            <>
              <div className="projects-grid">
                {filteredProjects.map((project) => (
                  <div
                    key={project._id}
                    className="project-card"
                    onClick={() => handleProjectClick(project._id)}
                  >
                    <div className="project-image">
                      <img
                        src={project.imagenes[0]?.url || PlaceholderImage}
                        alt={project.nombre}
                      />
                      <div className="project-overlay">
                        <button className="view-more-btn">Ver más</button>
                      </div>
                    </div>
                    <div className="project-info">
                      <h3>{project.nombre}</h3>
                      <p className="project-client">{project.cliente}</p>
                      <p className="project-description">
                        {project.descripcion.substring(0, 100)}
                        {project.descripcion.length > 100 ? '...' : ''}
                      </p>
                      <div className="project-stats">
                        <span>♥ {project.likes}</span>
                        <span>× {project.dislikes}</span>
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
        logoAlt="Logo Simétrica"
        columns={footerColumns}
        socialLinks={socialLinks}
        copyright="© 2025 Simétrica. Todos los derechos reservados."
        ariaLabel="Pie de página"
      />
    </>
  );
};

export default ProjectsPage;
