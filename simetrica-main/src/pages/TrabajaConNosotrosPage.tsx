import React, { useState } from 'react';
import HeaderLayout from '../layouts/HeaderLayout';
import Footer from '../layouts/Footer/Footer';
import { submitWorkApplication } from '../services/workWithUsService';
import './styles/TrabajaConNosotrosPageStyle.css';

// Datos del Footer
import LogoSimetrica from '../assets/logo-simetrica-blanco.png';

// Datos de departamentos y municipios de Colombia
const departamentosYMunicipios: { [key: string]: string[] } = {
  "Amazonas": ["Leticia", "Puerto Nariño"],
  "Antioquia": ["Medellín", "Bello", "Itagüí", "Envigado", "Apartadó", "Turbo", "Rionegro", "Sabaneta", "Caldas", "La Ceja", "Copacabana"],
  "Arauca": ["Arauca", "Arauquita", "Saravena", "Fortul", "Tame"],
  "Atlántico": ["Barranquilla", "Soledad", "Malambo", "Sabanalarga", "Puerto Colombia", "Galapa", "Baranoa"],
  "Bolívar": ["Cartagena", "Magangué", "Turbaco", "Arjona", "El Carmen de Bolívar", "Mompós"],
  "Boyacá": ["Tunja", "Duitama", "Sogamoso", "Chiquinquirá", "Paipa", "Villa de Leyva", "Puerto Boyacá"],
  "Caldas": ["Manizales", "La Dorada", "Chinchiná", "Villamaría", "Riosucio"],
  "Caquetá": ["Florencia", "San Vicente del Caguán", "Puerto Rico", "El Doncello"],
  "Casanare": ["Yopal", "Aguazul", "Villanueva", "Monterrey", "Paz de Ariporo"],
  "Cauca": ["Popayán", "Santander de Quilichao", "Puerto Tejada", "Patía", "Miranda"],
  "Cesar": ["Valledupar", "Aguachica", "Bosconia", "Codazzi", "La Paz", "San Diego"],
  "Chocó": ["Quibdó", "Istmina", "Condoto", "Acandí", "Bahía Solano"],
  "Córdoba": ["Montería", "Cereté", "Lorica", "Sahagún", "Planeta Rica", "Montelíbano"],
  "Cundinamarca": ["Bogotá", "Soacha", "Facatativá", "Zipaquirá", "Chía", "Fusagasugá", "Madrid", "Mosquera", "Funza", "Cajicá", "Girardot"],
  "Guainía": ["Inírida"],
  "Guaviare": ["San José del Guaviare", "Calamar", "El Retorno"],
  "Huila": ["Neiva", "Pitalito", "Garzón", "La Plata", "Campoalegre"],
  "La Guajira": ["Riohacha", "Maicao", "Uribia", "Manaure", "San Juan del Cesar"],
  "Magdalena": ["Santa Marta", "Ciénaga", "Fundación", "Plato", "El Banco"],
  "Meta": ["Villavicencio", "Acacías", "Granada", "Puerto López", "San Martín"],
  "Nariño": ["Pasto", "Tumaco", "Ipiales", "Túquerres", "Samaniego"],
  "Norte de Santander": ["Cúcuta", "Ocaña", "Pamplona", "Villa del Rosario", "Los Patios", "Tibú"],
  "Putumayo": ["Mocoa", "Puerto Asís", "Valle del Guamuez", "Orito"],
  "Quindío": ["Armenia", "Calarcá", "La Tebaida", "Montenegro", "Quimbaya"],
  "Risaralda": ["Pereira", "Dosquebradas", "Santa Rosa de Cabal", "La Virginia"],
  "San Andrés y Providencia": ["San Andrés", "Providencia"],
  "Santander": ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta", "Barrancabermeja", "San Gil", "Socorro"],
  "Sucre": ["Sincelejo", "Corozal", "Sampués", "San Marcos", "Tolú"],
  "Tolima": ["Ibagué", "Espinal", "Melgar", "Honda", "Chaparral", "Líbano"],
  "Valle del Cauca": ["Cali", "Palmira", "Buenaventura", "Tuluá", "Cartago", "Buga", "Jamundí", "Yumbo"],
  "Vaupés": ["Mitú", "Carurú"],
  "Vichada": ["Puerto Carreño", "La Primavera", "Cumaribo"]
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
        { label: "Diseños", href: "/diseños" },
        { label: "Construcción", href: "/construccion" }
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
