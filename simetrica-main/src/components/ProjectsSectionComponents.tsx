
// src/components/ProjectsSectionComponents.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ProjectsSectionStyle.css';
import Button from './Button';
import projectService, { type Project } from '../services/projectService';

// Imágenes de fallback
import Img1 from "../assets/project1.png";
import Img2 from "../assets/project2.png";
import Img3 from "../assets/project3.png";

const FALLBACK_IMAGES = [Img1, Img2, Img3];

const ProjectsSectionComponents = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Obtener los últimos 3 proyectos
    useEffect(() => {
        const fetchLatestProjects = async () => {
            try {
                const response = await projectService.getAll(1, 3);
                setProjects(response.projects);
            } catch (error) {
                console.error('Error al cargar proyectos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestProjects();
    }, []);

    // Observer para animaciones al hacer scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.3 }
        );

        const element = document.querySelector('.projects-section');
        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, []);

    const handleProjectClick = (projectId: string) => {
        navigate(`/proyectos/${projectId}`);
    };

    const handleViewMore = () => {
        navigate('/proyectos');
    };

    const nextSlide = () => {
        const totalSlides = projects.length > 0 ? projects.length : FALLBACK_IMAGES.length;
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        const totalSlides = projects.length > 0 ? projects.length : FALLBACK_IMAGES.length;
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const displayProjects = loading 
        ? FALLBACK_IMAGES.map((img, index) => ({
            _id: `fallback-${index}`,
            imagenes: [{ url: img }],
            nombre: `Proyecto ${index + 1}`
          }))
        : projects.length > 0 
        ? projects 
        : FALLBACK_IMAGES.map((img, index) => ({
            _id: `fallback-${index}`,
            imagenes: [{ url: img }],
            nombre: `Proyecto de ejemplo ${index + 1}`
          }));

    return (
        <section className={`projects-section ${isVisible ? 'projects-section--visible' : ''}`}>
            <div className="container projects-section__grid">
                {/* Texto a la izquierda */}
                <div className="projects-section__text">
                    <h2 className="projects-section__title">Nuestros proyectos</h2>
                    <p className="projects-section__description">
                        Descubre nuestro portafolio de proyectos especializados en insonorización acústica. 
                        Cada obra refleja nuestro compromiso con el control de ruido y la optimización 
                        acústica de espacios, garantizando ambientes confortables y libres de contaminación sonora.
                    </p>
                    <Button 
                        variant='primary'
                        size="lg"
                        onClick={handleViewMore}
                    >
                        Ver más
                    </Button>
                </div>

                {/* Imagenes a la derecha - Desktop */}
                <div className="projects-section__images">
                    {displayProjects.map((project, index) => (
                        <div 
                            key={project._id} 
                            className="projects-section__image-card"
                            onClick={() => !loading && projects.length > 0 && handleProjectClick(project._id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if ((e.key === 'Enter' || e.key === ' ') && !loading && projects.length > 0) {
                                    handleProjectClick(project._id);
                                }
                            }}
                            aria-label={`Ver detalles del proyecto ${project.nombre}`}
                        >
                            <img 
                                src={project.imagenes[0]?.url || FALLBACK_IMAGES[index % 3]} 
                                alt={project.nombre}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>

                {/* Carrusel para móvil */}
                <div className="projects-section__carousel">
                    <button 
                        className="projects-section__carousel-btn projects-section__carousel-btn--prev"
                        onClick={prevSlide}
                        aria-label="Proyecto anterior"
                    >
                        ‹
                    </button>
                    
                    <div className="projects-section__carousel-track">
                        {displayProjects.map((project, index) => (
                            <div 
                                key={project._id}
                                className={`projects-section__carousel-slide ${index === currentSlide ? 'projects-section__carousel-slide--active' : ''}`}
                                onClick={() => !loading && projects.length > 0 && handleProjectClick(project._id)}
                                role="button"
                                tabIndex={index === currentSlide ? 0 : -1}
                                aria-label={`Ver detalles del proyecto ${project.nombre}`}
                            >
                                <img 
                                    src={project.imagenes[0]?.url || FALLBACK_IMAGES[index % 3]} 
                                    alt={project.nombre}
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>

                    <button 
                        className="projects-section__carousel-btn projects-section__carousel-btn--next"
                        onClick={nextSlide}
                        aria-label="Siguiente proyecto"
                    >
                        ›
                    </button>

                    <div className="projects-section__carousel-indicators">
                        {displayProjects.map((_, index) => (
                            <button
                                key={index}
                                className={`projects-section__carousel-indicator ${index === currentSlide ? 'projects-section__carousel-indicator--active' : ''}`}
                                onClick={() => setCurrentSlide(index)}
                                aria-label={`Ir al proyecto ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProjectsSectionComponents;   