import "./styles/DisenosSectionStyles.css"
import Image from "../assets/Diseños.png"

const DisenosSection = () => {
    return (
        <section className="designs-section">
            <h1>Nuestros diseños</h1>

            <div className="design-section__column">
                <div className="minimalist-design-section">
                    <img src={Image} alt="Diseños" className="designs-image" />
                    <h2 className="designs-title">Diseños Minimalistas</h2>
                </div>     

                <div className="modern-design-section">
                    <img src={Image} alt="Diseños" className="designs-image" />
                    <h2 className="designs-title">Diseños Modernos</h2>
                </div>
            </div>

            <div className="design-section__row">
                <div className="futurist-design-section">
                    <img src={Image} alt="Diseños" className="designs-image" />
                    <h2 className="designs-title">Diseños Futuristas</h2>
                </div>

                <div className="interior-design-section">
                    <img src={Image} alt="Diseños" className="designs-image" />
                    <h2 className="designs-title">Diseños Interiores</h2>
                </div>
            </div>
        </section>
    )
}

export default DisenosSection;