import { useState, useEffect } from 'react';
import HeaderLayout from '../layouts/HeaderLayout';
import Footer from '../layouts/Footer/Footer';
import { submitWorkApplication } from '../services/workWithUsService';
import jobService from '../services/jobService';
import './styles/TrabajaConNosotrosPageStyle.css';
import LogoSimetrica from '../assets/logo-simetrica-blanco.png';

const departamentosYMunicipios: { [key: string]: string[] } = {
  "Amazonas": ["Leticia", "Puerto Nariño"],
  "Antioquia": [
    "Abejorral","Abriaquí","Alejandría","Amagá","Amalfi","Andes","Angelópolis",
    "Angostura","Anorí","Anzá","Apartadó","Arboletes","Argelia","Armenia",
    "Barbosa","Bello","Belmira","Betania","Betulia","Briceño","Buriticá",
    "Cáceres","Caicedo","Caldas","Campamento","Cañasgordas","Caracolí",
    "Caramanta","Carepa","Carolina","Caucasia","Chigorodó","Cisneros",
    "Ciudad Bolívar","Cocorná","Concepción","Concordia","Copacabana",
    "Dabeiba","Donmatías","Ebéjico","El Bagre","El Carmen de Viboral",
    "El Santuario","Entrerríos","Envigado","Fredonia","Frontino","Giraldo",
    "Girardota","Gómez Plata","Granada","Guadalupe","Guarne","Guatapé",
    "Heliconia","Hispania","Itagüí","Ituango","Jardín","Jericó","La Ceja",
    "La Estrella","La Pintada","La Unión","Liborina","Maceo","Marinilla",
    "Medellín","Montebello","Murindó","Mutatá","Nariño","Necoclí","Nechí",
    "Olaya","Peñol","Peque","Pueblorrico","Puerto Berrío","Puerto Nare",
    "Puerto Triunfo","Remedios","Retiro","Rionegro","Sabanalarga","Sabaneta",
    "Salgar","San Andrés de Cuerquia","San Carlos","San Francisco",
    "San Jerónimo","San José de la Montaña","San Juan de Urabá",
    "San Luis","San Pedro de los Milagros","San Pedro de Urabá",
    "San Rafael","San Roque","San Vicente Ferrer","Santa Bárbara",
    "Santa Fe de Antioquia","Santa Rosa de Osos","Santo Domingo",
    "Segovia","Sonsón","Sopetrán","Támesis","Tarazá","Tarso","Titiribí",
    "Toledo","Turbo","Uramita","Urrao","Valdivia","Valparaíso","Vegachí",
    "Venecia","Vigía del Fuerte","Yalí","Yarumal","Yolombó","Yondó","Zaragoza"
  ],
  "Arauca": ["Arauca","Arauquita","Cravo Norte","Fortul","Puerto Rondón","Saravena","Tame"],
  "Atlántico": [
    "Barranquilla","Baranoa","Campo de la Cruz","Candelaria","Galapa",
    "Juan de Acosta","Luruaco","Malambo","Manatí","Palmar de Varela",
    "Piojó","Polonuevo","Ponedera","Puerto Colombia","Repelón",
    "Sabanagrande","Sabanalarga","Santa Lucía","Santo Tomás","Soledad","Suan","Tubará","Usiacurí"
  ],
  "Bolívar": [
    "Achí","Altos del Rosario","Arenal","Arjona","Arroyohondo","Barranco de Loba",
    "Calamar","Cantagallo","Cartagena","Cicuco","Clemencia","Córdoba",
    "El Carmen de Bolívar","El Guamo","El Peñón","Hatillo de Loba",
    "Magangué","Mahates","Margarita","María la Baja","Mompós",
    "Montecristo","Morales","Pinillos","Regidor","Río Viejo",
    "San Cristóbal","San Estanislao","San Fernando","San Jacinto",
    "San Jacinto del Cauca","San Juan Nepomuceno","San Martín de Loba",
    "San Pablo","Santa Catalina","Santa Rosa","Santa Rosa del Sur",
    "Simití","Soplaviento","Talaigua Nuevo","Tiquisio","Turbaco","Turbaná","Villanueva","Zambrano"
  ],
  "Boyacá": [
    "Almeida","Aquitania","Arcabuco","Belén","Berbeo","Betéitiva","Boavita",
    "Boyacá","Briceño","Buenavista","Busbanzá","Caldas","Campohermoso",
    "Cerinza","Chinavita","Chiquinquirá","Chíquiza","Chiscas","Chita",
    "Chitaraque","Chivatá","Chivor","Cómbita","Coper","Corrales",
    "Covarachía","Cubará","Cucaita","Cuítiva","Duitama","El Cocuy",
    "El Espino","Firavitoba","Floresta","Gachantivá","Gámeza",
    "Garagoa","Guacamayas","Guateque","Guayatá","Güicán","Iza",
    "Jenesano","Jericó","La Capilla","La Uvita","La Victoria",
    "Labranzagrande","Macanal","Maripí","Miraflores","Mongua","Monguí",
    "Moniquirá","Motavita","Muzo","Nobsa","Nuevo Colón","Oicatá",
    "Otanche","Pachavita","Páez","Paipa","Pajarito","Panqueba",
    "Pauna","Paya","Paz de Río","Pesca","Pisba","Puerto Boyacá",
    "Quípama","Ramiriquí","Ráquira","Rondón","Saboyá","Sáchica",
    "Samacá","San Eduardo","San José de Pare","San Luis de Gaceno",
    "San Mateo","San Miguel de Sema","San Pablo de Borbur",
    "Santa María","Santa Rosa de Viterbo","Santa Sofía","Santana",
    "Sativanorte","Sativasur","Siachoque","Soatá","Socha","Socotá",
    "Sogamoso","Somondoco","Sora","Sotaquirá","Soracá","Susacón",
    "Sutamarchán","Sutatenza","Tasco","Tenza","Tibaná","Tibasosa",
    "Tinjacá","Tipacoque","Toca","Togüí","Tópaga","Tota","Tunja",
    "Tununguá","Turmequé","Tuta","Tutazá","Úmbita","Ventaquemada",
    "Villa de Leyva","Viracachá","Zetaquira"
  ],
  "Caldas": [
    "Aguadas","Anserma","Aranzazu","Belalcázar","Chinchiná","Filadelfia",
    "La Dorada","La Merced","Manizales","Manzanares","Marmato",
    "Marquetalia","Marulanda","Neira","Norcasia","Pácora","Palestina",
    "Pensilvania","Riosucio","Risaralda","Salamina","Samaná",
    "San José","Supía","Victoria","Villamaría","Viterbo"
  ],
  "Caquetá": [
    "Albania","Belén de los Andaquíes","Cartagena del Chairá","Curillo",
    "El Doncello","El Paujil","Florencia","La Montañita","Milán",
    "Morelia","Puerto Rico","San José del Fragua","San Vicente del Caguán","Solano","Solita","Valparaíso"
  ],
  "Casanare": [
    "Aguazul","Chámeza","Hato Corozal","La Salina","Maní","Monterrey",
    "Nunchía","Orocué","Paz de Ariporo","Pore","Recetor","Sabanalarga",
    "Sácama","San Luis de Palenque","Támara","Tauramena","Trinidad","Villanueva","Yopal"
  ],
  "Cauca": [
    "Almaguer","Argelia","Balboa","Bolívar","Buenos Aires","Cajibío",
    "Caldono","Caloto","Corinto","El Tambo","Florencia","Guachené",
    "Guapi","Inzá","Jambaló","La Sierra","La Vega","López de Micay",
    "Mercaderes","Miranda","Morales","Padilla","Páez","Patía",
    "Piamonte","Piendamó","Popayán","Puerto Tejada","Puracé",
    "Rosas","San Sebastián","Santander de Quilichao","Santa Rosa",
    "Silvia","Sotará","Suárez","Sucre","Timbío","Timbiquí","Toribío",
    "Totoró","Villa Rica"
  ],
  "Cesar": [
    "Aguachica","Agustín Codazzi","Astrea","Becerril","Bosconia",
    "Chimichagua","Chiriguaná","Curumaní","El Copey","El Paso",
    "Gamarra","González","La Gloria","La Jagua de Ibirico",
    "Manaure Balcón del Cesar","Pailitas","Pelaya","Pueblo Bello",
    "Río de Oro","San Alberto","San Diego","San Martín",
    "Tamalameque","Valledupar"
  ],
  "Chocó": [
    "Acandí","Alto Baudó","Atrato","Bagadó","Bahía Solano","Bajo Baudó",
    "Belén de Bajirá","Bojayá","Cértegui","Condoto","El Cantón del San Pablo",
    "El Carmen de Atrato","El Litoral del San Juan","Istmina","Juradó",
    "Lloró","Medio Atrato","Medio Baudó","Medio San Juan","Nóvita",
    "Nuquí","Quibdó","Río Iro","Río Quito","Riosucio","San José del Palmar",
    "Sipí","Tadó","Unguía","Unión Panamericana"
  ],
  "Córdoba": [
    "Ayapel","Buenavista","Canalete","Cereté","Chimá","Chinú",
    "Ciénaga de Oro","Cotorra","La Apartada","Lorica","Los Córdobas",
    "Momil","Montelíbano","Montería","Moñitos","Planeta Rica",
    "Pueblo Nuevo","Puerto Escondido","Puerto Libertador",
    "Purísima","Sahagún","San Andrés de Sotavento","San Antero",
    "San Bernardo del Viento","San Carlos","San José de Uré",
    "San Pelayo","Tierralta","Tuchín","Valencia"
  ],
  "Cundinamarca": [
    "Agua de Dios","Albán","Anapoima","Anolaima","Apulo","Arbeláez",
    "Beltrán","Bituima","Bojacá","Cabrera","Cachipay","Cajicá",
    "Caparrapí","Caqueza","Carmen de Carupa","Chaguaní","Chía",
    "Chipaque","Choachí","Chocontá","Cogua","Cota","Cucunubá",
    "El Colegio","El Peñón","El Rosal","Facatativá","Fomeque",
    "Fosca","Funza","Fúquene","Fusagasugá","Gachalá","Gachancipá",
    "Gachetá","Gama","Girardot","Granada","Guachetá","Guaduas",
    "Guasca","Guataquí","Guatavita","Guayabal de Síquima",
    "Guayabetal","Gutiérrez","Jerusalén","Junín","La Calera",
    "La Mesa","La Palma","La Peña","La Vega","Lenguazaque",
    "Machetá","Madrid","Manta","Medina","Mosquera","Nariño",
    "Nemocón","Nilo","Nimaima","Nocaima","Pacho","Paime",
    "Pandi","Paratebueno","Pasca","Puerto Salgar","Pulí",
    "Quebradanegra","Quetame","Quipile","Ricaurte","San Antonio del Tequendama",
    "San Bernardo","San Cayetano","San Francisco","San Juan de Rioseco",
    "Sasaima","Sesquilé","Sibaté","Silvania","Simijaca","Soacha",
    "Sopó","Subachoque","Suesca","Supatá","Susa","Sutatausa",
    "Tabio","Tausa","Tena","Tenjo","Tibacuy","Tibirita","Tocaima",
    "Tocancipá","Topaipí","Ubalá","Ubaque","Ubaté","Une",
    "Útica","Venecia","Vergara","Vianí","Villagómez","Villapinzón",
    "Villeta","Viotá","Yacopí","Zipacón","Zipaquirá"
  ],
  "Guainía": ["Inírida"],
  "Guaviare": ["Calamar","El Retorno","Miraflores","San José del Guaviare"],
  "Huila": [
    "Acevedo","Agrado","Aipe","Algeciras","Altamira","Baraya",
    "Campoalegre","Colombia","Elías","Garzón","Gigante","Guadalupe",
    "Hobo","Íquira","Isnos","La Argentina","La Plata","Nátaga",
    "Neiva","Oporapa","Paicol","Palermo","Palestina","Pital",
    "Pitalito","Rivera","Saladoblanco","San Agustín","Santa María",
    "Suaza","Tarqui","Tello","Teruel","Tesalia","Timaná",
    "Villavieja","Yaguará"
  ],
  "La Guajira": [
    "Albania","Barrancas","Dibulla","Distracción","El Molino",
    "Fonseca","Hatonuevo","La Jagua del Pilar","Maicao",
    "Manaure","Riohacha","San Juan del Cesar","Uribia","Urumita","Villanueva"
  ],
  "Magdalena": [
    "Algarrobo","Aracataca","Ariguaní","Cerro de San Antonio",
    "Chibolo","Ciénaga","Concordia","El Banco","El Piñón",
    "El Retén","Fundación","Guamal","Nueva Granada","Pedraza",
    "Pijiño del Carmen","Pivijay","Plato","Pueblo Viejo",
    "Remolino","Sabanas de San Ángel","Salamina","San Sebastián de Buenavista",
    "San Zenón","Santa Ana","Santa Bárbara de Pinto","Santa Marta",
    "Sitionuevo","Tenerife","Zapayán","Zona Bananera"
  ],
  "Meta": [
    "Acacías","Barranca de Upía","Cabuyaro","Castilla la Nueva",
    "Cubarral","Cumaral","El Calvario","El Castillo","El Dorado",
    "Fuente de Oro","Granada","Guamal","La Macarena","La Uribe",
    "Lejanías","Mapiripán","Mesetas","Puerto Concordia","Puerto Gaitán",
    "Puerto Lleras","Puerto López","Puerto Rico","Restrepo",
    "San Carlos de Guaroa","San Juan de Arama","San Juanito",
    "San Martín","Villavicencio","Vista Hermosa"
  ],
  "Nariño": [
    "Albán","Aldana","Ancuyá","Arboleda","Barbacoas","Belén",
    "Buesaco","Chachagüí","Colón","Consacá","Contadero","Córdoba",
    "Cuaspud","Cumbal","Cumbitara","El Charco","El Peñol","El Rosario",
    "El Tablón","El Tambo","Francisco Pizarro","Funes","Guachucal",
    "Guaitarilla","Gualmatán","Iles","Imués","Ipiales","La Cruz",
    "La Florida","La Llanada","La Tola","La Unión","Leiva","Linares",
    "Los Andes","Magüí","Mallama","Mosquera","Nariño","Olaya Herrera",
    "Ospina","Pasto","Policarpa","Potosí","Providencia","Puerres",
    "Pupiales","Ricaurte","Roberto Payán","Samaniego","San Bernardo",
    "San Lorenzo","San Pablo","San Pedro de Cartago","Sandoná",
    "Santa Bárbara","Santacruz","Sapuyes","Taminango","Tangua",
    "Tumaco","Túquerres","Yacuanquer"
  ],
  "Norte de Santander": [
    "Abrego","Arboledas","Bochalema","Bucarasica","Cáchira","Cácota",
    "Chinácota","Chitagá","Convención","Cúcuta","Cucutilla",
    "Durania","El Carmen","El Tarra","El Zulia","Gramalote",
    "Hacarí","Herrán","Labateca","La Esperanza","La Playa",
    "Los Patios","Lourdes","Mutiscua","Ocaña","Pamplona",
    "Pamplonita","Puerto Santander","Ragonvalia","Salazar",
    "San Calixto","San Cayetano","Santiago","Sardinata",
    "Silos","Teorama","Tibú","Toledo","Villa Caro","Villa del Rosario"
  ],
  "Putumayo": [
    "Colón","Mocoa","Orito","Puerto Asís","Puerto Caicedo",
    "Puerto Guzmán","Puerto Leguízamo","San Francisco",
    "San Miguel","Santiago","Sibundoy","Valle del Guamuez","Villagarzón"
  ],
  "Quindío": [
    "Armenia","Buenavista","Calarcá","Circasia","Córdoba",
    "Filandia","Génova","La Tebaida","Montenegro","Pijao","Quimbaya","Salento"
  ],
  "Risaralda": [
    "Apía","Balboa","Belén de Umbría","Dosquebradas","Guática",
    "La Celia","La Virginia","Marsella","Mistrató","Pereira",
    "Pueblo Rico","Quinchía","Santa Rosa de Cabal","Santuario"
  ],
  "San Andrés y Providencia": ["Providencia","San Andrés"],
  "Santander": [
    "Aguada","Albania","Aratoca","Barbosa","Barichara","Barrancabermeja",
    "Betulia","Bolívar","Bucaramanga","Cabrera","California","Capitanejo",
    "Carcasí","Cepitá","Cerrito","Charalá","Charta","Chima","Chipatá",
    "Cimitarra","Concepción","Confines","Contratación","Coromoro",
    "Curití","El Carmen de Chucurí","El Guacamayo","El Peñón",
    "El Playón","Encino","Enciso","Florián","Floridablanca",
    "Galán","Gámbita","Girón","Guaca","Guadalupe","Guapotá",
    "Guavatá","Güepsa","Hato","Jesús María","Jordán","La Belleza",
    "La Paz","Landázuri","Lebrija","Los Santos","Macaravita",
    "Málaga","Matanza","Mogotes","Molagavita","Ocamonte",
    "Oiba","Onzaga","Palmar","Palmas del Socorro","Páramo",
    "Piedecuesta","Pinchote","Puente Nacional","Puerto Parra",
    "Puerto Wilches","Rionegro","Sabana de Torres","San Andrés",
    "San Benito","San Gil","San Joaquín","San José de Miranda",
    "San Miguel","San Vicente de Chucurí","Santa Bárbara",
    "Santa Helena del Opón","Simacota","Socorro","Suaita",
    "Sucre","Suratá","Tona","Valle de San José","Vélez",
    "Vetas","Villanueva","Zapatoca"
  ],
  "Sucre": [
    "Buenavista","Caimito","Chalán","Colosó","Corozal","Coveñas",
    "El Roble","Galeras","Guaranda","La Unión","Los Palmitos",
    "Majagual","Morroa","Ovejas","Palmito","Sampués",
    "San Benito Abad","San Juan de Betulia","San Marcos",
    "San Onofre","San Pedro","Sincé","Sincelejo","Sucre","Tolú","Tolú Viejo"
  ],
  "Tolima": [
    "Alpujarra","Alvarado","Ambalema","Anzoátegui","Armero",
    "Ataco","Cajamarca","Carmen de Apicalá","Casabianca",
    "Chaparral","Coello","Coyaima","Cunday","Dolores",
    "Espinal","Falan","Flandes","Fresno","Guamo","Herveo",
    "Honda","Ibagué","Icononzo","Lérida","Líbano","Mariquita",
    "Melgar","Murillo","Natagaima","Ortega","Palocabildo",
    "Piedras","Planadas","Prado","Purificación","Rioblanco",
    "Roncesvalles","Rovira","Saldaña","San Antonio",
    "San Luis","Santa Isabel","Suárez","Valle de San Juan","Venadillo","Villahermosa","Villarrica"
  ],
  "Valle del Cauca": [
    "Alcalá","Andalucía","Ansermanuevo","Argelia","Bolívar",
    "Buenaventura","Buga","Bugalagrande","Caicedonia",
    "Cali","Calima","Candelaria","Cartago","Dagua",
    "El Águila","El Cairo","El Cerrito","El Dovio",
    "Florida","Ginebra","Guacarí","Jamundí","La Cumbre",
    "La Unión","La Victoria","Obando","Palmira",
    "Pradera","Restrepo","Riofrío","Roldanillo",
    "San Pedro","Sevilla","Toro","Trujillo","Tuluá",
    "Ulloa","Versalles","Vijes","Yotoco","Yumbo","Zarzal"
  ],
  "Vaupés": ["Carurú","Mitú","Taraira"],
  "Vichada": ["Cumaribo","La Primavera","Puerto Carreño","Santa Rosalía"]
};

interface Notification {
  type: 'success' | 'error';
  message: string;
}

const TrabajaConNosotrosPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobName, setJobName] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    numeroIdentificacion: '',
    numeroContacto: '',
    fechaNacimiento: '',
    correoElectronico: '',
    departamento: '',
    municipio: '',
    perfilProfesional: '',
    otroPerfilProfesional: '',
    especialidades: [] as string[],
    otroEspecialidad: '',
    descripcionHabilidades: '',
    anosExperiencia: '',
    tieneCertificaciones: '',
    disponibilidad: '',
  });

  const [errors, setErrors] = useState({
    numeroIdentificacion: '',
    numeroContacto: '',
    correoElectronico: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vacanteId = params.get('vacante');
    if (vacanteId) {
      setJobId(vacanteId);
      jobService.getById(vacanteId).then(job => {
        setJobName(job.cargo);
      }).catch(() => {
        setJobId(null);
      });
    }
  }, []);

  const [municipiosDisponibles, setMunicipiosDisponibles] = useState<string[]>([]);

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
        { label: "Política de Cookies", href: "/cookies" },
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

  const clearNotification = () => setNotification(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    if (type === 'success') {
      setTimeout(() => setNotification(null), 6000);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateIdentificacion = (id: string): boolean => {
    const numbersOnly = /^\d+$/;
    return numbersOnly.test(id) && id.length >= 7 && id.length <= 10;
  };

  const validateNumeroContacto = (numero: string): boolean => {
    const numbersOnly = /^\d+$/;
    return numbersOnly.test(numero) && numero.length === 10;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'numeroIdentificacion') {
      if (value === '' || /^\d+$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (value === '') {
          setErrors(prev => ({ ...prev, numeroIdentificacion: '' }));
        } else if (!validateIdentificacion(value)) {
          setErrors(prev => ({ ...prev, numeroIdentificacion: 'Debe contener entre 7 y 10 números' }));
        } else {
          setErrors(prev => ({ ...prev, numeroIdentificacion: '' }));
        }
      }
    } else if (name === 'numeroContacto') {
      if (value === '' || /^\d+$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (value === '') {
          setErrors(prev => ({ ...prev, numeroContacto: '' }));
        } else if (!validateNumeroContacto(value)) {
          setErrors(prev => ({ ...prev, numeroContacto: 'Debe contener exactamente 10 números' }));
        } else {
          setErrors(prev => ({ ...prev, numeroContacto: '' }));
        }
      }
    } else if (name === 'correoElectronico') {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (value === '') {
        setErrors(prev => ({ ...prev, correoElectronico: '' }));
      } else if (!validateEmail(value)) {
        setErrors(prev => ({ ...prev, correoElectronico: 'Correo electrónico inválido' }));
      } else {
        setErrors(prev => ({ ...prev, correoElectronico: '' }));
      }
    } else if (name === 'departamento') {
      setFormData(prev => ({ ...prev, departamento: value, municipio: '' }));
      setMunicipiosDisponibles(departamentosYMunicipios[value] || []);
    } else if (name === 'perfilProfesional') {
      setFormData(prev => ({
        ...prev,
        perfilProfesional: value,
        especialidades: [],
        otroEspecialidad: '',
        descripcionHabilidades: '',
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (especialidad: string) => {
    setFormData(prev => ({
      ...prev,
      especialidades: prev.especialidades.includes(especialidad)
        ? prev.especialidades.filter(e => e !== especialidad)
        : [...prev.especialidades, especialidad]
    }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContinuar = () => {
    clearNotification();

    if (currentStep === 1) {
      if (!formData.nombreCompleto.trim()) {
        showNotification('error', 'Por favor ingresá tu nombre completo');
        return;
      }
      if (!validateIdentificacion(formData.numeroIdentificacion)) {
        showNotification('error', 'El número de identificación debe tener entre 7 y 10 dígitos');
        return;
      }
      if (!validateNumeroContacto(formData.numeroContacto)) {
        showNotification('error', 'El número de contacto debe tener exactamente 10 dígitos');
        return;
      }
      if (!formData.fechaNacimiento) {
        showNotification('error', 'Por favor ingresá tu fecha de nacimiento');
        return;
      }
      if (!validateEmail(formData.correoElectronico)) {
        showNotification('error', 'Por favor ingresá un correo electrónico válido');
        return;
      }
      if (!formData.departamento || !formData.municipio) {
        showNotification('error', 'Por favor seleccioná departamento y municipio');
        return;
      }
    }

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAnterior = () => {
    clearNotification();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const mapProfessionalProfile = (perfil: string): string => {
    const map: { [key: string]: string } = {
      'Arquitecto': 'ARQUITECTO',
      'Ingeniero': 'INGENIERO',
      'Abogado': 'ABOGADO',
      'Administrador': 'ADMINISTRADOR',
      'Trabajador social': 'TRABAJADOR_SOCIAL',
      'Construcción': 'CONSTRUCCION',
      'Técnico': 'TECNICO',
      'Otro': 'OTRO',
    };
    return map[perfil] || perfil;
  };

  const mapExperienceLevel = (experiencia: string): string => {
    const map: { [key: string]: string } = {
      'Menos de un año': 'LESS_THAN_ONE',
      '1 a 3 años': 'ONE_TO_THREE',
      '3 a 5 años': 'THREE_TO_FIVE',
      '5 a 10 años': 'FIVE_TO_TEN',
      'Más de 10 años': 'MORE_THAN_TEN'
    };
    return map[experiencia] || experiencia;
  };

  const mapAvailability = (disponibilidad: string): string => {
    const map: { [key: string]: string } = {
      'Tiempo completo': 'FULL_TIME',
      'Medio tiempo': 'PART_TIME',
      'Solo fines de semana': 'WEEKENDS',
      'Por contrato específico': 'CONTRACT'
    };
    return map[disponibilidad] || disponibilidad;
  };

  const mapSpecialties = (especialidades: string[]): string[] => {
    const map: { [key: string]: string } = {
      'Constructor de obra negra (Construcción y reparación de estructuras con ladrillos, cemento y otros materiales)': 'OBRA_NEGRA',
      'Constructor de obra blanca (Terminaciones como instalación de pisos, enchapes, cielo raso, y acabados finales)': 'OBRA_BLANCA',
      'Carpintería (Fabricación e instalación de estructuras de madera como puertas, ventanas ,muebles, closets entre otros)': 'CARPINTERIA',
      'Electricidad (Instalaciones y mantenimiento de sistemas eléctricos)': 'ELECTRICIDAD',
      'Plomería (Instalación y reparación de tuberías y sistemas de agua)': 'PLOMERIA',
      'Estructuras metálicas (Fabricación e instalación de estructuras en acero y otros metales)': 'ESTRUCTURAS_METALICAS',
      'Otro': 'OTRO'
    };
    return especialidades.map(esp => map[esp] || esp);
  };

  const normalizePhone = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+57${cleaned}`;
    }
    if (cleaned.length === 12 && cleaned.startsWith('57')) {
      return `+${cleaned}`;
    }
    return phone;
  };

  const isConstruccion = formData.perfilProfesional === 'Construcción';

  const handleEnviar = async () => {
    clearNotification();

    try {
      if (!formData.nombreCompleto || !formData.numeroIdentificacion || !formData.numeroContacto ||
          !formData.fechaNacimiento || !formData.correoElectronico || !formData.departamento ||
          !formData.municipio || !formData.perfilProfesional ||
          !formData.anosExperiencia || !formData.tieneCertificaciones || !formData.disponibilidad) {
        showNotification('error', 'Por favor completá todos los campos requeridos');
        return;
      }

      if (isConstruccion && formData.especialidades.length === 0) {
        showNotification('error', 'Por favor seleccioná al menos una especialidad de construcción');
        return;
      }

      setSubmitting(true);

      const dataToSend = {
        fullName: formData.nombreCompleto.trim(),
        identificationNumber: formData.numeroIdentificacion.trim(),
        contactNumber: normalizePhone(formData.numeroContacto.trim()),
        birthDate: formData.fechaNacimiento,
        email: formData.correoElectronico.trim(),
        department: formData.departamento,
        municipality: formData.municipio,
        professionalProfile: mapProfessionalProfile(formData.perfilProfesional),
        otherProfessionalProfileDetail: formData.otroPerfilProfesional?.trim() || undefined,
        specialties: isConstruccion ? mapSpecialties(formData.especialidades) : [],
        otherSpecialtyDetail: isConstruccion ? (formData.otroEspecialidad?.trim() || undefined) : undefined,
        skillsDescription: !isConstruccion ? (formData.descripcionHabilidades?.trim() || undefined) : undefined,
        experienceLevel: mapExperienceLevel(formData.anosExperiencia),
        hasCertifications: formData.tieneCertificaciones === 'Sí',
        availability: mapAvailability(formData.disponibilidad),
        jobId: jobId || undefined,
      };

      const response = await submitWorkApplication(dataToSend);

      if (response.success) {
        showNotification('success', response.message || '¡Aplicación enviada con éxito! Nos pondremos en contacto pronto.');
        setFormData({
          nombreCompleto: '',
          numeroIdentificacion: '',
          numeroContacto: '',
          fechaNacimiento: '',
          correoElectronico: '',
          departamento: '',
          municipio: '',
          perfilProfesional: '',
          otroPerfilProfesional: '',
          especialidades: [],
          otroEspecialidad: '',
          descripcionHabilidades: '',
          anosExperiencia: '',
          tieneCertificaciones: '',
          disponibilidad: '',
        });
        setCurrentStep(1);
      } else {
        showNotification('error', response.message);
      }
    } catch (error) {
      console.error('Error al enviar:', error);
      showNotification('error', error instanceof Error ? error.message : 'Error inesperado al enviar la aplicación');
    } finally {
      setSubmitting(false);
    }
  };

  const beneficios = [
    {
      title: 'Proyectos que transforman',
      desc: 'Participá en obras que marcan la diferencia en comunidades y espacios de toda Colombia.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
          <line x1="12" y1="22" x2="12" y2="15.5" />
          <polyline points="22 8.5 12 15.5 2 8.5" />
        </svg>
      ),
    },
    {
      title: 'Equipo colaborativo',
      desc: 'Trabajá junto a profesionales apasionados por el diseño, la arquitectura y la construcción.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: 'Crecimiento continuo',
      desc: 'Accedé a oportunidades de desarrollo profesional y capacitate en nuevas tecnologías y metodologías.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <HeaderLayout />

      <main className="job-page">
        <div className="job-page__container">
          <div className="job-page__hero">
            <h1 className="job-page__title">Trabajá con nosotros</h1>
            <p className="job-page__subtitle">Sumate a un equipo que construye el futuro</p>
            {jobName && (
              <span className="job-page__vacancy-badge">
                Postulándote a: <strong>{jobName}</strong>
              </span>
            )}
          </div>

          <section className="job-page__benefits">
            {beneficios.map((b, i) => (
              <div key={i} className="job-page__benefit-card">
                <div className="job-page__benefit-icon">{b.icon}</div>
                <h3 className="job-page__benefit-title">{b.title}</h3>
                <p className="job-page__benefit-desc">{b.desc}</p>
              </div>
            ))}
          </section>

          <div className="job-page__steps">
            <div className={`job-page__step ${currentStep >= 1 ? 'job-page__step--active' : ''} ${currentStep > 1 ? 'job-page__step--completed' : ''}`}>
              <span className="job-page__step-num">1</span>
              <span className="job-page__step-label">Datos personales</span>
            </div>
            <div className={`job-page__step-line ${currentStep > 1 ? 'job-page__step-line--filled' : ''}`} />
            <div className={`job-page__step ${currentStep === 2 ? 'job-page__step--active' : ''} ${currentStep > 2 ? 'job-page__step--completed' : ''}`}>
              <span className="job-page__step-num">2</span>
              <span className="job-page__step-label">Perfil profesional</span>
            </div>
          </div>

          <div className="job-page__form-wrapper">
            {notification && (
              <div
                className={`job-page__notification ${notification.type === 'success' ? 'job-page__notification--success' : 'job-page__notification--error'}`}
                role="alert"
              >
                <span className="job-page__notification-icon">
                  {notification.type === 'success' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  )}
                </span>
                <span className="job-page__notification-text">{notification.message}</span>
                <button className="job-page__notification-close" onClick={clearNotification} aria-label="Cerrar notificación">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}

            {currentStep === 1 && (
              <div className="job-page__form-step">
                <div className="job-page__row">
                  <div className="job-page__field">
                    <label className="job-page__label">Nombre completo</label>
                    <input
                      type="text"
                      name="nombreCompleto"
                      value={formData.nombreCompleto}
                      onChange={handleInputChange}
                      className="job-page__input"
                      required
                    />
                  </div>
                  <div className="job-page__field">
                    <label className="job-page__label">N° de identificación</label>
                    <input
                      type="text"
                      name="numeroIdentificacion"
                      value={formData.numeroIdentificacion}
                      onChange={handleInputChange}
                      className={`job-page__input ${errors.numeroIdentificacion ? 'job-page__input--error' : ''}`}
                      maxLength={10}
                      required
                    />
                    {errors.numeroIdentificacion && (
                      <span className="job-page__field-error">{errors.numeroIdentificacion}</span>
                    )}
                  </div>
                </div>

                <div className="job-page__row">
                  <div className="job-page__field">
                    <label className="job-page__label">N° de contacto</label>
                    <input
                      type="tel"
                      name="numeroContacto"
                      value={formData.numeroContacto}
                      onChange={handleInputChange}
                      className={`job-page__input ${errors.numeroContacto ? 'job-page__input--error' : ''}`}
                      maxLength={10}
                      required
                    />
                    {errors.numeroContacto && (
                      <span className="job-page__field-error">{errors.numeroContacto}</span>
                    )}
                  </div>
                  <div className="job-page__field">
                    <label className="job-page__label">Fecha de nacimiento</label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleInputChange}
                      className="job-page__input"
                      required
                    />
                  </div>
                </div>

                <div className="job-page__field job-page__field--full">
                  <label className="job-page__label">Correo electrónico</label>
                  <input
                    type="email"
                    name="correoElectronico"
                    value={formData.correoElectronico}
                    onChange={handleInputChange}
                    className={`job-page__input ${errors.correoElectronico ? 'job-page__input--error' : ''}`}
                    required
                  />
                  {errors.correoElectronico && (
                    <span className="job-page__field-error">{errors.correoElectronico}</span>
                  )}
                </div>

                <div className="job-page__row">
                  <div className="job-page__field">
                    <label className="job-page__label">Departamento</label>
                    <select
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleInputChange}
                      className="job-page__input job-page__select"
                      required
                    >
                      <option value="">Seleccioná un departamento</option>
                      {Object.keys(departamentosYMunicipios).sort().map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="job-page__field">
                    <label className="job-page__label">Municipio</label>
                    <select
                      name="municipio"
                      value={formData.municipio}
                      onChange={handleInputChange}
                      className="job-page__input job-page__select"
                      disabled={!formData.departamento}
                      required
                    >
                      <option value="">Seleccioná un municipio</option>
                      {municipiosDisponibles.map((municipio) => (
                        <option key={municipio} value={municipio}>{municipio}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="job-page__actions">
                  <button type="button" onClick={handleContinuar} className="job-page__btn">
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="job-page__form-step">
                <div className="job-page__field job-page__field--full">
                  <label className="job-page__label">Perfil profesional</label>
                  <select
                    name="perfilProfesional"
                    value={formData.perfilProfesional}
                    onChange={handleInputChange}
                    className="job-page__input job-page__select"
                    required
                  >
                    <option value="">Seleccioná tu perfil profesional</option>
                    <option value="Arquitecto">Arquitecto</option>
                    <option value="Ingeniero">Ingeniero</option>
                    <option value="Abogado">Abogado</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Trabajador social">Trabajador social</option>
                    <option value="Construcción">Construcción</option>
                    <option value="Técnico">Técnico</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                {formData.perfilProfesional === 'Otro' && (
                  <div className="job-page__field job-page__field--full">
                    <label className="job-page__label">Especificá tu perfil</label>
                    <input
                      type="text"
                      name="otroPerfilProfesional"
                      value={formData.otroPerfilProfesional}
                      onChange={handleInputChange}
                      className="job-page__input"
                      maxLength={100}
                      required
                    />
                  </div>
                )}

                {formData.perfilProfesional === 'Construcción' && (
                  <div className="job-page__section-card">
                    <label className="job-page__label">Especialidades</label>
                    <div className="job-page__checkboxes">
                      {[
                        'Constructor de obra negra (Construcción y reparación de estructuras con ladrillos, cemento y otros materiales)',
                        'Constructor de obra blanca (Terminaciones como instalación de pisos, enchapes, cielo raso, y acabados finales)',
                        'Carpintería (Fabricación e instalación de estructuras de madera como puertas, ventanas ,muebles, closets entre otros)',
                        'Electricidad (Instalaciones y mantenimiento de sistemas eléctricos)',
                        'Plomería (Instalación y reparación de tuberías y sistemas de agua)',
                        'Estructuras metálicas (Fabricación e instalación de estructuras en acero y otros metales)'
                      ].map((esp) => (
                        <label key={esp} className="job-page__checkbox-card">
                          <input
                            type="checkbox"
                            checked={formData.especialidades.includes(esp)}
                            onChange={() => handleCheckboxChange(esp)}
                            className="job-page__checkbox-input"
                          />
                          <span className="job-page__checkbox-indicator" />
                          <span className="job-page__checkbox-text">{esp}</span>
                        </label>
                      ))}
                      <label className="job-page__checkbox-card">
                        <input
                          type="checkbox"
                          checked={formData.especialidades.includes('Otro')}
                          onChange={() => handleCheckboxChange('Otro')}
                          className="job-page__checkbox-input"
                        />
                        <span className="job-page__checkbox-indicator" />
                        <span className="job-page__checkbox-text">Otro</span>
                      </label>
                      {formData.especialidades.includes('Otro') && (
                        <input
                          type="text"
                          name="otroEspecialidad"
                          value={formData.otroEspecialidad}
                          onChange={handleInputChange}
                          className="job-page__input job-page__input--inline"
                          placeholder="Especificá tu especialidad"
                        />
                      )}
                    </div>
                  </div>
                )}

                {formData.perfilProfesional && formData.perfilProfesional !== 'Construcción' && (
                  <div className="job-page__section-card">
                    <label className="job-page__label">Describí brevemente tus habilidades y experiencia</label>
                    <textarea
                      name="descripcionHabilidades"
                      placeholder="Ej: Manejo de herramientas administrativas, atención al cliente, gestión de proyectos..."
                      value={formData.descripcionHabilidades}
                      onChange={handleInputChange}
                      className="job-page__textarea"
                      rows={3}
                      maxLength={150}
                    />
                    <span className="job-page__char-count">{formData.descripcionHabilidades.length}/150</span>
                  </div>
                )}

                <div className="job-page__section-card">
                  <label className="job-page__label">Años de experiencia</label>
                  <div className="job-page__card-options">
                    {['Menos de un año', '1 a 3 años', '3 a 5 años', '5 a 10 años', 'Más de 10 años'].map((option) => (
                      <button
                        type="button"
                        key={option}
                        className={`job-page__card-option ${formData.anosExperiencia === option ? 'job-page__card-option--selected' : ''}`}
                        onClick={() => handleRadioChange('anosExperiencia', option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="job-page__section-card">
                  <label className="job-page__label">¿Tenés certificaciones o estudios en tu área?</label>
                  <div className="job-page__card-options">
                    {['Sí', 'No'].map((option) => (
                      <button
                        type="button"
                        key={option}
                        className={`job-page__card-option ${formData.tieneCertificaciones === option ? 'job-page__card-option--selected' : ''}`}
                        onClick={() => handleRadioChange('tieneCertificaciones', option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="job-page__section-card">
                  <label className="job-page__label">Disponibilidad</label>
                  <div className="job-page__card-options">
                    {['Tiempo completo', 'Medio tiempo', 'Solo fines de semana', 'Por contrato específico'].map((option) => (
                      <button
                        type="button"
                        key={option}
                        className={`job-page__card-option ${formData.disponibilidad === option ? 'job-page__card-option--selected' : ''}`}
                        onClick={() => handleRadioChange('disponibilidad', option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="job-page__actions job-page__actions--dual">
                  <button type="button" onClick={handleAnterior} className="job-page__btn job-page__btn--outline">
                    Anterior
                  </button>
                  <button type="button" onClick={handleEnviar} className="job-page__btn" disabled={submitting}>
                    {submitting ? 'Enviando...' : 'Enviar solicitud'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer
        logoSrc={LogoSimetrica}
        logoAlt="Logo Simétrica - Empresa de diseño y construcción"
        columns={footerColumns}
        socialLinks={socialLinks}
        copyright="© 2025 Simétrica. Todos los derechos reservados."
        ariaLabel="Pie de página de Simétrica"
      />
    </>
  );
};

export default TrabajaConNosotrosPage;
