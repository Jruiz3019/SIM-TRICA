
// src/components/ProjectsSectionComponents.tsx
import { useState, useEffect } from 'react';
import './styles/ProjectsSectionStyle.css';
import Button from './Button';

// Imágenes de proyectos
import Img1 from "../assets/project1.png";
import Img2 from "../assets/project2.png";
import Img3 from "../assets/project3.png";

const ProjectsSectionComponents = () => {
    // Estado para animaciones de entrada
    const [isVisible, setIsVisible] = useState(false);

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

    return (
        <section className={`projects-section ${isVisible ? 'projects-section--visible' : ''}`}>
            <div className="container projects-section__grid">
                {/* Texto a la izquierda */}
                <div className="projects-section__text">
                    <h2 className="projects-section__title">Nuestros proyectos</h2>
                    <p className="projects-section__description">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur 
                        euismod tellus sed lacus tincidunt lacinia sed sit amet odio. Etiam 
                        vitae bibendum elit.
                    </p>
                    <Button 
                        variant='primary'
                        size="lg"
                        onClick={() => console.log('Ver mas clicked!')}
                    >Ver más</Button>
                </div>

                {/* Imagenes a la derecha */}
                <div className="projects-section__images">
                    <div className="projects-section__image-card">
                        <img src={Img1} alt="Proyecto en construcción 1" />
                    </div>
                    <div className="projects-section__image-card">
                        <img src={Img2} alt="Proyecto en construcción 2" />
                    </div>
                    <div className="projects-section__image-card">
                        <img src={Img3} alt="Proyecto en construcción 3" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProjectsSectionComponents;   