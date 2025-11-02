import "./styles/SimetricaSectionStyles.css"
import Img from '../assets/simetrica1.png'

const SimetricaSection = () => {
    return (
        <section className="simetrica-section">
            <div className="simetrica-section__content">
                {/* Imagen */}
                <div className="simetrica-section__image">
                    <img src={Img} alt="Proyecto Simétrica" />
                    <p className="simetrica-section__caption">Etiam vitae bibendum elit.</p>
                </div>

                {/* Hexágono con texto */}
                <div className="simetrica-section__hexagon">
                    <h2 className="simetrica-section__title">SIMÉTRICA</h2>
                    <p className="simetrica-section__description">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Curabitur euismod tellus sed lacus tincidunt lacinia sed sit amet odio. 
                        Etiam vitae bibendum elit.
                    </p>
                </div>

            </div>
        </section>
    )
}

export default SimetricaSection;