// src/components/DiseñosSectionComponents.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/DisenosSectionStyles.css';
import Button from './Button';
import designService from '../services/designService';
import type { Design } from '../types/design.types';

// Imágenes de fallback
import Img1 from "../assets/Diseños.png";

const FALLBACK_IMAGES = [Img1, Img1, Img1];

const DisenosSection = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [designs, setDesigns] = useState<Design[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Obtener los últimos 3 diseños
    useEffect(() => {
        const fetchLatestDesigns = async () => {
            try {
                const response = await designService.getAll(1, 3);
                setDesigns(response.designs);
            } catch (error) {
                console.error('Error al cargar diseños:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestDesigns();
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

        const element = document.querySelector('.designs-section');
        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, []);

    const handleDesignClick = (designId: string) => {
        navigate(`/diseno/${designId}`);
    };

    const handleViewMore = () => {
        navigate('/diseños');
    };

    const nextSlide = () => {
        const totalSlides = designs.length > 0 ? designs.length : FALLBACK_IMAGES.length;
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        const totalSlides = designs.length > 0 ? designs.length : FALLBACK_IMAGES.length;
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const displayDesigns = loading 
        ? FALLBACK_IMAGES.map((img, index) => ({
            _id: `fallback-${index}`,
            imagenes: [{ url: img }] as { url: string }[],
            nombre: `Diseño ${index + 1}`,
            descripcion: ''
          }))
        : designs.length > 0 
        ? designs 
        : FALLBACK_IMAGES.map((img, index) => ({
            _id: `fallback-${index}`,
            imagenes: [{ url: img }] as { url: string }[],
            nombre: `Diseño de ejemplo ${index + 1}`,
            descripcion: ''
          }));

    return (
        <section className={`designs-section ${isVisible ? 'designs-section--visible' : ''}`}>
            <div className="container designs-section__grid">
                {/* Texto a la izquierda */}
                <div className="designs-section__text">
                    <h2 className="designs-section__title">Nuestros diseños</h2>
                    <p className="designs-section__description">
                        Descubre nuestro portafolio de diseños de interiores especializados en crear 
                        espacios únicos y funcionales. Cada diseño refleja nuestro compromiso con la 
                        innovación, estética y optimización de espacios, garantizando ambientes que 
                        combinan belleza y funcionalidad.
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
                <div className="designs-section__images">
                    {displayDesigns.map((design, index) => (
                        <div 
                            key={design._id} 
                            className="designs-section__image-card"
                            onClick={() => !loading && designs.length > 0 && handleDesignClick(design._id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if ((e.key === 'Enter' || e.key === ' ') && !loading && designs.length > 0) {
                                    handleDesignClick(design._id);
                                }
                            }}
                            aria-label={`Ver detalles del diseño ${design.nombre}`}
                        >
                            <img 
                                src={design.imagenes[0]?.url || FALLBACK_IMAGES[index % 3]} 
                                alt={design.nombre}
                                loading="lazy"
                            />
                            {!loading && designs.length > 0 && (
                                <div className="designs-section__card-overlay">
                                    <h3 className="designs-section__card-title">{design.nombre}</h3>
                                    {design.descripcion && (
                                        <p className="designs-section__card-description">
                                            {design.descripcion.substring(0, 60)}
                                            {design.descripcion.length > 60 ? '...' : ''}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Carrusel para móvil */}
                <div className="designs-section__carousel">
                    <button 
                        className="designs-section__carousel-btn designs-section__carousel-btn--prev"
                        onClick={prevSlide}
                        aria-label="Diseño anterior"
                    >
                        ‹
                    </button>
                    
                    <div className="designs-section__carousel-track">
                        {displayDesigns.map((design, index) => (
                            <div 
                                key={design._id}
                                className={`designs-section__carousel-slide ${index === currentSlide ? 'designs-section__carousel-slide--active' : ''}`}
                                onClick={() => !loading && designs.length > 0 && handleDesignClick(design._id)}
                                role="button"
                                tabIndex={index === currentSlide ? 0 : -1}
                                aria-label={`Ver detalles del diseño ${design.nombre}`}
                            >
                                <img 
                                    src={design.imagenes[0]?.url || FALLBACK_IMAGES[index % 3]} 
                                    alt={design.nombre}
                                    loading="lazy"
                                />
                                {!loading && designs.length > 0 && (
                                    <div className="designs-section__card-overlay">
                                        <h3 className="designs-section__card-title">{design.nombre}</h3>
                                        {design.descripcion && (
                                            <p className="designs-section__card-description">
                                                {design.descripcion.substring(0, 60)}
                                                {design.descripcion.length > 60 ? '...' : ''}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <button 
                        className="designs-section__carousel-btn designs-section__carousel-btn--next"
                        onClick={nextSlide}
                        aria-label="Siguiente diseño"
                    >
                        ›
                    </button>

                    <div className="designs-section__carousel-indicators">
                        {displayDesigns.map((_, index) => (
                            <button
                                key={index}
                                className={`designs-section__carousel-indicator ${index === currentSlide ? 'designs-section__carousel-indicator--active' : ''}`}
                                onClick={() => setCurrentSlide(index)}
                                aria-label={`Ir al diseño ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DisenosSection;