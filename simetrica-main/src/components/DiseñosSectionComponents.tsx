// src/components/DiseñosSectionComponents.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/DisenosSectionStyles.css';
import Button from './Button';
import designService from '../services/designService';
import type { Design } from '../types/design.types';

import Img1 from "../assets/Diseños.png";

const FALLBACK_IMAGES = [Img1, Img1, Img1];

const DisenosSection = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [designs, setDesigns] = useState<Design[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

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

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setIsVisible(true);
                });
            },
            { threshold: 0.25 }
        );

        const element = document.querySelector('.designs-section');
        if (element) observer.observe(element);
        return () => { if (element) observer.unobserve(element); };
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

    const CATEGORIES = ['Interiores', 'Acústica', 'Comercial'];

    return (
        <section className={`designs-section ${isVisible ? 'designs-section--visible' : ''}`}>
            <div className="designs-section__grid">

                {/* Texto a la izquierda */}
                <div className="designs-section__text">
                    <div className="designs-section__eyebrow designs-stagger" style={{ '--s': '0ms' } as React.CSSProperties}>
                        <span className="designs-section__eyebrow-line"></span>
                        <span className="designs-section__eyebrow-text">PORTAFOLIO DE DISEÑO</span>
                    </div>

                    <h2 className="designs-section__title designs-stagger" style={{ '--s': '100ms' } as React.CSSProperties}>
                        <span>Nuestros</span>{' '}
                        <span className="designs-section__title-accent">diseños</span>
                    </h2>

                    <p className="designs-section__description designs-stagger" style={{ '--s': '200ms' } as React.CSSProperties}>
                        Descubre nuestro portafolio de diseños de interiores especializados en crear
                        espacios únicos y funcionales con innovación, estética y optimización.
                    </p>

                    <div className="designs-section__separator designs-stagger" style={{ '--s': '300ms' } as React.CSSProperties}></div>

                    <div className="designs-section__categories designs-stagger" style={{ '--s': '300ms' } as React.CSSProperties}>
                        {CATEGORIES.map((cat, i) => (
                            <button
                                key={cat}
                                className="designs-section__category"
                                style={{ '--si': `${i * 100}ms` } as React.CSSProperties}
                                onClick={handleViewMore}
                            >
                                <span className="designs-section__category-num">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <span className="designs-section__category-name">{cat}</span>
                            </button>
                        ))}
                    </div>

                    <div className="designs-section__cta designs-stagger" style={{ '--s': '500ms' } as React.CSSProperties}>
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={handleViewMore}
                        >
                            Ver todos los diseños <span className="button__arrow">→</span>
                        </Button>
                    </div>
                </div>

                {/* Editorial grid — Desktop */}
                <div className="designs-section__images">
                    {displayDesigns.map((design, index) => (
                        <div 
                            key={design._id} 
                            className={`designs-section__image-card ${index === 0 ? 'designs-section__image-card--large' : 'designs-section__image-card--small'}`}
                            style={{ '--si': `${200 + index * 150}ms` } as React.CSSProperties}
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
                            <div className="designs-section__card-overlay">
                                <span className="designs-section__card-num">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <span className="designs-section__card-name">{design.nombre}</span>
                            </div>
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
                                <div className="designs-section__card-overlay">
                                    <span className="designs-section__card-num">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className="designs-section__card-name">{design.nombre}</span>
                                </div>
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
