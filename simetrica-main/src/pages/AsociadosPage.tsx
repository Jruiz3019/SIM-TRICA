import { useState, useMemo, useEffect, useCallback } from 'react';
import HeaderLayout from '../layouts/HeaderLayout';
import Footer from '../layouts/Footer/Footer';
import Button from '../components/Button';
import LogoSimetrica from '../assets/logo-simetrica-blanco.png';
import HeroBackground from '../assets/asociados.png';
import { submitProviderRegistration } from '../services/providerService';
import jobService from '../services/jobService';
import type { Provider as BackendProvider, ProviderCategory } from '../types/provider.types';
import {
  ProviderCategoryEnum,
} from '../types/provider.types';
import type { Job as BackendJob } from '../types/job.types';
import { JobStatusEnum, JobModalityEnum, JobTypeEnum } from '../types/job.types';
import './styles/AsociadosPageStyle.css';

interface Provider {
  _id: string;
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

const CATEGORY_LABELS: Record<ProviderCategory, string> = {
  [ProviderCategoryEnum.CARPINTERIA]: 'Carpintería y Madera',
  [ProviderCategoryEnum.MATERIALES_ACUSTICOS]: 'Materiales Acústicos',
  [ProviderCategoryEnum.ESTRUCTURAS_METALICAS]: 'Estructuras Metálicas',
  [ProviderCategoryEnum.ELECTRICIDAD]: 'Electricidad',
  [ProviderCategoryEnum.ACABADOS]: 'Acabados y Terminaciones',
  [ProviderCategoryEnum.OTRO]: 'Otra',
};

function getCategoryLabel(cat: string): string {
  return CATEGORY_LABELS[cat as ProviderCategory] || cat;
}

const CATEGORY_MAP: Record<string, ProviderCategory> = {
  carpinteria: ProviderCategoryEnum.CARPINTERIA,
  materiales: ProviderCategoryEnum.MATERIALES_ACUSTICOS,
  estructuras: ProviderCategoryEnum.ESTRUCTURAS_METALICAS,
  electricidad: ProviderCategoryEnum.ELECTRICIDAD,
  acabados: ProviderCategoryEnum.ACABADOS,
  otro: ProviderCategoryEnum.OTRO,
};

const CATEGORY_ICONS: Record<ProviderCategory, React.ReactNode> = {
  [ProviderCategoryEnum.CARPINTERIA]: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21h18M3 7v1m0-1h6v1m-6 6v1m6-7v1m2-1l3 5h-6l3-5z"/>
      <path d="M15 13h4l-2 8h-2l-2-8h2z"/>
    </svg>
  ),
  [ProviderCategoryEnum.MATERIALES_ACUSTICOS]: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 10h20M2 14h20M6 10v10M12 10v10M18 10v10"/>
      <rect x="4" y="4" width="16" height="6" rx="1"/>
    </svg>
  ),
  [ProviderCategoryEnum.ESTRUCTURAS_METALICAS]: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4h16v16H4z"/>
      <path d="M4 12h16M12 4v16"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  [ProviderCategoryEnum.ELECTRICIDAD]: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  ),
  [ProviderCategoryEnum.ACABADOS]: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M12 8v8M8 12h8"/>
    </svg>
  ),
  [ProviderCategoryEnum.OTRO]: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9"/>
      <path d="M8 12h8M12 8v8"/>
    </svg>
  ),
};

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
  const [jobs, setJobs] = useState<BackendJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalOpen: 0, totalPriority: 0, totalClosed: 0, ciudades: 0 });

  const [searchTerm, setSearchTerm] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const result = await jobService.getAll();
      setJobs(result.data);
      const jobStats = await jobService.getStats();
      setStats(jobStats);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Error al cargar vacantes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const toggleFilter = (f: string) => {
    setActiveFilters(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  };

  const MODALITY_LABEL_PUBLIC: Record<string, string> = {
    [JobModalityEnum.PRESENCIAL]: 'Presencial',
    [JobModalityEnum.REMOTO]: 'Remoto',
    [JobModalityEnum.HIBRIDO]: 'Híbrido',
  };

  const TYPE_LABEL_PUBLIC: Record<string, string> = {
    [JobTypeEnum.TIEMPO_COMPLETO]: 'Tiempo completo',
    [JobTypeEnum.CONTRATO]: 'Contrato',
  };

  const empleosFiltrados = useMemo(() => {
    return jobs.filter(j => {
      const searchLower = searchTerm.toLowerCase();
      if (searchTerm && !j.cargo.toLowerCase().includes(searchLower) && !j.descripcion.toLowerCase().includes(searchLower)) return false;
      if (ubicacion && !j.ciudad.toLowerCase().includes(ubicacion.toLowerCase())) return false;
      if (activeFilters.length > 0) {
        const tipoLabel = TYPE_LABEL_PUBLIC[j.tipo] || j.tipo;
        const modalidadLabel = MODALITY_LABEL_PUBLIC[j.modalidad] || j.modalidad;
        const match = activeFilters.some(f =>
          tipoLabel.toLowerCase().includes(f.toLowerCase()) ||
          modalidadLabel.toLowerCase().includes(f.toLowerCase())
        );
        if (!match) return false;
      }
      return true;
    });
  }, [jobs, searchTerm, ubicacion, activeFilters]);

  const statusLabel: Record<string, string> = {
    [JobStatusEnum.PRIORITY]: 'Prioritario',
    [JobStatusEnum.OPEN]: 'Disponible',
    [JobStatusEnum.CLOSED]: 'Cerrado',
  };

  const openCount = stats.totalOpen + stats.totalPriority;

  const statsEmpleo: Stat[] = [
    { valor: String(stats.totalOpen + stats.totalPriority), label: 'Vacantes activas' },
    { valor: String(stats.totalClosed), label: 'Cerradas' },
    { valor: String(stats.ciudades), label: 'Ubicaciones' },
    { valor: String(jobs.reduce((acc, j) => acc + j.skills.length, 0)), label: 'Habilidades' },
  ];

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
              placeholder="Buscar por cargo..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              aria-label="Buscar cargo"
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
          <Button variant="primary" size="md" className="asociados-search__btn" onClick={fetchJobs}>
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

      {loading && (
        <p className="asociados-empty">Cargando vacantes...</p>
      )}

      {fetchError && (
        <div className="asociados-error">{fetchError}</div>
      )}

      {!loading && !fetchError && (
        <>
          <div className="asociados-empleo-grid">
            {empleosFiltrados.map(j => (
              <article key={j._id} className="asociados-empleo-card">
                <div className="asociados-empleo-card__accent" />
                <div className="asociados-empleo-card__header">
                  <div className="asociados-empleo-card__icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 7h-4a2 2 0 00-2 2v10a2 2 0 002 2h4a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                      <path d="M8 3H4a2 2 0 00-2 2v14a2 2 0 002 2h4a2 2 0 002-2V5a2 2 0 00-2-2z"/>
                    </svg>
                  </div>
                  <span className={`asociados-empleo-card__tag asociados-empleo-card__tag--${j.status === JobStatusEnum.PRIORITY ? 'priority' : j.status === JobStatusEnum.OPEN ? 'open' : 'closed'}`}>
                    {statusLabel[j.status]}
                  </span>
                </div>
                <h4 className="asociados-empleo-card__title">{j.cargo}</h4>
                <div className="asociados-empleo-card__meta">
                  <span>{j.ciudad}</span>
                  <span className="asociados-empleo-card__meta-sep">·</span>
                  <span>{MODALITY_LABEL_PUBLIC[j.modalidad]}</span>
                  <span className="asociados-empleo-card__meta-sep">·</span>
                  <span>{TYPE_LABEL_PUBLIC[j.tipo]}</span>
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
                  disabled={j.status === JobStatusEnum.CLOSED}
                  onClick={() => window.location.href = `/trabaja-con-nosotros?vacante=${j._id}`}
                >
                  {j.status === JobStatusEnum.CLOSED ? 'Convocatoria cerrada' : 'Postularme'}
                </Button>
              </article>
            ))}
          </div>

          {empleosFiltrados.length === 0 && (
            <p className="asociados-empty">No se encontraron vacantes con esos criterios.</p>
          )}
        </>
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
    ciudad: string;
    acepto: boolean;
  }

  const [form, setForm] = useState<FormData>({
    empresa: '',
    contacto: '',
    email: '',
    telefono: '',
    categoria: '',
    descripcion: '',
    ciudad: '',
    acepto: false,
  });

  const [providers, setProviders] = useState<Provider[]>([]);
  const [categoriesData, setCategoriesData] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/providers`);
        const json = await res.json();
        const mappedProviders: Provider[] = (json.data || []).map((p: BackendProvider) => ({
          _id: p._id,
          nombre: p.nombre,
          categoria: getCategoryLabel(p.categoria),
          descripcion: p.descripcion,
          rating: p.rating,
          verificado: p.verificado,
          fundacion: p.fundacion || '—',
          proyectos: p.proyectos,
          ciudad: p.ciudad,
        }));
        setProviders(mappedProviders);

        const cats: Categoria[] = (json.categories || []).map(
          (c: { _id: string; count: number }) => ({
            id: c._id.toLowerCase(),
            nombre: getCategoryLabel(c._id),
            contador: c.count,
            icono: CATEGORY_ICONS[c._id as ProviderCategory] || CATEGORY_ICONS.OTRO,
          })
        );
        setCategoriesData(cats);
      } catch {
        setError('No se pudieron cargar los proveedores. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [API_URL]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const mappedCategoria = CATEGORY_MAP[form.categoria] || ProviderCategoryEnum.OTRO;

    const result = await submitProviderRegistration({
      empresa: form.empresa,
      contacto: form.contacto,
      email: form.email,
      telefono: form.telefono,
      categoria: mappedCategoria,
      descripcion: form.descripcion,
      ciudad: form.ciudad,
      acepto: form.acepto,
    });

    if (result.success) {
      alert(result.message);
      setForm({ empresa: '', contacto: '', email: '', telefono: '', categoria: '', descripcion: '', ciudad: '', acepto: false });
    } else {
      alert(result.message);
    }
  };

  const totalProviders = providers.length;
  const totalVerificados = providers.filter(p => p.verificado).length;
  const totalProyectos = providers.reduce((sum, p) => sum + p.proyectos, 0);

  return (
    <div className="asociados-panel">
      <SectionHeader
        label="Alianzas estratégicas"
        title="Red de Proveedores"
        description="Conectamos a los mejores proveedores del sector construcción e insonorización con proyectos de alto impacto."
        badgeValor={String(totalProviders)}
        badgeTexto="proveedores activos"
      />

      <StatsRow
        stats={[
          { valor: String(totalProviders), label: 'Proveedores registrados' },
          { valor: String(categoriesData.length), label: 'Categorías' },
          { valor: String(totalVerificados), superindice: '+', label: 'Verificados' },
          { valor: String(totalProyectos), superindice: '+', label: 'Proyectos conjuntos' },
        ]}
      />

      {error && (
        <div style={{ padding: '16px', background: 'rgba(255,71,87,0.15)', borderRadius: '8px', color: '#ff4757', textAlign: 'center', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p className="asociados-empty">Cargando proveedores...</p>
      ) : (
        <>
          <div className="asociados-categorias">
            {categoriesData.map(cat => (
              <button key={cat.id} className="asociados-categorias__item">
                <div className="asociados-categorias__icon">{cat.icono}</div>
                <span className="asociados-categorias__nombre">{cat.nombre}</span>
                <span className="asociados-categorias__contador">{cat.contador} proveedores</span>
              </button>
            ))}
          </div>

          {providers.length > 0 ? (
            <div className="asociados-proveedor-grid">
              {providers.map(p => (
                <article key={p._id} className="asociados-proveedor-card">
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
          ) : (
            <p className="asociados-empty">Aún no hay proveedores en la red. ¡Sé el primero en registrarte!</p>
          )}
        </>
      )}

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
          <div className="asociados-form__field">
            <input
              className="asociados-form__input"
              type="text"
              name="ciudad"
              placeholder="Ciudad"
              value={form.ciudad}
              onChange={handleChange}
              required
            />
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

function PanelAlianza() {
  return (
    <div className="asociados-panel">
      <SectionHeader
        label="Alianza Estratégica"
        title="Simétrica & IPUC"
        description="Modelo de colaboración para proyectos de construcción, fundamentado en la confianza, el acompañamiento técnico y el beneficio mutuo."
        badgeValor="5%"
        badgeTexto="retribución"
      />

      <section className="alianza-section">
        <h3 className="alianza-section__title">Introducción</h3>
        <p className="alianza-section__text">
          El sostenido crecimiento de la Iglesia Pentecostal Unida de Colombia (IPUC), reflejado en su expansión
          a nivel nacional, ha generado una creciente demanda de soluciones integrales en materia de infraestructura.
          Cada nuevo proyecto implica la necesidad de desarrollar obras civiles que respondan a criterios de
          funcionalidad, seguridad, calidad y sostenibilidad.
        </p>
        <p className="alianza-section__text">
          SIMÉTRICA propone a la IPUC la consolidación de una alianza estratégica fundamentada en la experiencia
          técnica, la calidad constructiva, la transparencia en los procesos y el cumplimiento oportuno de los
          proyectos requeridos. Más que una relación contractual, esta propuesta se fundamenta en la construcción
          de un vínculo estratégico de largo plazo.
        </p>
      </section>

      <section className="alianza-section">
        <h3 className="alianza-section__title">
          <span className="alianza-section__num">1.</span> Retribución Económica para la IPUC
        </h3>
        <p className="alianza-section__text">
          Como reconocimiento por la adjudicación de proyectos a SIMÉTRICA, la IPUC recibirá una participación
          directa sobre el valor de cada proyecto ejecutado.
        </p>
        <div className="alianza-highlight">
          <div className="alianza-highlight__value">5%</div>
          <div className="alianza-highlight__label">del valor total del contrato</div>
        </div>
        <p className="alianza-section__text">
          La retribución económica a favor de la IPUC será calculada sobre el último pago del contrato,
          correspondiente al 30% del valor total acordado, y se efectuará al momento del cierre formal del proyecto.
        </p>
        <div className="alianza-ejemplo">
          <strong>Ejemplo:</strong> Para un proyecto con un valor total contratado de $100.000.000, la retribución
          económica del 5% se calculará sobre el último pago ($30.000.000), correspondiendo a un valor de $1.500.000
          a favor de la IPUC.
        </div>
        <p className="alianza-section__text">
          <strong>Condición de aplicación:</strong> La retribución aplicará exclusivamente sobre contratos adjudicados
          como resultado de la participación directa de la IPUC. Los contratos obtenidos por SIMÉTRICA a través de sus
          propios canales comerciales no generarán este beneficio.
        </p>
      </section>

      <section className="alianza-section">
        <h3 className="alianza-section__title">
          <span className="alianza-section__num">2.</span> Bolsa de Empleo para Miembros de la IPUC
        </h3>
        <p className="alianza-section__text">
          SIMÉTRICA habilita un apartado exclusivo dentro de su plataforma web destinado a priorizar la vinculación
          laboral de los miembros de la IPUC, facilitando el acceso a oportunidades reales de empleo en los diferentes
          perfiles requeridos por la empresa.
        </p>
        <div className="alianza-perfiles">
          {['Arquitectos', 'Ingenieros', 'Abogados', 'Administradores', 'Trabajadores sociales', 'Maestros de obra', 'Técnicos', 'Personal de apoyo'].map(p => (
            <span key={p} className="alianza-perfiles__tag">{p}</span>
          ))}
        </div>
        <p className="alianza-section__text">
          <strong>Beneficio para la comunidad:</strong> Los miembros de la IPUC contarán con acceso prioritario a
          oportunidades laborales dentro de SIMÉTRICA, mientras que la empresa fortalece sus procesos de selección
          mediante la vinculación de personal comprometido e identificado con los valores de la comunidad.
        </p>
      </section>

      <section className="alianza-section">
        <h3 className="alianza-section__title">
          <span className="alianza-section__num">3.</span> Red de Proveedores Asociados
        </h3>
        <p className="alianza-section__text">
          Los miembros de la IPUC que sean propietarios de negocios relacionados con materiales e insumos de
          construcción podrán registrarse y participar como proveedores oficiales de SIMÉTRICA.
        </p>
        <div className="alianza-categorias-grid">
          {[
            {
              label: 'Material eléctrico',
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              ),
            },
            {
              label: 'Ferretería',
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94L4.8 22.2a2 2 0 01-2.83-2.83l9.4-9.4a6 6 0 018.5-8.5l-3.77 3.77"/>
                </svg>
              ),
            },
            {
              label: 'Carpintería en Madera',
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18"/>
                  <path d="M3 7v1m0-1h6v1m-6 6v1m6-7v1"/>
                  <path d="M9 13h6l-2 8H11z"/>
                  <path d="M8 4a1 1 0 011-1h6a1 1 0 011 1v3H8z"/>
                </svg>
              ),
            },
            {
              label: 'Enchapes y acabados',
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              ),
            },
            {
              label: 'Carpintería en Aluminio',
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="3" y1="15" x2="21" y2="15"/>
                  <line x1="12" y1="9" x2="12" y2="3"/>
                </svg>
              ),
            },
            {
              label: 'Herrería',
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 2h4v4"/>
                  <path d="M16 2l5 5"/>
                  <path d="M6 22l-2-2"/>
                  <path d="M4 22l2-2"/>
                  <path d="M14 12l-2 2-2-2 2-2z"/>
                  <line x1="10" y1="14" x2="8" y2="16"/>
                </svg>
              ),
            },
            {
              label: 'Audiovisuales',
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                  <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
                </svg>
              ),
            },
            {
              label: 'Insumos varios',
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              ),
            },
          ].map(cat => (
            <div key={cat.label} className="alianza-categorias-grid__item">
              <div className="alianza-categorias-grid__icon">{cat.icon}</div>
              <span className="alianza-categorias-grid__label">{cat.label}</span>
            </div>
          ))}
        </div>
        <p className="alianza-section__text">
          <strong>Rol de la IPUC como promotor:</strong> La iglesia actuará como canal de difusión y promoción de
          esta red, facilitando que los miembros con negocios propios conozcan y aprovechen el espacio.
        </p>
      </section>

      <section className="alianza-section">
        <h3 className="alianza-section__title">
          <span className="alianza-section__num">4.</span> Ventajas y Garantías
        </h3>
        <div className="alianza-garantias">
          <div className="alianza-garantias__card">
            <div className="alianza-garantias__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h4>Entrega a tiempo</h4>
            <p>Historial comprobado de proyectos finalizados dentro de los plazos acordados, sin retrasos ni contratiempos.</p>
          </div>
          <div className="alianza-garantias__card">
            <div className="alianza-garantias__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h4>Responsabilidad total</h4>
            <p>Gestión íntegra del proyecto: materiales, personal, licencias y coordinación técnica bajo responsabilidad directa de SIMÉTRICA.</p>
          </div>
          <div className="alianza-garantias__card">
            <div className="alianza-garantias__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h4>Transparencia total</h4>
            <p>Cada obra finalizada refuerza la reputación de SIMÉTRICA como aliado estratégico de las comunidades con las que trabaja.</p>
          </div>
          <div className="alianza-garantias__card">
            <div className="alianza-garantias__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <h4>Soporte técnico especializado</h4>
            <p>Informes periódicos con datos verificables del avance de obra, presupuesto ejecutado y estado general del proyecto.</p>
          </div>
        </div>
      </section>

      <section className="alianza-section">
        <h3 className="alianza-section__title">
          <span className="alianza-section__num">5.</span> Servicio de Supervisión Técnica de Obra
        </h3>
        <p className="alianza-section__text">
          Una de las propuestas más diferenciadoras de este modelo de alianza es la oferta de un servicio profesional
          de supervisión de obra provisto por SIMÉTRICA, aportando personal calificado que pueda generar mayor
          confiabilidad en esta labor donde sea requerido.
        </p>
        <div className="alianza-funciones">
          <h4>Funciones del supervisor técnico:</h4>
          <ul>
            <li>Verificación del cumplimiento del cronograma de obra según lo pactado contractualmente.</li>
            <li>Identificación y registro de imprevistos técnicos, con propuesta de solución documentada.</li>
            <li>Monitoreo del uso del presupuesto y de los materiales empleados en obra.</li>
            <li>Emisión de informe técnico cada 15 días dirigido a la junta local de la iglesia correspondiente.</li>
            <li>Balance general del avance del proyecto.</li>
          </ul>
        </div>
        <div className="alianza-reporte">
          <div className="alianza-reporte__badge">
            <span className="alianza-reporte__frecuencia">Cada 15 días</span>
            <span className="alianza-reporte__label">Informe técnico formal</span>
          </div>
          <p className="alianza-reporte__detalle">
            El informe incluye: porcentaje de avance, estado del presupuesto, novedades técnicas registradas
            y proyección actualizada de la fecha de entrega.
          </p>
        </div>
      </section>

      <div className="alianza-emblema">
        <div className="alianza-emblema__content">
          <div className="alianza-emblema__decorator" />
          <p className="alianza-emblema__text">
            Esta propuesta representa una alianza de doble beneficio: crecimiento económico para la IPUC
            y proyectos ejecutados con excelencia, transparencia y compromiso comunitario.
          </p>
          <div className="alianza-emblema__divider" />
          <p className="alianza-emblema__slogan">Cada detalle cuenta</p>
        </div>
      </div>
    </div>
  );
}

const AsociadosPage = () => {
  const [activeTab, setActiveTab] = useState<'empleo' | 'proveedores' | 'alianza'>('empleo');

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
              <button
                role="tab"
                aria-selected={activeTab === 'alianza'}
                className={`asociados-tabs__btn${activeTab === 'alianza' ? ' asociados-tabs__btn--active' : ''}`}
                onClick={() => setActiveTab('alianza')}
              >
                <span className="asociados-tabs__num">03</span>
                <span className="asociados-tabs__label">Alianza IPUC</span>
              </button>
            </div>

            <div className="asociados-tabs__content" role="tabpanel">
              {activeTab === 'empleo' ? <PanelEmpleo /> : activeTab === 'alianza' ? <PanelAlianza /> : <PanelProveedores />}
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
