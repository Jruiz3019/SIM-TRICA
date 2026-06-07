import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/SimetricaSectionStyles.css';
import Img from '../assets/DSCN6869.jpg';
import Button from './Button';

const SimetricaSection = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

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

        const element = document.querySelector('.simetrica-section');
        if (element) observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, []);

    return (
        <section className={`simetrica-section ${isVisible ? 'simetrica-section--visible' : ''}`}>
            <div className="simetrica-section__content">

                {/* Panel izquierdo — Imagen */}
                <div className="simetrica-section__image-panel">
                    <img src={Img} alt="Proyecto Simétrica" />
                    <div className="simetrica-section__image-gradient"></div>
                    <div className="simetrica-section__caption">
                        SIMÉTRICA
                    </div>
                </div>

                {/* Panel derecho — Texto */}
                <div className="simetrica-section__text-panel">
                    <p className="simetrica-section__eyebrow simetrica-stagger" style={{ '--s': '0ms' } as React.CSSProperties}>
                        QUIÉNES SOMOS
                    </p>
                    <div className="simetrica-section__divider simetrica-stagger" style={{ '--s': '100ms' } as React.CSSProperties}></div>
                    <h2 className="simetrica-section__title simetrica-stagger" style={{ '--s': '200ms' } as React.CSSProperties}>
                        SIMÉTRICA
                    </h2>
                    <p className="simetrica-section__description simetrica-stagger" style={{ '--s': '300ms' } as React.CSSProperties}>
                        Somos expertos en insonorización de espacios. Diseñamos e implementamos soluciones
                        acústicas integrales para controlar el ruido y mejorar el confort sonoro en proyectos
                        residenciales, comerciales e industriales.
                    </p>

                    <div className="simetrica-section__separator simetrica-stagger" style={{ '--s': '400ms' } as React.CSSProperties}></div>

                    <div className="simetrica-section__features simetrica-stagger" style={{ '--s': '500ms' } as React.CSSProperties}>
                        <div className="simetrica-section__feature">
                            <div className="simetrica-section__feature-bullet"></div>
                            <div className="simetrica-section__feature-text">
                                <span className="simetrica-section__feature-title">Acústica de precisión</span>
                                <span className="simetrica-section__feature-desc">Tecnología de vanguardia para cada espacio</span>
                            </div>
                        </div>
                        <div className="simetrica-section__feature">
                            <div className="simetrica-section__feature-bullet"></div>
                            <div className="simetrica-section__feature-text">
                                <span className="simetrica-section__feature-title">Materiales certificados</span>
                                <span className="simetrica-section__feature-desc">Calidad garantizada en cada instalación</span>
                            </div>
                        </div>
                        <div className="simetrica-section__feature">
                            <div className="simetrica-section__feature-bullet"></div>
                            <div className="simetrica-section__feature-text">
                                <span className="simetrica-section__feature-title">Proyectos llave en mano</span>
                                <span className="simetrica-section__feature-desc">Desde el diseño hasta la ejecución final</span>
                            </div>
                        </div>
                    </div>

                    <div className="simetrica-section__cta simetrica-stagger" style={{ '--s': '600ms' } as React.CSSProperties}>
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={() => navigate('/contacto')}
                        >
                            Conoce más <span className="button__arrow">→</span>
                        </Button>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default SimetricaSection;
