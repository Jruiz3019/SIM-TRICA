
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

    return (
        <section className={`projects-section ${isVisible ? 'projects-section--visible' : ''}`}>
            <div className="container projects-section__grid">
                {/* Texto a la izquierda */}
                <div className="projects-section__text">
                    <h2 className="projects-section__title">Nuestros proyectos</h2>
                    <p className="projects-section__description">
                        Descubre nuestro portafolio de proyectos arquitectónicos y de construcción. 
                        Cada obra refleja nuestro compromiso con la excelencia, la innovación y el 
                        detalle en cada fase del proceso constructivo.
                    </p>
                    <Button 
                        variant='primary'
                        size="lg"
                        onClick={handleViewMore}
                    >
                        Ver más
                    </Button>
                </div>

                {/* Imagenes a la derecha */}
                <div className="projects-section__images">
                    {loading ? (
                        // Skeleton loading con imágenes de fallback
                        FALLBACK_IMAGES.map((img, index) => (
                            <div key={index} className="projects-section__image-card">
                                <img src={img} alt={`Proyecto ${index + 1}`} />
                            </div>
                        ))
                    ) : projects.length > 0 ? (
                        // Proyectos reales del backend
                        projects.map((project) => (
                            <div 
                                key={project._id} 
                                className="projects-section__image-card"
                                onClick={() => handleProjectClick(project._id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleProjectClick(project._id);
                                    }
                                }}
                                aria-label={`Ver detalles del proyecto ${project.nombre}`}
                            >
                                <img 
                                    src={project.imagenes[0]?.url || FALLBACK_IMAGES[0]} 
                                    alt={project.nombre}
                                    loading="lazy"
                                />
                            </div>
                        ))
                    ) : (
                        // Fallback si no hay proyectos
                        FALLBACK_IMAGES.map((img, index) => (
                            <div key={index} className="projects-section__image-card">
                                <img src={img} alt={`Proyecto de ejemplo ${index + 1}`} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}

export default ProjectsSectionComponents;   