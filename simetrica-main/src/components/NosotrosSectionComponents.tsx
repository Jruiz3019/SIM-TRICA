import "./styles/NosotrosSectionStyles.css";
import ImagenConstruccion from "../assets/Nosotros.png";

const NosotrosSection = () => {
    return (
        <section className="whyus-section">
            <div className="whyus-section__content">
            {/* Bloque marrón con texto */}
                <div className="whyus-section__text-block">
                    <h2 className="whyus-section__title">Por qué nosotros</h2>
                    <p className="whyus-section__description">
                        Contamos con un equipo multidisciplinario de profesionales altamente calificados 
                        que garantizan la excelencia en cada fase del proyecto. Nuestra experiencia en 
                        diseño arquitectónico, ingeniería estructural y gestión de obra nos permite 
                        entregar resultados que superan las expectativas, siempre con enfoque en calidad, 
                        puntualidad y cumplimiento normativo.
                    </p>
                </div>

                {/* Imagen al lado derecho */}
                <div className="whyus-section__image">
                    <img src={ImagenConstruccion} alt="Proyecto en construcción" />
                </div>
            </div>

            {/* Pie decorativo */}
            <div className="whyus-section__footer">
                <span>Etiam vitae bibendum elit.</span>
                <div className="whyus-section__line"></div>
            </div>
        </section>
    )
}

export default NosotrosSection;