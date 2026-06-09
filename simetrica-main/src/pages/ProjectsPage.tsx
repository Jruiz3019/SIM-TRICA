import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLayout from "../layouts/HeaderLayout";
import Footer from "../layouts/Footer";
import LogoSimetrica from "../assets/logo-simetrica-blanco.png";
import projectService, { type Project } from '../services/projectService';
import ProjectCard from '../components/ProjectCard/ProjectCard';
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
  const [gridVisible, setGridVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

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

  const { featuredProject, remainingProjects } = useMemo(() => {
    if (filteredProjects.length === 0) return { featuredProject: null, remainingProjects: [] };

    let maxLikes = -1;
    let featuredIdx = 0;
    filteredProjects.forEach((p, i) => {
      if (p.likes > maxLikes) {
        maxLikes = p.likes;
        featuredIdx = i;
      }
    });

    const remaining = filteredProjects.filter((_, i) => i !== featuredIdx);
    return {
      featuredProject: filteredProjects[featuredIdx],
      remainingProjects: remaining,
    };
  }, [filteredProjects]);

  useEffect(() => {
    if (!gridRef.current || loading || filteredProjects.length === 0) return;

    setGridVisible(false);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setGridVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, [filteredProjects, loading]);

  const handleProjectClick = (projectId: string) => {
    navigate(`/proyecto/${projectId}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const isSearching = searchQuery.trim().length > 0;

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
              <div className="empty-state__icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3 className="empty-state__title">No encontramos proyectos para tu búsqueda</h3>
              <p className="empty-state__text">Intentá con otros términos o limpiá el filtro.</p>
              {isSearching && (
                <button className="empty-state__btn" onClick={handleClearSearch}>
                  Ver todos los proyectos
                </button>
              )}
            </div>
          ) : (
            <>
              <div ref={gridRef}>
                {featuredProject && remainingProjects.length >= 2 ? (
                  <div className={`projects-grid projects-grid--featured ${gridVisible ? 'grid--visible' : ''}`}>
                    <ProjectCard
                      project={featuredProject}
                      isFeatured
                      index={0}
                      onClick={() => handleProjectClick(featuredProject._id)}
                    />
                    <ProjectCard
                      project={remainingProjects[0]}
                      index={1}
                      onClick={() => handleProjectClick(remainingProjects[0]._id)}
                    />
                    <ProjectCard
                      project={remainingProjects[1]}
                      index={2}
                      onClick={() => handleProjectClick(remainingProjects[1]._id)}
                    />
                  </div>
                ) : (
                  <div className={`projects-grid projects-grid--normal ${gridVisible ? 'grid--visible' : ''}`}>
                    {filteredProjects.map((project, i) => (
                      <ProjectCard
                        key={project._id}
                        project={project}
                        index={i}
                        onClick={() => handleProjectClick(project._id)}
                      />
                    ))}
                  </div>
                )}

                {featuredProject && remainingProjects.length > 2 && (
                  <div className={`projects-grid projects-grid--normal ${gridVisible ? 'grid--visible' : ''}`}>
                    {remainingProjects.slice(2).map((project, i) => (
                      <ProjectCard
                        key={project._id}
                        project={project}
                        index={i + 3}
                        onClick={() => handleProjectClick(project._id)}
                      />
                    ))}
                  </div>
                )}
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
