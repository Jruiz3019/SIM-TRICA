import "./styles/NosotrosSectionStyles.css";
import ImagenConstruccion from "../assets/Nosotros.png";

const NosotrosSection = () => {
    return (
        <section className="whyus-section">
            <div className="whyus-section__content">
            {/* Bloque marrón con texto */}
                <div className="whyus-section__text-block">
                    <h2 className="whyus-section__title">Porque nosotros</h2>
                    <p className="whyus-section__description">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Curabitur euismod tellus sed lacus tincidunt lacinia sed sit amet odio. 
                        Etiam vitae bibendum elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Curabitur euismod tellus sed lacus tincidunt lacinia sed sit amet odio. 
                        Etiam vitae bibendum elit.
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