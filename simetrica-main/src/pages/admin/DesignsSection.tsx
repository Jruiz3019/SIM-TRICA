import { useState, useEffect } from 'react';
import Table from '../../components/admin/Table';
import Modal from '../../components/admin/Modal';
import ImagePickerModal from '../../components/admin/ImagePickerModal';
import type { TableColumn } from '../../components/admin/Table';
import type { Design, DesignFormData } from '../../types/design.types';
import adminDesignService from '../../services/adminDesignService';
import './DesignsSection.css';

export default function DesignsSection() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingDesign, setEditingDesign] = useState<Design | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<DesignFormData>({
    nombre: '',
    descripcion: '',
    imagenes: [],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminDesignService.getAll(1, 50);
      setDesigns(response.designs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar diseños');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este diseño?')) return;

    try {
      await adminDesignService.delete(id);
      setDesigns((prev) => prev.filter((d) => d._id !== id));
      if (selectedDesign?._id === id) {
        setSelectedDesign(null);
      }
    } catch {
      alert('Error al eliminar el diseño');
    }
  };

  const openCreateModal = () => {
    setEditingDesign(null);
    setFormData({
      nombre: '',
      descripcion: '',
      imagenes: [],
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const openEditModal = (design: Design) => {
    setEditingDesign(design);
    setFormData({
      nombre: design.nombre,
      descripcion: design.descripcion,
      imagenes: design.imagenes.map(img => img._id),
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length > 200) {
      errors.nombre = 'El nombre no puede exceder 200 caracteres';
    }

    if (!formData.descripcion.trim()) {
      errors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.length > 2000) {
      errors.descripcion = 'La descripción no puede exceder 2000 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingDesign) {
        const response = await adminDesignService.update(editingDesign._id, formData);
        setDesigns((prev) =>
          prev.map((d) => (d._id === response.design._id ? response.design : d))
        );
      } else {
        const response = await adminDesignService.create(formData);
        setDesigns((prev) => [response.design, ...prev]);
      }

      setShowFormModal(false);
      setFormData({
        nombre: '',
        descripcion: '',
        imagenes: [],
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar el diseño');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: TableColumn<Design>[] = [
    {
      key: 'nombre',
      label: 'Nombre',
      width: '30%',
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      width: '40%',
      render: (value: unknown) => {
        const desc = value as string;
        return desc.length > 100 ? `${desc.substring(0, 100)}...` : desc;
      },
    },
    {
      key: 'likes',
      label: 'Likes',
      width: '8%',
    },
    {
      key: 'dislikes',
      label: 'Dislikes',
      width: '8%',
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      width: '10%',
      render: (value: unknown) => new Date(value as string).toLocaleDateString('es-ES'),
    },
    {
      key: '_id',
      label: 'Acciones',
      width: '4%',
      render: (_value: unknown, row: Design) => (
        <button
          className="btn-action-edit"
          onClick={(e) => {
            e.stopPropagation();
            openEditModal(row);
          }}
          title="Editar"
        >
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
      ),
    },
  ];

  return (
    <div className="designs-section">
      <div className="section-header">
        <h2>Gestión de Diseños</h2>
        <div className="header-actions">
          <button className="btn-refresh" onClick={loadDesigns} disabled={loading}>
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{ marginRight: '8px' }}
            >
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            Actualizar
          </button>
          <button className="btn-create" onClick={openCreateModal}>
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{ marginRight: '8px' }}
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Crear Diseño
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="content-layout">
        <Table
          columns={columns}
          data={designs}
          loading={loading}
          emptyMessage="No hay diseños registrados"
          onRowClick={setSelectedDesign}
        />
      </div>

      {/* Modal de Detalles */}
      <Modal
        isOpen={!!selectedDesign}
        onClose={() => setSelectedDesign(null)}
        title="Detalles del Diseño"
        size="large"
      >
        {selectedDesign && (
          <div className="design-detail-modal">
            <div className="detail-grid">
              <div className="detail-field">
                <label>Nombre:</label>
                <span>{selectedDesign.nombre}</span>
              </div>

              <div className="detail-field">
                <label>Likes:</label>
                <span>{selectedDesign.likes}</span>
              </div>

              <div className="detail-field full-width">
                <label>Descripción:</label>
                <p className="description-content">{selectedDesign.descripcion}</p>
              </div>

              {selectedDesign.imagenes.length > 0 && (
                <div className="detail-field full-width">
                  <label>Imágenes ({selectedDesign.imagenes.length}):</label>
                  <div className="images-grid">
                    {selectedDesign.imagenes.map((img) => (
                      <img
                        key={img._id}
                        src={img.url}
                        alt={img.filename}
                        className="design-image-thumbnail"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="detail-field">
                <label>Creado por:</label>
                <span>{selectedDesign.createdBy.username}</span>
              </div>

              <div className="detail-field">
                <label>Fecha de creación:</label>
                <span>{new Date(selectedDesign.createdAt).toLocaleString('es-ES')}</span>
              </div>
            </div>

            <div className="detail-actions">
              <button
                className="btn-action btn-edit"
                onClick={() => {
                  setSelectedDesign(null);
                  openEditModal(selectedDesign);
                }}
              >
                Editar
              </button>
              <button
                className="btn-action btn-delete"
                onClick={() => {
                  handleDelete(selectedDesign._id);
                  setSelectedDesign(null);
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Formulario (Crear/Editar) */}
      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={editingDesign ? 'Editar Diseño' : 'Crear Diseño'}
        size="medium"
      >
        <form onSubmit={handleSubmit} className="design-form">
          <div className="form-grid">
            <div className="form-field full-width">
              <label htmlFor="nombre">
                Nombre del Diseño <span className="required">*</span>
              </label>
              <input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className={formErrors.nombre ? 'error' : ''}
                maxLength={200}
              />
              {formErrors.nombre && <span className="error-message">{formErrors.nombre}</span>}
            </div>

            <div className="form-field full-width">
              <label htmlFor="descripcion">
                Descripción <span className="required">*</span>
              </label>
              <textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className={formErrors.descripcion ? 'error' : ''}
                maxLength={2000}
                rows={6}
              />
              {formErrors.descripcion && <span className="error-message">{formErrors.descripcion}</span>}
              <span className="char-count">{formData.descripcion.length}/2000</span>
            </div>

            <div className="form-field full-width">
              <label>Imágenes</label>
              <button
                type="button"
                className="btn-select-images"
                onClick={() => setShowImagePicker(true)}
              >
                ⎘ Seleccionar Imágenes ({formData.imagenes?.length || 0})
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setShowFormModal(false)}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : editingDesign ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para Seleccionar Imágenes */}
      <ImagePickerModal
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={(images) => setFormData({ ...formData, imagenes: images })}
        selectedImages={formData.imagenes}
        multiple={true}
      />
    </div>
  );
}
