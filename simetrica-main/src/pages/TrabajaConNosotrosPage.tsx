import React, { useState } from 'react';
import HeaderLayout from '../layouts/HeaderLayout';
import Footer from '../layouts/Footer/Footer';
import { submitWorkApplication } from '../services/workWithUsService';
import './styles/TrabajaConNosotrosPageStyle.css';

// Datos del Footer
import LogoSimetrica from '../assets/logo-simetrica-blanco.png';

// Datos de departamentos y municipios de Colombia
const departamentosYMunicipios: { [key: string]: string[] } = {
  "Amazonas": [
    "Leticia",
    "Puerto Nariño"
  ],

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

  "Arauca": [
    "Arauca","Arauquita","Cravo Norte","Fortul","Puerto Rondón","Saravena","Tame"
  ],

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

  "Guaviare": [
    "Calamar","El Retorno","Miraflores","San José del Guaviare"
  ],

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

  "San Andrés y Providencia": [
    "Providencia","San Andrés"
  ],

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

  "Vaupés": [
    "Carurú","Mitú","Taraira"
  ],

  "Vichada": [
    "Cumaribo","La Primavera","Puerto Carreño","Santa Rosalía"
  ]

};

const TrabajaConNosotrosPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Datos personales
    nombreCompleto: '',
    numeroIdentificacion: '',
    numeroContacto: '',
    fechaNacimiento: '',
    correoElectronico: '',
    departamento: '',
    municipio: '',
    
    // Información laboral
    especialidades: [] as string[],
    otroEspecialidad: '',
    anosExperiencia: '',
    tieneCertificaciones: '',
    disponibilidad: '',
    
    // Proyectos realizados
    cantidadProyectos: '',
    descripcionExperiencia: '',
    fotosProyectos: [] as File[],
    referencias: [{ nombre: '', telefono: '' }],
    observaciones: ''
  });

  const [errors, setErrors] = useState({
    numeroIdentificacion: '',
    numeroContacto: '',
    correoElectronico: ''
  });

  const [municipiosDisponibles, setMunicipiosDisponibles] = useState<string[]>([]);

  // Configuración de datos para Footer
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

  // Validación de correo electrónico
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validación de número de identificación
  const validateIdentificacion = (id: string): boolean => {
    const numbersOnly = /^\d+$/;
    return numbersOnly.test(id) && id.length >= 7 && id.length <= 10;
  };

  // Validación de número de contacto
  const validateNumeroContacto = (numero: string): boolean => {
    const numbersOnly = /^\d+$/;
    return numbersOnly.test(numero) && numero.length === 10;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Validaciones específicas
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, fotosProyectos: Array.from(e.target.files || []) }));
    }
  };

  const addReferencia = () => {
    setFormData(prev => ({
      ...prev,
      referencias: [...prev.referencias, { nombre: '', telefono: '' }]
    }));
  };

  const updateReferencia = (index: number, field: 'nombre' | 'telefono', value: string) => {
    setFormData(prev => ({
      ...prev,
      referencias: prev.referencias.map((ref, i) => 
        i === index ? { ...ref, [field]: value } : ref
      )
    }));
  };

  const handleContinuar = () => {
    // Validar datos del paso 1 antes de continuar
    if (currentStep === 1) {
      if (!formData.nombreCompleto.trim()) {
        alert('Por favor ingrese su nombre completo');
        return;
      }
      if (!validateIdentificacion(formData.numeroIdentificacion)) {
        alert('Número de identificación debe contener entre 7 y 10 dígitos');
        return;
      }
      if (!validateNumeroContacto(formData.numeroContacto)) {
        alert('Número de contacto debe contener exactamente 10 dígitos');
        return;
      }
      if (!formData.fechaNacimiento) {
        alert('Por favor ingrese su fecha de nacimiento');
        return;
      }
      if (!validateEmail(formData.correoElectronico)) {
        alert('Por favor ingrese un correo electrónico válido');
        return;
      }
      if (!formData.departamento || !formData.municipio) {
        alert('Por favor seleccione departamento y municipio');
        return;
      }
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAnterior = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Funciones de mapeo de valores del formulario a enums del backend
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

  const mapProjectsRange = (rango: string): string => {
    const map: { [key: string]: string } = {
      '0-5': '0_5',
      '5-10': '5_10',
      '10-15': '10_20',
      '15-20': '10_20',
      '20-25': '20_30',
      '25-30': '20_30',
      '30-35': '30_35',
      '35-40': 'MORE_THAN_35',
      '40-45': 'MORE_THAN_35',
      '45-50': 'MORE_THAN_35',
      '50+': 'MORE_THAN_35'
    };
    return map[rango] || rango;
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
    // Eliminar todos los caracteres no numéricos
    const cleaned = phone.replace(/\D/g, '');
    // Si tiene 10 dígitos, agregar +57
    if (cleaned.length === 10) {
      return `+57${cleaned}`;
    }
    // Si ya tiene el prefijo, devolverlo tal cual
    if (cleaned.length === 12 && cleaned.startsWith('57')) {
      return `+${cleaned}`;
    }
    return phone;
  };

  const handleEnviar = async () => {
    try {
      // Validar que tengamos al menos una referencia
      if (!formData.referencias || formData.referencias.length === 0) {
        alert('Debe agregar al menos una referencia');
        return;
      }

      // Validar campos requeridos
      if (!formData.nombreCompleto || !formData.numeroIdentificacion || !formData.numeroContacto || 
          !formData.fechaNacimiento || !formData.correoElectronico || !formData.departamento || 
          !formData.municipio || formData.especialidades.length === 0 || !formData.anosExperiencia || 
          !formData.tieneCertificaciones || !formData.disponibilidad || !formData.cantidadProyectos) {
        alert('Por favor completa todos los campos requeridos');
        return;
      }

      const dataToSend = {
        fullName: formData.nombreCompleto.trim(),
        identificationNumber: formData.numeroIdentificacion.trim(),
        contactNumber: normalizePhone(formData.numeroContacto.trim()),
        birthDate: formData.fechaNacimiento,
        email: formData.correoElectronico.trim(),
        department: formData.departamento,
        municipality: formData.municipio,
        specialties: mapSpecialties(formData.especialidades),
        otherSpecialtyDetail: formData.otroEspecialidad?.trim() || undefined,
        experienceLevel: mapExperienceLevel(formData.anosExperiencia),
        hasCertifications: formData.tieneCertificaciones === 'Sí',
        availability: mapAvailability(formData.disponibilidad),
        completedProjectsRange: mapProjectsRange(formData.cantidadProyectos),
        constructionExperienceDescription: formData.descripcionExperiencia?.trim() || undefined,
        projectPhotos: [],
        references: formData.referencias.filter(ref => ref.nombre && ref.telefono).map(ref => ({
          name: ref.nombre.trim(),
          phone: normalizePhone(ref.telefono.trim()),
          relationship: 'Referencia laboral',
        })),
        additionalComments: formData.observaciones?.trim() || undefined
      };

      console.log('Enviando datos:', dataToSend);
      const response = await submitWorkApplication(dataToSend);

      alert(response.message || 'Aplicación enviada correctamente. Nos pondremos en contacto contigo pronto.');
      
      // Limpiar el formulario
      setFormData({
        nombreCompleto: '',
        numeroIdentificacion: '',
        numeroContacto: '',
        fechaNacimiento: '',
        correoElectronico: '',
        departamento: '',
        municipio: '',
        especialidades: [],
        otroEspecialidad: '',
        anosExperiencia: '',
        tieneCertificaciones: '',
        disponibilidad: '',
        cantidadProyectos: '',
        descripcionExperiencia: '',
        fotosProyectos: [],
        referencias: [{ nombre: '', telefono: '' }],
        observaciones: ''
      });
      setCurrentStep(1);
    } catch (error) {
      console.error('Error al enviar:', error);
      alert(error instanceof Error ? error.message : 'Error al enviar la aplicación');
    }
  };

  return (
    <>
      <HeaderLayout />
      
      <main className="trabajo-page">
        <div className="trabajo-page__container">
          
          {/* Hero section */}
          <div className="trabajo-page__hero">
            <h1 className="trabajo-page__title">Comienza a trabajar con nosotros</h1>
          </div>

          {/* Progress steps */}
          <div className="trabajo-page__steps">
            <div className={`trabajo-page__step ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="trabajo-page__step-circle">Datos personales</div>
            </div>
            <div className="trabajo-page__step-line"></div>
            <div className={`trabajo-page__step ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <div className="trabajo-page__step-circle">Información laboral</div>
            </div>
            <div className="trabajo-page__step-line"></div>
            <div className={`trabajo-page__step ${currentStep === 3 ? 'active' : ''}`}>
              <div className="trabajo-page__step-circle">Proyectos realizados</div>
            </div>
          </div>

          {/* Formulario */}
          <div className="trabajo-page__form-container">
            
            {/* Paso 1: Datos personales */}
            {currentStep === 1 && (
              <div className="trabajo-page__form-step">
                <div className="trabajo-page__field">
                  <input
                    type="text"
                    name="nombreCompleto"
                    placeholder="Nombre completo"
                    value={formData.nombreCompleto}
                    onChange={handleInputChange}
                    className="trabajo-page__input"
                    required
                  />
                </div>

                <div className="trabajo-page__field">
                  <input
                    type="text"
                    name="numeroIdentificacion"
                    placeholder="Número de identificación (7-10 dígitos)"
                    value={formData.numeroIdentificacion}
                    onChange={handleInputChange}
                    className={`trabajo-page__input ${errors.numeroIdentificacion ? 'trabajo-page__input--error' : ''}`}
                    maxLength={10}
                    required
                  />
                  {errors.numeroIdentificacion && (
                    <span className="trabajo-page__error">{errors.numeroIdentificacion}</span>
                  )}
                </div>

                <div className="trabajo-page__field">
                  <input
                    type="tel"
                    name="numeroContacto"
                    placeholder="Número de contacto (10 dígitos)"
                    value={formData.numeroContacto}
                    onChange={handleInputChange}
                    className={`trabajo-page__input ${errors.numeroContacto ? 'trabajo-page__input--error' : ''}`}
                    maxLength={10}
                    required
                  />
                  {errors.numeroContacto && (
                    <span className="trabajo-page__error">{errors.numeroContacto}</span>
                  )}
                </div>

                <div className="trabajo-page__field">
                  <input
                    type="text"
                    name="fechaNacimiento"
                    placeholder="Fecha de nacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.type = 'date'}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = 'text';
                    }}
                    className="trabajo-page__input"
                    required
                  />
                </div>

                <div className="trabajo-page__field">
                  <input
                    type="email"
                    name="correoElectronico"
                    placeholder="Correo electrónico"
                    value={formData.correoElectronico}
                    onChange={handleInputChange}
                    className={`trabajo-page__input ${errors.correoElectronico ? 'trabajo-page__input--error' : ''}`}
                    required
                  />
                  {errors.correoElectronico && (
                    <span className="trabajo-page__error">{errors.correoElectronico}</span>
                  )}
                </div>

                <div className="trabajo-page__field">
                  <select
                    name="departamento"
                    value={formData.departamento}
                    onChange={handleInputChange}
                    className="trabajo-page__select"
                    required
                  >
                    <option value="">Seleccione un departamento</option>
                    {Object.keys(departamentosYMunicipios).sort().map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="trabajo-page__field">
                  <select
                    name="municipio"
                    value={formData.municipio}
                    onChange={handleInputChange}
                    className="trabajo-page__select"
                    disabled={!formData.departamento}
                    required
                  >
                    <option value="">Seleccione un municipio</option>
                    {municipiosDisponibles.map((municipio) => (
                      <option key={municipio} value={municipio}>{municipio}</option>
                    ))}
                  </select>
                </div>

                <div className="trabajo-page__actions">
                  <button onClick={handleContinuar} className="trabajo-page__btn">
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {/* Paso 2: Información laboral */}
            {currentStep === 2 && (
              <div className="trabajo-page__form-step">
                <div className="trabajo-page__field-full">
                  <label className="trabajo-page__label">Especialidad</label>
                  <div className="trabajo-page__checkboxes">
                    {[
                      'Constructor de obra negra (Construcción y reparación de estructuras con ladrillos, cemento y otros materiales)',
                      'Constructor de obra blanca (Terminaciones como instalación de pisos, enchapes, cielo raso, y acabados finales)',
                      'Carpintería (Fabricación e instalación de estructuras de madera como puertas, ventanas ,muebles, closets entre otros)',
                      'Electricidad (Instalaciones y mantenimiento de sistemas eléctricos)',
                      'Plomería (Instalación y reparación de tuberías y sistemas de agua)',
                      'Estructuras metálicas (Fabricación e instalación de estructuras en acero y otros metales)'
                    ].map((esp, index) => (
                      <label key={index} className="trabajo-page__checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.especialidades.includes(esp)}
                          onChange={() => handleCheckboxChange(esp)}
                          className="trabajo-page__checkbox"
                        />
                        <span>{esp}</span>
                      </label>
                    ))}
                    <label className="trabajo-page__checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.especialidades.includes('Otro')}
                        onChange={() => handleCheckboxChange('Otro')}
                        className="trabajo-page__checkbox"
                      />
                      <span>Otro:</span>
                    </label>
                    {formData.especialidades.includes('Otro') && (
                      <input
                        type="text"
                        name="otroEspecialidad"
                        value={formData.otroEspecialidad}
                        onChange={handleInputChange}
                        className="trabajo-page__input trabajo-page__input--inline"
                      />
                    )}
                  </div>
                </div>

                <div className="trabajo-page__field-full">
                  <label className="trabajo-page__label">Años de experiencia</label>
                  <div className="trabajo-page__radios">
                    {['Menos de un año', '1 a 3 años', '3 a 5 años', '5 a 10 años', 'Más de 10 años'].map((option) => (
                      <label key={option} className="trabajo-page__radio-label">
                        <input
                          type="radio"
                          name="anosExperiencia"
                          value={option}
                          checked={formData.anosExperiencia === option}
                          onChange={() => handleRadioChange('anosExperiencia', option)}
                          className="trabajo-page__radio"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="trabajo-page__field-full">
                  <label className="trabajo-page__label">¿Cuenta con certificaciones o estudios en el área de construcción?</label>
                  <div className="trabajo-page__radios">
                    {['Sí', 'No'].map((option) => (
                      <label key={option} className="trabajo-page__radio-label">
                        <input
                          type="radio"
                          name="tieneCertificaciones"
                          value={option}
                          checked={formData.tieneCertificaciones === option}
                          onChange={() => handleRadioChange('tieneCertificaciones', option)}
                          className="trabajo-page__radio"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="trabajo-page__field-full">
                  <label className="trabajo-page__label">Disponibilidad de Trabajo</label>
                  <div className="trabajo-page__radios">
                    {['Tiempo completo', 'Medio tiempo', 'Solo fines de semana', 'Por contrato específico'].map((option) => (
                      <label key={option} className="trabajo-page__radio-label">
                        <input
                          type="radio"
                          name="disponibilidad"
                          value={option}
                          checked={formData.disponibilidad === option}
                          onChange={() => handleRadioChange('disponibilidad', option)}
                          className="trabajo-page__radio"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="trabajo-page__actions">
                  <button onClick={handleAnterior} className="trabajo-page__btn trabajo-page__btn--secondary">
                    Anterior
                  </button>
                  <button onClick={handleContinuar} className="trabajo-page__btn">
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {/* Paso 3: Proyectos realizados */}
            {currentStep === 3 && (
              <div className="trabajo-page__form-step">
                <div className="trabajo-page__field">
                  <select
                    name="cantidadProyectos"
                    value={formData.cantidadProyectos}
                    onChange={handleInputChange}
                    className="trabajo-page__select"
                    required
                  >
                    <option value="">Cantidad de proyectos en los que ha trabajado</option>
                    <option value="0-5">0 a 5 proyectos</option>
                    <option value="5-10">5 a 10 proyectos</option>
                    <option value="10-15">10 a 15 proyectos</option>
                    <option value="15-20">15 a 20 proyectos</option>
                    <option value="20-25">20 a 25 proyectos</option>
                    <option value="25-30">25 a 30 proyectos</option>
                    <option value="30-35">30 a 35 proyectos</option>
                    <option value="35-40">35 a 40 proyectos</option>
                    <option value="40-45">40 a 45 proyectos</option>
                    <option value="45-50">45 a 50 proyectos</option>
                    <option value="50+">Más de 50 proyectos</option>
                  </select>
                </div>

                <div className="trabajo-page__field-full">
                  <textarea
                    name="descripcionExperiencia"
                    placeholder="Describa su experiencia en construcción"
                    value={formData.descripcionExperiencia}
                    onChange={handleInputChange}
                    className="trabajo-page__textarea"
                    rows={5}
                  />
                  <span className="trabajo-page__char-count">{formData.descripcionExperiencia.length}/200</span>
                </div>

                <div className="trabajo-page__field-full">
                  <label className="trabajo-page__upload-label">
                    <span className="trabajo-page__upload-text">Suba fotos de sus proyectos realizados</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="trabajo-page__file-input"
                    />
                    <div className="trabajo-page__upload-icon">📤</div>
                  </label>
                  {formData.fotosProyectos.length > 0 && (
                    <p className="trabajo-page__file-count">{formData.fotosProyectos.length} archivo(s) seleccionado(s)</p>
                  )}
                </div>

                <div className="trabajo-page__field-full">
                  <div className="trabajo-page__referencias-header">
                    <label className="trabajo-page__label">Referencias laborales</label>
                    <button onClick={addReferencia} className="trabajo-page__add-btn">+</button>
                  </div>
                  {formData.referencias.map((ref, index) => (
                    <div key={index} className="trabajo-page__referencia">
                      <input
                        type="text"
                        placeholder="Nombre"
                        value={ref.nombre}
                        onChange={(e) => updateReferencia(index, 'nombre', e.target.value)}
                        className="trabajo-page__input trabajo-page__input--half"
                      />
                      <input
                        type="tel"
                        placeholder="Teléfono"
                        value={ref.telefono}
                        onChange={(e) => updateReferencia(index, 'telefono', e.target.value)}
                        className="trabajo-page__input trabajo-page__input--half"
                      />
                    </div>
                  ))}
                </div>

                <div className="trabajo-page__field-full">
                  <textarea
                    name="observaciones"
                    placeholder="¿Tiene alguna observación adicional o comentario que desee agregar?"
                    value={formData.observaciones}
                    onChange={handleInputChange}
                    className="trabajo-page__textarea"
                    rows={4}
                  />
                  <span className="trabajo-page__char-count">{formData.observaciones.length}/200</span>
                </div>

                <div className="trabajo-page__actions">
                  <button onClick={handleAnterior} className="trabajo-page__btn trabajo-page__btn--secondary">
                    Anterior
                  </button>
                  <button onClick={handleEnviar} className="trabajo-page__btn">
                    Enviar
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
