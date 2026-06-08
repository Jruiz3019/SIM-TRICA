import { useState, useEffect } from 'react';
import Table from '../../components/admin/Table';
import Badge from '../../components/admin/Badge';
import Modal from '../../components/admin/Modal';
import type { TableColumn } from '../../components/admin/Table';
import type { Provider, ProviderStatus, ProviderCategory } from '../../types/provider.types';
import { ProviderStatusEnum, ProviderCategoryEnum } from '../../types/provider.types';
import adminProviderService from '../../services/adminProviderService';
import './ProvidersSection.css';

export default function ProvidersSection() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<ProviderStatus | 'ALL'>('ALL');
  const [filterCategory, setFilterCategory] = useState<ProviderCategory | 'ALL'>('ALL');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    loadProviders();
  }, [currentPage, filterStatus, filterCategory]);

  const loadProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await adminProviderService.getAll(
        currentPage,
        20,
        filterStatus,
        filterCategory,
        searchText || undefined
      );
      setProviders(result.data);
      setTotalItems(result.total);
    } catch {
      setError('Error al cargar proveedores');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadProviders();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setSearchText('');
    setFilterStatus('ALL');
    setFilterCategory('ALL');
    setCurrentPage(1);
  };

  const handleApprove = async (id: string) => {
    try {
      await adminProviderService.update(id, { status: ProviderStatusEnum.APPROVED });
      setProviders((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: ProviderStatusEnum.APPROVED } : p))
      );
      if (selectedProvider?._id === id) {
        setSelectedProvider((prev) => prev ? { ...prev, status: ProviderStatusEnum.APPROVED } : null);
      }
    } catch {
      alert('Error al aprobar proveedor');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminProviderService.update(id, { status: ProviderStatusEnum.REJECTED });
      setProviders((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: ProviderStatusEnum.REJECTED } : p))
      );
      if (selectedProvider?._id === id) {
        setSelectedProvider((prev) => prev ? { ...prev, status: ProviderStatusEnum.REJECTED } : null);
      }
    } catch {
      alert('Error al rechazar proveedor');
    }
  };

  const handleStatusChange = async (id: string, newStatus: ProviderStatus) => {
    try {
      await adminProviderService.update(id, { status: newStatus });
      setProviders((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
      );
      if (selectedProvider?._id === id) {
        setSelectedProvider((prev) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch {
      alert('Error al actualizar el estado');
    }
  };

  const handleRatingChange = async (id: string, rating: number) => {
    try {
      await adminProviderService.update(id, { rating });
      setProviders((prev) =>
        prev.map((p) => (p._id === id ? { ...p, rating } : p))
      );
      if (selectedProvider?._id === id) {
        setSelectedProvider((prev) => prev ? { ...prev, rating } : null);
      }
    } catch {
      alert('Error al actualizar calificación');
    }
  };

  const handleVerificadoToggle = async (id: string, verificado: boolean) => {
    try {
      await adminProviderService.update(id, { verificado });
      setProviders((prev) =>
        prev.map((p) => (p._id === id ? { ...p, verificado } : p))
      );
      if (selectedProvider?._id === id) {
        setSelectedProvider((prev) => prev ? { ...prev, verificado } : null);
      }
    } catch {
      alert('Error al actualizar verificación');
    }
  };

  const handleSaveDetail = async () => {
    if (!selectedProvider) return;
    try {
      const updated = await adminProviderService.update(selectedProvider._id, {
        fundacion: selectedProvider.fundacion,
        proyectos: selectedProvider.proyectos,
        reviewNotes: selectedProvider.reviewNotes,
      });
      setProviders((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
      setSelectedProvider(updated);
      setSaveMessage('Cambios guardados correctamente');
      setTimeout(() => setSaveMessage(null), 2500);
    } catch {
      alert('Error al guardar cambios');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este proveedor?')) return;

    try {
      await adminProviderService.delete(id);
      setProviders((prev) => prev.filter((p) => p._id !== id));
      if (selectedProvider?._id === id) {
        setSelectedProvider(null);
      }
    } catch {
      alert('Error al eliminar el proveedor');
    }
  };

  const getStatusBadgeVariant = (status: ProviderStatus): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status) {
      case ProviderStatusEnum.ACTIVE:
      case ProviderStatusEnum.APPROVED:
        return 'success';
      case ProviderStatusEnum.PENDING:
        return 'warning';
      case ProviderStatusEnum.REJECTED:
        return 'error';
      case ProviderStatusEnum.INACTIVE:
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: ProviderStatus): string => {
    const labels: Record<ProviderStatus, string> = {
      PENDING: 'Pendiente',
      APPROVED: 'Aprobado',
      ACTIVE: 'Activo',
      INACTIVE: 'Inactivo',
      REJECTED: 'Rechazado',
    };
    return labels[status] || status;
  };

  const getCategoryLabel = (category: ProviderCategory): string => {
    const labels: Record<ProviderCategory, string> = {
      CARPINTERIA: 'Carpintería y Madera',
      MATERIALES_ACUSTICOS: 'Materiales Acústicos',
      ESTRUCTURAS_METALICAS: 'Estructuras Metálicas',
      ELECTRICIDAD: 'Electricidad',
      ACABADOS: 'Acabados y Terminaciones',
      OTRO: 'Otra',
    };
    return labels[category] || category;
  };

  const renderStars = (rating: number, editable: boolean = false) => {
    return (
      <div className="rating-display">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className="rating-star-btn"
            type="button"
            disabled={!editable}
            onClick={() => editable && selectedProvider && handleRatingChange(selectedProvider._id, n)}
            title={editable ? `${n} estrella(s)` : undefined}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={n <= rating ? 'var(--primary-color)' : 'none'}
              stroke="var(--primary-color)"
              strokeWidth="1.5"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        ))}
        <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>{rating}.0</span>
      </div>
    );
  };

  const columns: TableColumn<Provider>[] = [
    {
      key: 'nombre',
      label: 'Empresa',
      width: '16%',
    },
    {
      key: 'contacto',
      label: 'Contacto',
      width: '12%',
    },
    {
      key: 'email',
      label: 'Email',
      width: '16%',
    },
    {
      key: 'categoria',
      label: 'Categoría',
      width: '12%',
      render: (value: unknown) => getCategoryLabel(value as ProviderCategory),
    },
    {
      key: 'ciudad',
      label: 'Ciudad',
      width: '10%',
    },
    {
      key: 'rating',
      label: 'Rating',
      width: '10%',
      render: (value: unknown) => renderStars(value as number),
    },
    {
      key: 'status',
      label: 'Estado',
      width: '10%',
      render: (value: unknown) => {
        const status = value as ProviderStatus;
        return <Badge variant={getStatusBadgeVariant(status)}>{getStatusLabel(status)}</Badge>;
      },
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      width: '14%',
      render: (value: unknown) => new Date(value as string).toLocaleDateString('es-ES'),
    },
  ];

  return (
    <div className="providers-section">
      <div className="section-header">
        <h2>Red de Proveedores</h2>
        <button className="btn-refresh" onClick={loadProviders} disabled={loading}>
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

      <div className="filters-section">
        <div className="filters-header">
          <h3>Filtros de Búsqueda</h3>
          <button className="btn-clear-filters" onClick={clearFilters}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
            Limpiar Filtros
          </button>
        </div>

        <div className="filters-grid">
          <div className="filter-item">
            <label htmlFor="search-text">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Buscar por Nombre/Email
            </label>
            <input
              id="search-text"
              type="text"
              placeholder="Escribe para buscar..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="filter-input"
            />
          </div>

          <div className="filter-item">
            <label htmlFor="filter-status">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Estado
            </label>
            <select
              id="filter-status"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as ProviderStatus | 'ALL');
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="ALL">Todos los Estados</option>
              <option value={ProviderStatusEnum.PENDING}>Pendiente</option>
              <option value={ProviderStatusEnum.APPROVED}>Aprobado</option>
              <option value={ProviderStatusEnum.ACTIVE}>Activo</option>
              <option value={ProviderStatusEnum.INACTIVE}>Inactivo</option>
              <option value={ProviderStatusEnum.REJECTED}>Rechazado</option>
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="filter-category">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Categoría
            </label>
            <select
              id="filter-category"
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value as ProviderCategory | 'ALL');
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="ALL">Todas las Categorías</option>
              <option value={ProviderCategoryEnum.CARPINTERIA}>Carpintería y Madera</option>
              <option value={ProviderCategoryEnum.MATERIALES_ACUSTICOS}>Materiales Acústicos</option>
              <option value={ProviderCategoryEnum.ESTRUCTURAS_METALICAS}>Estructuras Metálicas</option>
              <option value={ProviderCategoryEnum.ELECTRICIDAD}>Electricidad</option>
              <option value={ProviderCategoryEnum.ACABADOS}>Acabados y Terminaciones</option>
              <option value={ProviderCategoryEnum.OTRO}>Otra</option>
            </select>
          </div>
        </div>

        <div className="filter-results">
          <span className="results-count">
            Mostrando {providers.length} de {totalItems} proveedores
          </span>
        </div>
      </div>

      <div className="content-layout">
        <Table
          columns={columns}
          data={providers}
          loading={loading}
          emptyMessage="No se encontraron proveedores con los filtros seleccionados"
          onRowClick={setSelectedProvider}
        />
      </div>

      <Modal
        isOpen={!!selectedProvider}
        onClose={() => { setSelectedProvider(null); setSaveMessage(null); }}
        title="Detalles de Proveedor"
        size="large"
      >
        {selectedProvider && (
          <div className="provider-detail-modal">
            {saveMessage && (
              <div style={{
                padding: '12px',
                background: 'rgba(46, 213, 115, 0.2)',
                border: '1px solid rgba(46, 213, 115, 0.4)',
                borderRadius: '8px',
                color: '#2ed573',
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
                {saveMessage}
              </div>
            )}

            <div className="detail-section">
              <h4>Información de la Empresa</h4>
              <div className="detail-grid">
                <div className="detail-field">
                  <label>Nombre de la Empresa:</label>
                  <span>{selectedProvider.nombre}</span>
                </div>
                <div className="detail-field">
                  <label>Contacto:</label>
                  <span>{selectedProvider.contacto}</span>
                </div>
                <div className="detail-field">
                  <label>Email:</label>
                  <span>{selectedProvider.email}</span>
                </div>
                <div className="detail-field">
                  <label>Teléfono:</label>
                  <span>{selectedProvider.telefono}</span>
                </div>
                <div className="detail-field">
                  <label>Categoría:</label>
                  <span>{getCategoryLabel(selectedProvider.categoria)}</span>
                </div>
                <div className="detail-field">
                  <label>Ciudad:</label>
                  <span>{selectedProvider.ciudad}</span>
                </div>
                <div className="detail-field full-width">
                  <label>Descripción:</label>
                  <p className="description-content">{selectedProvider.descripcion}</p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Gestión Administrativa</h4>
              <div className="detail-grid">
                <div className="detail-field">
                  <label>Estado:</label>
                  <select
                    value={selectedProvider.status}
                    onChange={(e) => handleStatusChange(selectedProvider._id, e.target.value as ProviderStatus)}
                    className="status-select"
                  >
                    <option value={ProviderStatusEnum.PENDING}>Pendiente</option>
                    <option value={ProviderStatusEnum.APPROVED}>Aprobado</option>
                    <option value={ProviderStatusEnum.ACTIVE}>Activo</option>
                    <option value={ProviderStatusEnum.INACTIVE}>Inactivo</option>
                    <option value={ProviderStatusEnum.REJECTED}>Rechazado</option>
                  </select>
                </div>
                <div className="detail-field">
                  <label>Calificación:</label>
                  {renderStars(selectedProvider.rating, true)}
                </div>
                <div className="detail-field">
                  <label>Verificado:</label>
                  <div className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={selectedProvider.verificado}
                      onChange={(e) => handleVerificadoToggle(selectedProvider._id, e.target.checked)}
                      id="verificado-check"
                    />
                    <label htmlFor="verificado-check">Proveedor verificado</label>
                  </div>
                </div>
                <div className="detail-field">
                  <label>Año de Fundación:</label>
                  <input
                    type="text"
                    className="inline-input"
                    placeholder="Ej: 2015"
                    value={selectedProvider.fundacion || ''}
                    onChange={(e) =>
                      setSelectedProvider((prev) => prev ? { ...prev, fundacion: e.target.value } : null)
                    }
                  />
                </div>
                <div className="detail-field">
                  <label>Proyectos:</label>
                  <input
                    type="number"
                    className="inline-input"
                    min="0"
                    value={selectedProvider.proyectos}
                    onChange={(e) =>
                      setSelectedProvider((prev) =>
                        prev ? { ...prev, proyectos: parseInt(e.target.value) || 0 } : null
                      )
                    }
                  />
                </div>
                <div className="detail-field full-width">
                  <label>Notas:</label>
                  <textarea
                    className="inline-input"
                    rows={2}
                    placeholder="Notas de revisión..."
                    value={selectedProvider.reviewNotes || ''}
                    onChange={(e) =>
                      setSelectedProvider((prev) =>
                        prev ? { ...prev, reviewNotes: e.target.value } : null
                      )
                    }
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <div className="detail-field">
                  <label>Fecha de Registro:</label>
                  <span>{new Date(selectedProvider.createdAt).toLocaleString('es-ES')}</span>
                </div>
                {selectedProvider.reviewedAt && (
                  <div className="detail-field">
                    <label>Revisado:</label>
                    <span>{new Date(selectedProvider.reviewedAt).toLocaleString('es-ES')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-actions">
              {selectedProvider.status === ProviderStatusEnum.PENDING && (
                <>
                  <button className="btn-action btn-approve" onClick={() => handleApprove(selectedProvider._id)}>
                    Aprobar Proveedor
                  </button>
                  <button className="btn-action btn-reject" onClick={() => handleReject(selectedProvider._id)}>
                    Rechazar
                  </button>
                </>
              )}
              <button className="btn-action" onClick={handleSaveDetail}
                style={{
                  background: 'rgba(126, 74, 53, 0.2)',
                  border: '1px solid var(--primary-color)',
                  color: 'var(--text-color)',
                }}
              >
                Guardar Cambios
              </button>
              <button className="btn-action btn-delete" onClick={() => handleDelete(selectedProvider._id)}>
                Eliminar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
