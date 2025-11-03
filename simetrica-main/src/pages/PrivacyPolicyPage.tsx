// src/pages/PrivacyPolicyPage.tsx
import React from 'react';
import HeaderLayout from '../layouts/HeaderLayout';
import Footer from '../layouts/Footer/Footer';
import Logo from '../assets/logoSi-blanco.png';
import './styles/PrivacyPolicyPageStyle.css';

const PrivacyPolicyPage: React.FC = () => {
  const footerColumns = [
    {
      title: "Servicios",
      links: [
        { label: "Proyectos", href: "/proyectos" },
        { label: "Diseños", href: "/diseños" }
      ]
    },
    {
      title: "Empresa",
      links: [
        { label: "Asociados", href: "/asociados" },
        { label: "Trabaja con nosotros", href: "/trabaja-con-nosotros" },
        { label: "Contacto", href: "/contacto" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Política de Privacidad", href: "/privacidad" },
        { label: "Términos de Servicio", href: "/terminos" }
      ]
    }
  ];

  const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com/simetrica_ia/", external: true },
    { label: "Facebook", href: "https://www.facebook.com/share/17PvCWuUtm/?mibextid=wwXIfr", external: true },
    { label: "TikTok", href: "https://www.tiktok.com/@simetrica7?_t=ZS-90L6hiOnqKe&_r=1", external: true },
    { label: "Pinterest", href: "https://co.pinterest.com/insonorizacion_acustica7/?invite_code=dd12bf69cdd14ac8aecd84e3f084a435&sender=595601256878326965", external: true },
    { label: "WhatsApp", href: "https://wa.me/573103858223", external: true }
  ];

  return (
    <>
      <HeaderLayout />
      
      <main className="privacy-policy">
        <div className="privacy-policy__container">
          <div className="privacy-policy__header">
            <h1 className="privacy-policy__title">Política de Privacidad</h1>
            <p className="privacy-policy__subtitle">Transparencia en el manejo de sus datos personales</p>
          </div>

          <div className="privacy-policy__content">
            <section className="privacy-policy__section">
              <h2 className="privacy-policy__section-title">
                POLÍTICA INSTITUCIONAL DE MANEJO DE INFORMACIÓN, TRATAMIENTO DE DATOS PERSONALES, PRIVACIDAD Y USO DE SERVICIOS
              </h2>
              <div className="privacy-policy__company-info">
                <p><strong>SIMÉTRICA S.A.S</strong></p>
                <p>Nit 901.850.566-8</p>
              </div>
            </section>

            <section className="privacy-policy__section">
              <h3 className="privacy-policy__heading">I. OBJETO</h3>
              <p className="privacy-policy__text">
                Atendiendo lo dispuesto en el marco normativo colombiano en materia de protección de datos personales, 
                particularmente la Ley 1581 de 2012; Decreto 1377 de 2013; y a cualquier norma que los sustituya o modifique 
                SIMÉTRICA S.A.S, en cumplimiento de las obligaciones legales que le asisten como responsable del tratamiento 
                de datos personales y en consonancia con su compromiso ético y profesional, adopta la presente Política 
                Integral de Información y Manejo de Datos Personales la cual tiene como propósito garantizar un tratamiento 
                responsable, transparente y seguro de la información, así como establecer mecanismos adecuados para la 
                atención de consultas, solicitudes y reclamos relacionados con el manejo de los datos personales en caso 
                de que el Titular otorgue su autorización expresa, previa e informada.
              </p>
            </section>

            <section className="privacy-policy__section">
              <h3 className="privacy-policy__heading">II. DEFINICIONES</h3>
              <p className="privacy-policy__text">
                Conforme la Ley 1581 de 2012 y el Capítulo 25 del Decreto Único 1074 de 2005, para los efectos de la 
                presente Política de Manejo de Datos y en aras de una mayor información para los usuarios, se puntualizan 
                los siguientes conceptos:
              </p>
              
              <dl className="privacy-policy__definitions">
                <dt><strong>Autorización:</strong></dt>
                <dd>Consentimiento previo, expreso e informado del titular para llevar a cabo el Tratamiento de datos personales.</dd>

                <dt><strong>Aviso De Privacidad:</strong></dt>
                <dd>Comunicación verbal o escrita generada por el responsable, dirigida al titular para el tratamiento de sus datos personales y mediante la cual se le informa de manera clara y suficiente sobre la existencia de las políticas de tratamiento de información aplicables, los mecanismos dispuestos para su consulta y las finalidades específicas que se atribuirán al tratamiento de sus datos personales.</dd>

                <dt><strong>Base De Datos:</strong></dt>
                <dd>Conjunto organizado de datos personales que sean objeto de tratamiento, cualquiera que fuere la modalidad de su formación, almacenamiento, organización y acceso.</dd>

                <dt><strong>Dato Personal:</strong></dt>
                <dd>Cualquier información vinculada o que pueda asociarse a una o varias personas naturales o jurídicas determinadas o determinables.</dd>

                <dt><strong>Dato Público:</strong></dt>
                <dd>Es el dato que no sea semiprivado, privado o sensible al cual se puede acceder libremente. Son considerados datos públicos, entre otros, los datos relativos al estado civil de las personas, a su profesión u oficio y a su calidad de comerciante o de servidor público. Por su naturaleza, los datos públicos pueden estar contenidos, entre otros, en registros públicos, documentos públicos, gacetas y boletines oficiales y sentencias judiciales debidamente ejecutoriadas que no estén sometidas a reserva.</dd>

                <dt><strong>Dato Sensible:</strong></dt>
                <dd>Se entiende por datos sensibles aquellos que afectan la Intimidad del Titular o cuyo uso indebido puede generar su discriminación, tales como aquellos que revelen el origen racial o étnico, la orientación política, las convicciones religiosas o filosóficas, la pertenencia a sindicatos, organizaciones sociales, de derechos humanos o que promueva intereses de cualquier partido político o que garanticen los derechos y garantías de partidos políticos de oposición, así como los datos relativos a la salud, a la vida sexual, y los datos biométricos.</dd>

                <dt><strong>Encargado Del Tratamiento:</strong></dt>
                <dd>Persona natural o jurídica, pública o privada, que por sí misma o en asocio con otros, realice el Tratamiento de datos personales por cuenta del responsable del Tratamiento.</dd>

                <dt><strong>Responsable Del Tratamiento:</strong></dt>
                <dd>Persona natural o jurídica, pública o privada, que por sí misma o en asocio con otros, decida sobre la base de datos y/o el Tratamiento de los datos personales.</dd>

                <dt><strong>Titular:</strong></dt>
                <dd>Persona natural o jurídica cuyos datos personales sean objeto de Tratamiento.</dd>

                <dt><strong>Tratamiento:</strong></dt>
                <dd>Cualquier operación o conjunto de operaciones sobre datos personales, tales como la recolección, almacenamiento, uso, modificación, circulación o supresión.</dd>

                <dt><strong>Transferencia:</strong></dt>
                <dd>Actividad realizada cuando el responsable y/o Encargado del Tratamiento de datos personales, ubicado en Colombia, envía la información o los datos personales a un receptor, que a su vez es Responsable del Tratamiento y se encuentra dentro o fuera del país.</dd>

                <dt><strong>Transmisión:</strong></dt>
                <dd>Tratamiento de datos personales que implica la comunicación de los mismos dentro o fuera del territorio de la República de Colombia cuando tenga por objeto la realización de un Tratamiento por el Encargado por cuenta del responsable.</dd>
              </dl>
            </section>

            <section className="privacy-policy__section">
              <h3 className="privacy-policy__heading">III. PRINCIPIOS RECTORES</h3>
              <p className="privacy-policy__text">
                En el marco de nuestras actividades profesionales y administrativas, SIMÉTRICA adelantará la recolección, 
                uso, almacenamiento, transmisión, transferencia y, en general, el tratamiento de los datos personales de 
                los titulares, de conformidad con las finalidades previstas en la presente Política.
              </p>
              <p className="privacy-policy__text">
                Todo tratamiento de datos personales efectuado por SIMÉTRICA, sus responsables, encargados o por terceros 
                a quienes se transfiera la información, deberá ajustarse estrictamente a los principios y reglas establecidos 
                en la Ley 1581 de 2012, sus decretos reglamentarios y en este instrumento, con el fin de garantizar el 
                derecho fundamental al hábeas data y asegurar el cumplimiento de los lineamientos internos de la organización 
                bajo los siguientes principios rectores del tratamiento de datos personales:
              </p>

              <ul className="privacy-policy__list">
                <li>
                  <strong>Legalidad y finalidad legítima:</strong> Todo tratamiento de datos personales se sujetará a las 
                  disposiciones legales vigentes y deberá perseguir propósitos legítimos, previamente informados al titular.
                </li>
                <li>
                  <strong>Libertad y consentimiento informado:</strong> El tratamiento de datos personales solo podrá 
                  realizarse con la autorización previa, expresa e informada del titular, salvo las excepciones previstas 
                  en la ley. En los casos en que la información haya sido recolectada antes de la entrada en vigor del 
                  Decreto 1377 de 2013, SIMÉTRICA implementará mecanismos idóneos para obtener dicha autorización retroactiva.
                </li>
                <li>
                  <strong>Finalidad autorizada:</strong> Todo tratamiento deberá responder a las finalidades previstas en 
                  esta Política, en la autorización otorgada por el titular o en los documentos específicos que regulen 
                  cada proceso. Está prohibido el uso de los datos personales con fines distintos a los informados y autorizados.
                </li>
                <li>
                  <strong>Veracidad y actualización:</strong> Los datos personales deberán ser veraces, completos, exactos, 
                  actualizados, comprobables y comprensibles. SIMÉTRICA se abstendrá de tratar información parcial, 
                  fraccionada o que induzca a error, salvo que el titular la complemente o corrija.
                </li>
                <li>
                  <strong>Transparencia:</strong> Los titulares tendrán derecho a obtener información clara y suficiente 
                  sobre el tratamiento que se dé a sus datos personales, en cualquier momento y sin restricciones.
                </li>
                <li>
                  <strong>Acceso y circulación restringida:</strong> El acceso y tratamiento de los datos personales estará 
                  limitado exclusivamente al personal autorizado de SIMÉTRICA y a quienes, por la naturaleza de sus funciones, 
                  deban manejar dicha información. No podrán hacerse disponibles en medios masivos, salvo que se cuente con 
                  protocolos de seguridad que garanticen su restricción a usuarios autorizados.
                </li>
                <li>
                  <strong>Acceso del titular:</strong> Cuando lo solicite, el titular tendrá derecho a conocer la existencia 
                  de los datos que le conciernen. La dependencia designada para la protección de datos en SIMÉTRICA será la 
                  encargada de responder tales solicitudes.
                </li>
                <li>
                  <strong>Temporalidad:</strong> La conservación y uso de los datos personales se limitará al tiempo 
                  estrictamente necesario para cumplir con la finalidad informada al titular.
                </li>
                <li>
                  <strong>Seguridad informática y confidencialidad profesional:</strong> SIMÉTRICA adoptará medidas técnicas, 
                  humanas y administrativas para proteger los datos personales contra accesos no autorizados, pérdidas, 
                  alteraciones o usos indebidos, preservando en todo momento la confidencialidad de la información, conforme 
                  al deber de secreto profesional.
                </li>
                <li>
                  <strong>Confidencialidad:</strong> Todo tratamiento se realizará bajo criterios de reserva profesional, 
                  evitando que la información sea adulterada, modificada, consultada, usada o divulgada por personas no 
                  autorizadas. Todo proyecto que involucre tratamiento de datos deberá referirse expresamente a esta Política.
                </li>
                <li>
                  <strong>Tratamiento posterior:</strong> Los datos personales que no tengan la calidad de públicos 
                  conservarán su carácter confidencial incluso después de terminada la relación contractual o vínculo con 
                  el titular.
                </li>
                <li>
                  <strong>Separación de bases de datos:</strong> SIMÉTRICA garantizará la individualidad de las bases de 
                  datos en las que actúe como responsable respecto de aquellas en las que tenga la calidad de encargado.
                </li>
                <li>
                  <strong>Principio de necesidad:</strong> La recolección y tratamiento de datos personales se limitará a 
                  aquellos estrictamente necesarios para el cumplimiento de las finalidades previstas en la Ley y en esta 
                  Política, evitando la obtención de información irrelevante o excesiva.
                </li>
              </ul>
            </section>

            <section className="privacy-policy__section">
              <h3 className="privacy-policy__heading">VI. CONSULTAS</h3>
              <p className="privacy-policy__text">
                La presente política y los derechos básicos que los titulares de los datos tienen en relación con la misma 
                podrán ser consultados a través de los siguientes medios:
              </p>
              
              <div className="privacy-policy__contact">
                <h4 className="privacy-policy__contact-title">Canales de Atención</h4>
                <ul className="privacy-policy__contact-list">
                  <li>
                    <strong>Correo electrónico:</strong> <a href="mailto:contacto@simetrica.com">contacto@simetrica.com</a>
                  </li>
                  <li>
                    <strong>Teléfono:</strong> <a href="tel:+573103858223">+57 310 385 8223</a>
                  </li>
                  <li>
                    <strong>Página web:</strong> <a href="https://www.simetrica.com" target="_blank" rel="noopener noreferrer">www.simetrica.com</a>
                  </li>
                </ul>
              </div>
            </section>

            <section className="privacy-policy__section">
              <h3 className="privacy-policy__heading">VII. VIGENCIA</h3>
              <p className="privacy-policy__text">
                La presente política rige a partir de la fecha de su publicación y deja sin efectos las demás disposiciones 
                institucionales que le sean contrarias. Toda información no contemplada en la presente política, se 
                reglamentará de acuerdo al Régimen General de Protección de Datos Personales vigente en Colombia.
              </p>
              <p className="privacy-policy__text">
                La actualización de la Políticas de Protección de Datos Personales dependerá de las instrucciones y 
                lineamientos de la Dirección Ejecutiva de SIMÉTRICA, así como de las extensiones reglamentarias del ente 
                de vigilancia y control, la Superintendencia de Industria y Comercio.
              </p>
            </section>

            <section className="privacy-policy__section">
              <h3 className="privacy-policy__heading">VIII. PUBLICACIÓN</h3>
              <p className="privacy-policy__text">
                Esta política ha sido publicada y actualizada en el mes de agosto del año 2025.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer
        logoSrc={Logo}
        logoAlt="Logo Simétrica - Empresa de diseño"
        columns={footerColumns}
        copyright="© 2025 Simétrica. Todos los derechos reservados."
        socialLinks={socialLinks}
      />
    </>
  );
};

export default PrivacyPolicyPage;
