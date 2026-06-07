import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/NosotrosSectionStyles.css';
import ImagenConstruccion from '../assets/PARED.jpg';
import Button from './Button';

const NosotrosSection = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setIsVisible(true);
                });
            },
            { threshold: 0.25 }
        );

        const element = document.querySelector('.nosotros-section');
        if (element) observer.observe(element);
        return () => { if (element) observer.unobserve(element); };
    }, []);

    return (
        <section className={`nosotros-section ${isVisible ? 'nosotros-section--visible' : ''}`}>
            <img
                className="nosotros-section__bg"
                src={ImagenConstruccion}
                alt=""
                aria-hidden="true"
            />
            <div className="nosotros-section__overlay"></div>

            <div className="nosotros-section__content">

                <div className="nosotros-section__eyebrow nosotros-stagger" style={{ '--s': '0ms' } as React.CSSProperties}>
                    <span className="nosotros-section__eyebrow-line"></span>
                    <span className="nosotros-section__eyebrow-text">POR QUÉ NOSOTROS</span>
                </div>

                <h2 className="nosotros-section__title nosotros-stagger" style={{ '--s': '0ms' } as React.CSSProperties}>
                    Líderes en acústica
                </h2>

                <p className="nosotros-section__description nosotros-stagger" style={{ '--s': '150ms' } as React.CSSProperties}>
                    Somos líderes en insonorización acústica con un equipo especializado en ingeniería
                    del sonido y acondicionamiento acústico. Nuestro expertise abarca desde el análisis
                    técnico hasta la implementación de sistemas de aislamiento sonoro de última generación.
                </p>

                <div className="nosotros-section__features nosotros-stagger" style={{ '--s': '300ms' } as React.CSSProperties}>
                    <div className="nosotros-section__feature-item" style={{ '--si': '0ms' } as React.CSSProperties}>
                        <span className="nosotros-section__feature-num">01</span>
                        <span className="nosotros-section__feature-label">Análisis técnico</span>
                    </div>
                    <div className="nosotros-section__feature-divider"></div>
                    <div className="nosotros-section__feature-item" style={{ '--si': '100ms' } as React.CSSProperties}>
                        <span className="nosotros-section__feature-num">02</span>
                        <span className="nosotros-section__feature-label">Materiales certificados</span>
                    </div>
                    <div className="nosotros-section__feature-divider"></div>
                    <div className="nosotros-section__feature-item" style={{ '--si': '200ms' } as React.CSSProperties}>
                        <span className="nosotros-section__feature-num">03</span>
                        <span className="nosotros-section__feature-label">Proyectos integrales</span>
                    </div>
                </div>

                <div className="nosotros-section__cta nosotros-stagger" style={{ '--s': '600ms' } as React.CSSProperties}>
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => navigate('/trabaja-con-nosotros')}
                    >
                        Unete a nuestro equipo <span className="button__arrow">→</span>
                    </Button>
                </div>

            </div>

            <div className="nosotros-section__stat-card nosotros-stagger" style={{ '--s': '400ms' } as React.CSSProperties}>
                <div className="nosotros-section__stat">
                    <span className="nosotros-section__stat-value">98%</span>
                    <span className="nosotros-section__stat-label">Satisfacción</span>
                </div>
                <div className="nosotros-section__stat-sep"></div>
                <div className="nosotros-section__stat">
                    <span className="nosotros-section__stat-value">120+</span>
                    <span className="nosotros-section__stat-label">Proyectos</span>
                </div>
                <div className="nosotros-section__stat-sep"></div>
                <div className="nosotros-section__stat">
                    <span className="nosotros-section__stat-value">8</span>
                    <span className="nosotros-section__stat-label">Años</span>
                </div>
            </div>

            <div className="nosotros-section__footer nosotros-stagger" style={{ '--s': '600ms' } as React.CSSProperties}>
                <span>SIMÉTRICA</span>
                <div className="nosotros-section__footer-line"></div>
            </div>
        </section>
    );
};

export default NosotrosSection;
