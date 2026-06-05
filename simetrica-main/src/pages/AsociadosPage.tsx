import { useState, useMemo } from 'react';
import HeaderLayout from '../layouts/HeaderLayout';
import Footer from '../layouts/Footer/Footer';
import Button from '../components/Button';
import LogoSimetrica from '../assets/logo-simetrica-blanco.png';
import HeroBackground from '../assets/asociados.png';
import './styles/AsociadosPageStyle.css';

type JobStatus = 'priority' | 'open' | 'closed';

interface Job {
  id: number;
  cargo: string;
  empresa: string;
  ciudad: string;
  modalidad: string;
  tipo: string;
  descripcion: string;
  skills: string[];
  status: JobStatus;
}

interface Provider {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  rating: number;
  verificado: boolean;
  fundacion: string;
  proyectos: number;
  ciudad: string;
}

interface Categoria {
  id: string;
  nombre: string;
  contador: number;
  icono: React.ReactNode;
}

interface Stat {
  valor: string;
  superindice?: string;
  label: string;
}

const empleosMock: Job[] = [
  {
    id: 1,
    cargo: 'Técnico en Insonorización',
    empresa: 'Simétrica',
    ciudad: 'Medellín',
    modalidad: 'Presencial',
    tipo: 'Tiempo completo',
    descripcion: 'Buscamos técnico especializado en instalación de paneles acústicos y sistemas de aislamiento sonoro para proyectos comerciales y residenciales.',
    skills: ['Aislamiento acústico', 'Instalación', 'Lectura de planos'],
    status: 'priority',
  },
  {
    id: 2,
    cargo: 'Supervisor de Obra Civil',
    empresa: 'Simétrica',
    ciudad: 'Bogotá',
    modalidad: 'Presencial',
    tipo: 'Tiempo completo',
    descripcion: 'Supervisa y coordina equipos de construcción en proyectos de insonorización industrial, asegurando cumplimiento de normas técnicas y plazos de entrega.',
    skills: ['Supervisión', 'Normas técnicas', 'Gestión de equipos'],
    status: 'open',
  },
  {
    id: 3,
    cargo: 'Diseñador Acústico Senior',
    empresa: 'Simétrica',
    ciudad: 'Remoto',
    modalidad: 'Remoto',
    tipo: 'Tiempo completo',
    descripcion: 'Diseña soluciones acústicas integrales para teatros, estudios de grabación y espacios corporativos usando software de simulación.',
    skills: ['Acústica', 'AutoCAD', 'Simulación', 'Diseño'],
    status: 'priority',
  },
  {
    id: 4,
    cargo: 'Electricista Certificado',
    empresa: 'Simétrica',
    ciudad: 'Cali',
    modalidad: 'Presencial',
    tipo: 'Contrato',
    descripcion: 'Electricista con experiencia en instalaciones eléctricas para proyectos de construcción y adecuación de espacios acústicos.',
    skills: ['Electricidad', 'Certificación RETIE', 'Montaje'],
    status: 'open',
  },
  {
    id: 5,
    cargo: 'Carpintero de Acabados',
    empresa: 'Simétrica',
    ciudad: 'Medellín',
    modalidad: 'Presencial',
    tipo: 'Contrato',
    descripcion: 'Carpintero especializado en fabricación e instalación de paneles acústicos de madera, puertas insonorizadas y cielos rasos.',
    skills: ['Carpintería', 'Acabados', 'Madera'],
    status: 'open',
  },
  {
    id: 6,
    cargo: 'Coordinador de Proyectos',
    empresa: 'Simétrica',
    ciudad: 'Barranquilla',
    modalidad: 'Híbrido',
    tipo: 'Cerrado',
    descripcion: 'Coordina proyectos de insonorización desde cotización hasta entrega final. Experiencia comprobable en gestión de proyectos de construcción.',
    skills: ['Gestión', 'Presupuestos', 'Coordinación'],
    status: 'closed',
  },
];

const proveedoresMock: Provider[] = [
  {
    id: 1,
    nombre: 'Se Carpintería',
    categoria: 'Carpintería y Madera',
    descripcion: 'Especialistas en soluciones de carpintería a medida, combinando diseño, precisión y funcionalidad para proyectos arquitectónicos y comerciales con acabados de alta calidad.',
    rating: 5,
    verificado: true,
    fundacion: '2010',
    proyectos: 340,
    ciudad: 'Medellín',
  },
  {
    id: 2,
    nombre: 'Acústica Panamericana',
    categoria: 'Materiales Acústicos',
    descripcion: 'Distribuidores mayoristas de paneles acústicos, espumas fonoabsorbentes, láminas insonorizantes y barreras acústicas con certificación internacional.',
    rating: 4,
    verificado: true,
    fundacion: '2015',
    proyectos: 180,
    ciudad: 'Bogotá',
  },
  {
    id: 3,
    nombre: 'Estructuras del Norte',
    categoria: 'Estructuras Metálicas',
    descripcion: 'Fabricación y montaje de estructuras de acero para proyectos industriales y comerciales. Certificados en normas técnicas de soldadura estructural.',
    rating: 4,
    verificado: true,
    fundacion: '2008',
    proyectos: 520,
    ciudad: 'Barranquilla',
  },
  {
    id: 4,
    nombre: 'Eléctricos del Valle',
    categoria: 'Electricidad',
    descripcion: 'Instalaciones eléctricas certificadas para proyectos residenciales, comerciales e industriales con más de 12 años de trayectoria.',
    rating: 5,
    verificado: false,
    fundacion: '2012',
    proyectos: 270,
    ciudad: 'Cali',
  },
  {
    id: 5,
    nombre: 'Pisos y Acabados S.A.S.',
    categoria: 'Acabados y Terminaciones',
    descripcion: 'Instalación de pisos vinílicos, laminados, porcelanatos y enchapes con altos estándares de calidad y atención al detalle.',
    rating: 3,
    verificado: false,
    fundacion: '2018',
    proyectos: 95,
    ciudad: 'Medellín',
  },
];

const categoriasData: Categoria[] = [
  {
    id: 'carpinteria',
    nombre: 'Carpintería y Madera',
    contador: 12,
    icono: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 21h18M3 7v1m0-1h6v1m-6 6v1m6-7v1m2-1l3 5h-6l3-5z"/>
        <path d="M15 13h4l-2 8h-2l-2-8h2z"/>
      </svg>
    ),
  },
  {
    id: 'materiales',
    nombre: 'Materiales Acústicos',
    contador: 8,
    icono: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 10h20M2 14h20M6 10v10M12 10v10M18 10v10"/>
        <rect x="4" y="4" width="16" height="6" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'estructuras',
    nombre: 'Estructuras Metálicas',
    contador: 15,
    icono: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16v16H4z"/>
        <path d="M4 12h16M12 4v16"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>
    ),
  },
  {
    id: 'electricidad',
    nombre: 'Electricidad',
    contador: 20,
    icono: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
];

const statsEmpleo: Stat[] = [
  { valor: '2,800', superindice: '+', label: 'Profesionales activos' },
  { valor: '350', superindice: '+', label: 'Proyectos en ejecución' },
  { valor: '24', label: 'Vacantes abiertas' },
  { valor: '18', label: 'Departamentos' },
];

const statsProveedores: Stat[] = [
  { valor: '450', superindice: '+', label: 'Proveedores registrados' },
  { valor: '32', label: 'Categorías' },
  { valor: '280', superindice: '+', label: 'Verificados' },
  { valor: '1,200', superindice: '+', label: 'Proyectos conjuntos' },
];

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-4.35-4.35"/>
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? 'var(--primary-color)' : 'none'}
      stroke="var(--primary-color)"
      strokeWidth="1.5"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function StatsRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="asociados-stats">
      {stats.map((s, i) => (
        <div key={i} className="asociados-stats__card">
          <div className="asociados-stats__value">
            {s.valor}
            {s.superindice && <sup className="asociados-stats__super">{s.superindice}</sup>}
          </div>
          <div className="asociados-stats__label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ label, title, description, badgeValor, badgeTexto }: {
  label: string;
  title: string;
  description: string;
  badgeValor: string;
  badgeTexto: string;
}) {
  return (
    <div className="asociados-section-header">
      <div className="asociados-section-header__left">
        <span className="asociados-section-header__label">{label}</span>
        <h2 className="asociados-section-header__title">{title}</h2>
        <p className="asociados-section-header__desc">{description}</p>
      </div>
      <div className="asociados-section-header__badge">
        <span className="asociados-section-header__badge-num">{badgeValor}</span>
        <span className="asociados-section-header__badge-text">{badgeTexto}</span>
      </div>
    </div>
  );
}

function CtaBanner() {
  return (
    <div className="asociados-cta">
      <div className="asociados-cta__text">
        <h3 className="asociados-cta__title">¿No encuentras lo que buscas?</h3>
        <p className="asociados-cta__desc">
          Envíanos tu hoja de vida y te contactaremos cuando tengamos una vacante que se ajuste a tu perfil.
        </p>
      </div>
      <div className="asociados-cta__actions">
        <Button variant="primary" size="lg" href="/trabaja-con-nosotros">
          Enviar hoja de vida
        </Button>
        <Button variant="secondary" size="lg" href="/contacto">
          Contactar
        </Button>
      </div>
    </div>
  );
}

const FILTROS = ['Tiempo completo', 'Contrato', 'Presencial', 'Remoto', 'Híbrido'];

function PanelEmpleo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (f: string) => {
    setActiveFilters(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  };

  const empleosFiltrados = useMemo(() => {
    return empleosMock.filter(j => {
      if (searchTerm && !j.cargo.toLowerCase().includes(searchTerm.toLowerCase()) && !j.empresa.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (ubicacion && !j.ciudad.toLowerCase().includes(ubicacion.toLowerCase())) return false;
      if (activeFilters.length > 0) {
        const match = activeFilters.some(f =>
          j.tipo.toLowerCase().includes(f.toLowerCase()) ||
          j.modalidad.toLowerCase().includes(f.toLowerCase())
        );
        if (!match) return false;
      }
      return true;
    });
  }, [searchTerm, ubicacion, activeFilters]);

  const statusLabel: Record<JobStatus, string> = {
    priority: 'Prioritario',
    open: 'Disponible',
    closed: 'Cerrado',
  };

  const openCount = empleosMock.filter(j => j.status !== 'closed').length;

  return (
    <div className="asociados-panel">
      <SectionHeader
        label="Oportunidades"
        title="Bolsa de Empleo"
        description="Únete al ecosistema de profesionales de la construcción y la insonorización. Encuentra proyectos que transforman espacios."
        badgeValor={String(openCount)}
        badgeTexto="vacantes activas"
      />

      <StatsRow stats={statsEmpleo} />

      <div className="asociados-search">
        <div className="asociados-search__row">
          <div className="asociados-search__input-wrap">
            <SearchIcon />
            <input
              className="asociados-search__input"
              type="text"
              placeholder="Buscar por cargo o empresa..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              aria-label="Buscar cargo o empresa"
            />
          </div>
          <div className="asociados-search__input-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <input
              className="asociados-search__input"
              type="text"
              placeholder="Ciudad o departamento..."
              value={ubicacion}
              onChange={e => setUbicacion(e.target.value)}
              aria-label="Buscar por ubicación"
            />
          </div>
          <Button variant="primary" size="md" className="asociados-search__btn">
            Buscar
          </Button>
        </div>
        <div className="asociados-search__chips">
          {FILTROS.map(f => (
            <button
              key={f}
              className={`asociados-search__chip${activeFilters.includes(f) ? ' asociados-search__chip--active' : ''}`}
              onClick={() => toggleFilter(f)}
              aria-pressed={activeFilters.includes(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="asociados-empleo-grid">
        {empleosFiltrados.map(j => (
          <article key={j.id} className="asociados-empleo-card">
            <div className="asociados-empleo-card__accent" />
            <div className="asociados-empleo-card__header">
              <div className="asociados-empleo-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 7h-4a2 2 0 00-2 2v10a2 2 0 002 2h4a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                  <path d="M8 3H4a2 2 0 00-2 2v14a2 2 0 002 2h4a2 2 0 002-2V5a2 2 0 00-2-2z"/>
                </svg>
              </div>
              <span className={`asociados-empleo-card__tag asociados-empleo-card__tag--${j.status}`}>
                {statusLabel[j.status]}
              </span>
            </div>
            <h4 className="asociados-empleo-card__title">{j.cargo}</h4>
            <div className="asociados-empleo-card__meta">
              <span>{j.ciudad}</span>
              <span className="asociados-empleo-card__meta-sep">·</span>
              <span>{j.modalidad}</span>
              <span className="asociados-empleo-card__meta-sep">·</span>
              <span>{j.tipo}</span>
            </div>
            <p className="asociados-empleo-card__desc">{j.descripcion}</p>
            <div className="asociados-empleo-card__skills">
              {j.skills.map(s => (
                <span key={s} className="asociados-empleo-card__skill">{s}</span>
              ))}
            </div>
            <Button
              variant="primary"
              fullWidth
              size="md"
              disabled={j.status === 'closed'}
              onClick={() => window.location.href = '/trabaja-con-nosotros'}
            >
              {j.status === 'closed' ? 'Convocatoria cerrada' : 'Postularme'}
            </Button>
          </article>
        ))}
      </div>

      {empleosFiltrados.length === 0 && (
        <p className="asociados-empty">No se encontraron vacantes con esos criterios.</p>
      )}

      <CtaBanner />
    </div>
  );
}

function PanelProveedores() {
  interface FormData {
    empresa: string;
    contacto: string;
    email: string;
    telefono: string;
    categoria: string;
    descripcion: string;
    acepto: boolean;
  }

  const [form, setForm] = useState<FormData>({
    empresa: '',
    contacto: '',
    email: '',
    telefono: '',
    categoria: '',
    descripcion: '',
    acepto: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registro de proveedor:', form);
    alert('Registro enviado correctamente. Nos pondremos en contacto contigo pronto.');
    setForm({ empresa: '', contacto: '', email: '', telefono: '', categoria: '', descripcion: '', acepto: false });
  };

  return (
    <div className="asociados-panel">
      <SectionHeader
        label="Alianzas estratégicas"
        title="Red de Proveedores"
        description="Conectamos a los mejores proveedores del sector construcción e insonorización con proyectos de alto impacto."
        badgeValor={String(proveedoresMock.length * 85)}
        badgeTexto="proveedores activos"
      />

      <StatsRow stats={statsProveedores} />

      <div className="asociados-categorias">
        {categoriasData.map(cat => (
          <button key={cat.id} className="asociados-categorias__item">
            <div className="asociados-categorias__icon">{cat.icono}</div>
            <span className="asociados-categorias__nombre">{cat.nombre}</span>
            <span className="asociados-categorias__contador">{cat.contador} proveedores</span>
          </button>
        ))}
      </div>

      <div className="asociados-proveedor-grid">
        {proveedoresMock.map(p => (
          <article key={p.id} className="asociados-proveedor-card">
            <div className="asociados-proveedor-card__header">
              <div className="asociados-proveedor-card__logo">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18M9 21V9"/>
                </svg>
              </div>
              <div className="asociados-proveedor-card__info">
                <h4 className="asociados-proveedor-card__nombre">{p.nombre}</h4>
                <span className="asociados-proveedor-card__cat">{p.categoria}</span>
              </div>
              {p.verificado && (
                <span className="asociados-proveedor-card__verificado">
                  <ShieldIcon />
                  Verificado
                </span>
              )}
            </div>
            <p className="asociados-proveedor-card__desc">{p.descripcion}</p>
            <div className="asociados-proveedor-card__meta">
              <div className="asociados-proveedor-card__meta-item">
                <span className="asociados-proveedor-card__meta-val">{p.fundacion}</span>
                <span className="asociados-proveedor-card__meta-sub">Fundación</span>
              </div>
              <div className="asociados-proveedor-card__meta-item">
                <span className="asociados-proveedor-card__meta-val">{p.proyectos}</span>
                <span className="asociados-proveedor-card__meta-sub">Proyectos</span>
              </div>
              <div className="asociados-proveedor-card__meta-item">
                <span className="asociados-proveedor-card__meta-val">{p.ciudad}</span>
                <span className="asociados-proveedor-card__meta-sub">Sede</span>
              </div>
            </div>
            <div className="asociados-proveedor-card__rating">
              {[1, 2, 3, 4, 5].map(n => (
                <StarIcon key={n} filled={n <= p.rating} />
              ))}
              <span className="asociados-proveedor-card__rating-num">{p.rating}.0</span>
            </div>
            <button className="asociados-proveedor-card__btn">
              Contactar proveedor
            </button>
          </article>
        ))}
      </div>

      <div className="asociados-form">
        <h3 className="asociados-form__title">Registra tu empresa como proveedor</h3>
        <p className="asociados-form__desc">
          ¿Eres proveedor del sector construcción? Únete a nuestra red y accede a nuevos proyectos.
        </p>
        <form onSubmit={handleSubmit} className="asociados-form__fields">
          <div className="asociados-form__field">
            <input
              className="asociados-form__input"
              type="text"
              name="empresa"
              placeholder="Nombre de la empresa"
              value={form.empresa}
              onChange={handleChange}
              required
            />
          </div>
          <div className="asociados-form__field">
            <input
              className="asociados-form__input"
              type="text"
              name="contacto"
              placeholder="Nombre de contacto"
              value={form.contacto}
              onChange={handleChange}
              required
            />
          </div>
          <div className="asociados-form__field">
            <input
              className="asociados-form__input"
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="asociados-form__field">
            <input
              className="asociados-form__input"
              type="tel"
              name="telefono"
              placeholder="Teléfono de contacto"
              value={form.telefono}
              onChange={handleChange}
              required
            />
          </div>
          <div className="asociados-form__field">
            <select
              className="asociados-form__input asociados-form__select"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              <option value="carpinteria">Carpintería y Madera</option>
              <option value="materiales">Materiales Acústicos</option>
              <option value="estructuras">Estructuras Metálicas</option>
              <option value="electricidad">Electricidad</option>
              <option value="acabados">Acabados y Terminaciones</option>
              <option value="otro">Otra</option>
            </select>
          </div>
          <div className="asociados-form__field asociados-form__field--full">
            <textarea
              className="asociados-form__input asociados-form__textarea"
              name="descripcion"
              placeholder="Describe los servicios de tu empresa..."
              value={form.descripcion}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>
          <div className="asociados-form__field asociados-form__field--full">
            <label className="asociados-form__checkbox-label">
              <input
                type="checkbox"
                name="acepto"
                checked={form.acepto}
                onChange={handleChange}
                className="asociados-form__checkbox"
                required
              />
              <span>Acepto los términos y condiciones de la red de proveedores</span>
            </label>
          </div>
          <div className="asociados-form__field asociados-form__field--full">
            <Button variant="primary" size="lg" fullWidth type="submit">
              Registrar empresa
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const AsociadosPage = () => {
  const [activeTab, setActiveTab] = useState<'empleo' | 'proveedores'>('empleo');

  const footerColumns = [
    {
      title: 'Servicios',
      links: [
        { label: 'Proyectos', href: '/proyectos' },
        { label: 'Diseños', href: '/diseños' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Asociados', href: '/asociados' },
        { label: 'Trabaja con nosotros', href: '/trabaja-con-nosotros' },
        { label: 'Contacto', href: '/contacto' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Política de Privacidad', href: '/privacidad' },
        { label: 'Política de Cookies', href: '/cookies' },
        { label: 'Términos de Servicio', href: '/terminos' },
      ],
    },
  ];

  const socialLinks = [
    { label: 'Instagram', href: 'https://www.instagram.com/simetrica_ia/', external: true },
    { label: 'Facebook', href: 'https://www.facebook.com/share/17PvCWuUtm/?mibextid=wwXIfr', external: true },
    { label: 'TikTok', href: 'https://www.tiktok.com/@simetrica7?_t=ZS-90L6hiOnqKe&_r=1', external: true },
    { label: 'Pinterest', href: 'https://co.pinterest.com/insonorizacion_acustica7/?invite_code=dd12bf69cdd14ac8aecd84e3f084a435&sender=595601256878326965', external: true },
    { label: 'WhatsApp', href: 'https://wa.me/573103858223', external: true },
  ];

  return (
    <>
      <HeaderLayout />

      <main className="asociados-page">
        <section className="asociados-hero">
          <div className="hero-image">
            <img src={HeroBackground} alt="" />
          </div>
          <div className="asociados-hero__overlay" />
          <div className="asociados-hero__content">
            <span className="asociados-hero__label">Asociados</span>
            <h1 className="asociados-hero__title">Crecemos juntos</h1>
            <div className="asociados-hero__divider" />
            <p className="asociados-hero__desc">
              Contamos con una red de asociados estratégicos que fortalecen nuestra capacidad
              técnica y operativa. Gracias a estas alianzas, garantizamos soluciones eficientes,
              confiables y alineadas con las necesidades de nuestros clientes.
            </p>
          </div>
        </section>

        <section className="asociados-content">
          <div className="asociados-content__container">
            <div className="asociados-tabs" role="tablist" aria-label="Secciones de Asociados">
              <button
                role="tab"
                aria-selected={activeTab === 'empleo'}
                className={`asociados-tabs__btn${activeTab === 'empleo' ? ' asociados-tabs__btn--active' : ''}`}
                onClick={() => setActiveTab('empleo')}
              >
                <span className="asociados-tabs__num">01</span>
                <span className="asociados-tabs__label">Bolsa de Empleo</span>
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'proveedores'}
                className={`asociados-tabs__btn${activeTab === 'proveedores' ? ' asociados-tabs__btn--active' : ''}`}
                onClick={() => setActiveTab('proveedores')}
              >
                <span className="asociados-tabs__num">02</span>
                <span className="asociados-tabs__label">Red de Proveedores</span>
              </button>
            </div>

            <div className="asociados-tabs__content" role="tabpanel">
              {activeTab === 'empleo' ? <PanelEmpleo /> : <PanelProveedores />}
            </div>
          </div>
        </section>
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

export default AsociadosPage;
