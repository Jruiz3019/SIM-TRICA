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
                        Somos líderes en insonorización acústica con un equipo especializado en ingeniería 
                        del sonido y acondicionamiento acústico. Nuestro expertise abarca desde el análisis 
                        técnico de niveles de ruido hasta la implementación de sistemas de aislamiento sonoro 
                        de última generación, cumpliendo con las normativas nacionales e internacionales de 
                        control acústico.
                    </p>
                </div>

                {/* Imagen al lado derecho */}
                <div className="whyus-section__image">
                    <img src={ImagenConstruccion} alt="Proyecto en construcción" />
                </div>
            </div>

            {/* Pie decorativo */}
            <div className="whyus-section__footer">
                <span>SIMÉTRICA</span>
                <div className="whyus-section__line"></div>
            </div>
        </section>
    )
}

export default NosotrosSection;