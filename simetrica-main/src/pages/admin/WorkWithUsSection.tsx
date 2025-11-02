import { useState, useEffect } from 'react';
import Table from '../../components/admin/Table';
import Badge from '../../components/admin/Badge';
import Modal from '../../components/admin/Modal';
import type { TableColumn } from '../../components/admin/Table';
import type { WorkWithUs, ApplicationStatus, Experience, Availability, Specialty } from '../../types/work-with-us.types';
import { ApplicationStatusEnum } from '../../types/work-with-us.types';
import adminWorkWithUsService from '../../services/adminWorkWithUsService';
import './WorkWithUsSection.css';

export default function WorkWithUsSection() {
  const [applications, setApplications] = useState<WorkWithUs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<WorkWithUs | null>(null);
  
  // Estados para los filtros
  const [searchText, setSearchText] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState<Specialty | 'ALL'>('ALL');
  const [filterExperience, setFilterExperience] = useState<Experience | 'ALL'>('ALL');
  const [filterAvailability, setFilterAvailability] = useState<Availability | 'ALL'>('ALL');
  const [filterLocation, setFilterLocation] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminWorkWithUsService.getAll(1, 50);
      setApplications(response.data);
    } catch {
      setError('Error al cargar aplicaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    try {
      await adminWorkWithUsService.updateStatus(id, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
      );
    } catch {
      alert('Error al actualizar el estado');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta aplicación?')) return;

    try {
      await adminWorkWithUsService.delete(id);
      setApplications((prev) => prev.filter((app) => app._id !== id));
      if (selectedApplication?._id === id) {
        setSelectedApplication(null);
      }
    } catch {
      alert('Error al eliminar la aplicación');
    }
  };

  const getStatusBadgeVariant = (
    status: ApplicationStatus
  ): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status) {
      case ApplicationStatusEnum.APPROVED:
        return 'success';
      case ApplicationStatusEnum.REVIEWING:
      case ApplicationStatusEnum.CONTACTED:
        return 'info';
      case ApplicationStatusEnum.PENDING:
        return 'warning';
      case ApplicationStatusEnum.REJECTED:
        return 'error';
      case ApplicationStatusEnum.ARCHIVED:
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: ApplicationStatus): string => {
    const labels: Record<ApplicationStatus, string> = {
      PENDING: 'Pendiente',
      REVIEWING: 'Revisando',
      APPROVED: 'Aprobado',
      REJECTED: 'Rechazado',
      CONTACTED: 'Contactado',
      ARCHIVED: 'Archivado',
    };
    return labels[status] || status;
  };

  const getExperienceLabel = (experience: Experience): string => {
    const labels: Record<Experience, string> = {
      LESS_THAN_ONE: '< 1 año',
      ONE_TO_THREE: '1-3 años',
      THREE_TO_FIVE: '3-5 años',
      FIVE_TO_TEN: '5-10 años',
      MORE_THAN_TEN: '> 10 años',
    };
    return labels[experience] || experience;
  };

  const getAvailabilityLabel = (availability: Availability): string => {
    const labels: Record<Availability, string> = {
      FULL_TIME: 'Tiempo Completo',
      PART_TIME: 'Medio Tiempo',
      WEEKENDS: 'Fines de Semana',
      CONTRACT: 'Contrato',
    };
    return labels[availability] || availability;
  };

  const getSpecialtyLabel = (specialty: Specialty): string => {
    const labels: Record<Specialty, string> = {
      OBRA_NEGRA: 'Obra Negra',
      OBRA_BLANCA: 'Obra Blanca',
      CARPINTERIA: 'Carpintería',
      ELECTRICIDAD: 'Electricidad',
      PLOMERIA: 'Plomería',
      ESTRUCTURAS_METALICAS: 'Estructuras Metálicas',
      OTRO: 'Otro',
    };
    return labels[specialty] || specialty;
  };

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setSearchText('');
    setFilterSpecialty('ALL');
    setFilterExperience('ALL');
    setFilterAvailability('ALL');
    setFilterLocation('');
  };

  // Función de filtrado inteligente
  const filteredApplications = applications.filter((app) => {
    // Filtro por texto de búsqueda (nombre, email)
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      const matchesName = app.fullName.toLowerCase().includes(searchLower);
      const matchesEmail = app.email.toLowerCase().includes(searchLower);
      if (!matchesName && !matchesEmail) return false;
    }

    // Filtro por especialidad
    if (filterSpecialty !== 'ALL') {
      const hasSpecialty = app.specialties.includes(filterSpecialty);
      if (!hasSpecialty) return false;
    }

    // Filtro por experiencia
    if (filterExperience !== 'ALL' && app.experienceLevel !== filterExperience) {
      return false;
    }

    // Filtro por disponibilidad
    if (filterAvailability !== 'ALL' && app.availability !== filterAvailability) {
      return false;
    }

    // Filtro por ubicación (departamento o municipio)
    if (filterLocation) {
      const locationLower = filterLocation.toLowerCase();
      const matchesDepartment = app.department.toLowerCase().includes(locationLower);
      const matchesMunicipality = app.municipality.toLowerCase().includes(locationLower);
      if (!matchesDepartment && !matchesMunicipality) return false;
    }

    return true;
  });

  const columns: TableColumn<WorkWithUs>[] = [
    {
      key: 'fullName',
      label: 'Nombre',
      width: '20%',
    },
    {
      key: 'email',
      label: 'Email',
      width: '20%',
    },
    {
      key: 'experienceLevel',
      label: 'Experiencia',
      width: '15%',
      render: (value: unknown) => getExperienceLabel(value as Experience),
    },
    {
      key: 'availability',
      label: 'Disponibilidad',
      width: '15%',
      render: (value: unknown) => getAvailabilityLabel(value as Availability),
    },
    {
      key: 'applicationScore',
      label: 'Puntuación',
      width: '10%',
      render: (value: unknown) => {
        const score = value as number;
        return score ? `${score}/100` : 'N/A';
      },
    },
    {
      key: 'status',
      label: 'Estado',
      width: '12%',
      render: (value: unknown) => {
        const status = value as ApplicationStatus;
        return <Badge variant={getStatusBadgeVariant(status)}>{getStatusLabel(status)}</Badge>;
      },
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      width: '8%',
      render: (value: unknown) => new Date(value as string).toLocaleDateString('es-ES'),
    },
  ];

  return (
    <div className="work-with-us-section">
      <div className="section-header">
        <h2>Aplicaciones de Empleo</h2>
        <button className="btn-refresh" onClick={loadApplications} disabled={loading}>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ marginRight: '8px' }}
          >
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          Actualizar
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Buscador Inteligente con Filtros */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>Filtros de Búsqueda</h3>
          <button className="btn-clear-filters" onClick={clearFilters}>
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{ marginRight: '6px' }}
            >
              <path d="M3 6h18M3 12h18M3 18h18"/>
            </svg>
            Limpiar Filtros
          </button>
        </div>

        <div className="filters-grid">
          {/* Búsqueda por texto */}
          <div className="filter-item">
            <label htmlFor="search-text">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              Buscar por Nombre/Email
            </label>
            <input
              id="search-text"
              type="text"
              placeholder="Escribe para buscar..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="filter-input"
            />
          </div>

          {/* Filtro por Especialidad */}
          <div className="filter-item">
            <label htmlFor="filter-specialty">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
              Especialidad
            </label>
            <select
              id="filter-specialty"
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value as Specialty | 'ALL')}
              className="filter-select"
            >
              <option value="ALL">Todas las Especialidades</option>
              <option value="OBRA_NEGRA">Obra Negra</option>
              <option value="OBRA_BLANCA">Obra Blanca</option>
              <option value="CARPINTERIA">Carpintería</option>
              <option value="ELECTRICIDAD">Electricidad</option>
              <option value="PLOMERIA">Plomería</option>
              <option value="ESTRUCTURAS_METALICAS">Estructuras Metálicas</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>

          {/* Filtro por Experiencia */}
          <div className="filter-item">
            <label htmlFor="filter-experience">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              Experiencia
            </label>
            <select
              id="filter-experience"
              value={filterExperience}
              onChange={(e) => setFilterExperience(e.target.value as Experience | 'ALL')}
              className="filter-select"
            >
              <option value="ALL">Todos los Niveles</option>
              <option value="LESS_THAN_ONE">&lt; 1 año</option>
              <option value="ONE_TO_THREE">1-3 años</option>
              <option value="THREE_TO_FIVE">3-5 años</option>
              <option value="FIVE_TO_TEN">5-10 años</option>
              <option value="MORE_THAN_TEN">&gt; 10 años</option>
            </select>
          </div>

          {/* Filtro por Disponibilidad */}
          <div className="filter-item">
            <label htmlFor="filter-availability">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Disponibilidad
            </label>
            <select
              id="filter-availability"
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value as Availability | 'ALL')}
              className="filter-select"
            >
              <option value="ALL">Todas las Disponibilidades</option>
              <option value="FULL_TIME">Tiempo Completo</option>
              <option value="PART_TIME">Medio Tiempo</option>
              <option value="WEEKENDS">Fines de Semana</option>
              <option value="CONTRACT">Contrato</option>
            </select>
          </div>

          {/* Filtro por Ubicación */}
          <div className="filter-item">
            <label htmlFor="filter-location">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Ubicación (Depto/Municipio)
            </label>
            <input
              id="filter-location"
              type="text"
              placeholder="Ej: Valle del Cauca, Cali..."
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="filter-input"
            />
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="filter-results">
          <span className="results-count">
            Mostrando {filteredApplications.length} de {applications.length} aplicaciones
          </span>
        </div>
      </div>

      <div className="content-layout">
        <Table
          columns={columns}
          data={filteredApplications}
          loading={loading}
          emptyMessage="No se encontraron aplicaciones con los filtros seleccionados"
          onRowClick={setSelectedApplication}
        />
      </div>

      {/* Modal para mostrar detalles */}
      <Modal
        isOpen={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
        title="Detalles de Aplicación"
        size="large"
      >
        {selectedApplication && (
          <div className="application-detail-modal">
            <div className="detail-section">
              <h4>Información Personal</h4>
              <div className="detail-grid">
                <div className="detail-field">
                  <label>Nombre Completo:</label>
                  <span>{selectedApplication.fullName}</span>
                </div>
                <div className="detail-field">
                  <label>Cédula:</label>
                  <span>{selectedApplication.identificationNumber}</span>
                </div>
                <div className="detail-field">
                  <label>Email:</label>
                  <span>{selectedApplication.email}</span>
                </div>
                <div className="detail-field">
                  <label>Teléfono:</label>
                  <span>{selectedApplication.contactNumber}</span>
                </div>
                <div className="detail-field">
                  <label>Fecha de Nacimiento:</label>
                  <span>{new Date(selectedApplication.birthDate).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="detail-field">
                  <label>Ubicación:</label>
                  <span>{selectedApplication.municipality}, {selectedApplication.department}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Información Profesional</h4>
              <div className="detail-grid">
                <div className="detail-field full-width">
                  <label>Especialidades:</label>
                  <div className="specialty-badges">
                    {selectedApplication.specialties.map((specialty) => (
                      <Badge key={specialty} variant="info" size="sm">
                        {getSpecialtyLabel(specialty)}
                      </Badge>
                    ))}
                  </div>
                </div>
                {selectedApplication.otherSpecialtyDetail && (
                  <div className="detail-field full-width">
                    <label>Otra Especialidad:</label>
                    <span>{selectedApplication.otherSpecialtyDetail}</span>
                  </div>
                )}
                <div className="detail-field">
                  <label>Experiencia:</label>
                  <span>{getExperienceLabel(selectedApplication.experienceLevel)}</span>
                </div>
                <div className="detail-field">
                  <label>Certificaciones:</label>
                  <span>{selectedApplication.hasCertifications ? 'Sí' : 'No'}</span>
                </div>
                <div className="detail-field">
                  <label>Disponibilidad:</label>
                  <span>{getAvailabilityLabel(selectedApplication.availability)}</span>
                </div>
                <div className="detail-field">
                  <label>Proyectos Completados:</label>
                  <span>{selectedApplication.completedProjectsRange}</span>
                </div>
                {selectedApplication.constructionExperienceDescription && (
                  <div className="detail-field full-width">
                    <label>Descripción de Experiencia:</label>
                    <p className="description-content">
                      {selectedApplication.constructionExperienceDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h4>Referencias</h4>
              <div className="references-list">
                {selectedApplication.references.map((ref, index) => (
                  <div key={index} className="reference-card">
                    <strong>{ref.name}</strong>
                    <span>{ref.phone}</span>
                    {ref.relationship && <em>{ref.relationship}</em>}
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h4>Estado de Aplicación</h4>
              <div className="detail-grid">
                <div className="detail-field">
                  <label>Puntuación:</label>
                  <span className="score">
                    {selectedApplication.applicationScore || 'N/A'}/100
                  </span>
                </div>
                <div className="detail-field">
                  <label>Estado:</label>
                  <select
                    value={selectedApplication.status}
                    onChange={(e) =>
                      handleStatusChange(selectedApplication._id, e.target.value as ApplicationStatus)
                    }
                    className="status-select"
                  >
                    <option value={ApplicationStatusEnum.PENDING}>Pendiente</option>
                    <option value={ApplicationStatusEnum.REVIEWING}>Revisando</option>
                    <option value={ApplicationStatusEnum.APPROVED}>Aprobado</option>
                    <option value={ApplicationStatusEnum.REJECTED}>Rechazado</option>
                    <option value={ApplicationStatusEnum.CONTACTED}>Contactado</option>
                    <option value={ApplicationStatusEnum.ARCHIVED}>Archivado</option>
                  </select>
                </div>
                <div className="detail-field">
                  <label>Fecha de Aplicación:</label>
                  <span>{new Date(selectedApplication.createdAt).toLocaleString('es-ES')}</span>
                </div>
                {selectedApplication.reviewedAt && (
                  <div className="detail-field">
                    <label>Fecha de Revisión:</label>
                    <span>{new Date(selectedApplication.reviewedAt).toLocaleString('es-ES')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-actions">
              <button className="btn-action btn-delete" onClick={() => handleDelete(selectedApplication._id)}>
                Eliminar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
