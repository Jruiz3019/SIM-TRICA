import React, { useState, useEffect, useCallback } from 'react';
import adminImageService, { type Image } from '../../services/adminImageService';
import ImageUploadModal from '../../components/admin/ImageUploadModal';
import './ImagesSectionStyle.css';

const ImagesSection: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [editAltText, setEditAltText] = useState('');

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await adminImageService.getAll(page, 12);
      setImages(response.images);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Error loading images:', err);
      setError('Error al cargar las imágenes');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const handleUploadSuccess = () => {
    loadImages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;

    try {
      await adminImageService.delete(id);
      loadImages();
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Error al eliminar la imagen');
    }
  };

  const handleEdit = (image: Image) => {
    setSelectedImage(image);
    setEditDescription(image.description || '');
    setEditAltText(image.altText || '');
    setEditMode(true);
  };

  const handleUpdateMetadata = async () => {
    if (!selectedImage) return;

    try {
      await adminImageService.update(selectedImage._id, {
        description: editDescription.trim() || undefined,
        altText: editAltText.trim() || undefined,
      });

      setEditMode(false);
      setSelectedImage(null);
      loadImages();
    } catch (err) {
      console.error('Error updating image:', err);
      alert('Error al actualizar la imagen');
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copiada al portapapeles');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="images-section">
      <div className="section-header">
        <h2>Gestión de Imágenes</h2>
        <button
          className="btn-upload"
          onClick={() => setShowUploadModal(true)}
        >
          + Subir Imagen
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Cargando imágenes...</div>
      ) : (
        <>
          <div className="images-grid">
            {images.map((image) => (
              <div key={image._id} className="image-card">
                <div className="image-wrapper">
                  <img
                    src={image.url}
                    alt={image.altText || image.filename}
                    className="image-thumbnail"
                  />
                </div>

                <div className="image-info">
                  <h3 className="image-filename">{image.filename}</h3>
                  
                  <div className="image-metadata">
                    <p className="image-size">{formatFileSize(image.size)}</p>
                    <p className="image-date">{formatDate(image.createdAt)}</p>
                  </div>

                  {image.description && (
                    <p className="image-description">{image.description}</p>
                  )}

                  <p className="image-uploader">
                    Por: {image.uploadedBy.username}
                  </p>
                </div>

                <div className="image-actions">
                  <button
                    className="btn-action btn-copy"
                    onClick={() => handleCopyUrl(image.url)}
                    title="Copiar URL"
                  >
                    ⎘
                  </button>
                  <button
                    className="btn-action btn-edit"
                    onClick={() => handleEdit(image)}
                    title="Editar metadata"
                  >
                    ✎
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => handleDelete(image._id)}
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {images.length === 0 && !loading && (
            <div className="empty-state">
              <p>No hay imágenes. Sube la primera imagen.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-page"
              >
                ← Anterior
              </button>
              
              <span className="page-info">
                Página {page} de {totalPages}
              </span>
              
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-page"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}

      <ImageUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
      />

      {editMode && selectedImage && (
        <div className="modal-overlay" onClick={() => setEditMode(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Metadata</h2>
              <button
                className="close-btn"
                onClick={() => setEditMode(false)}
              >
                ×
              </button>
            </div>

            <div className="edit-form">
              <div className="edit-preview">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.filename}
                  className="edit-image"
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Describe esta imagen..."
                  maxLength={500}
                  rows={3}
                />
                <span className="char-count">{editDescription.length}/500</span>
              </div>

              <div className="form-group">
                <label>Texto Alternativo</label>
                <input
                  type="text"
                  value={editAltText}
                  onChange={(e) => setEditAltText(e.target.value)}
                  placeholder="Texto descriptivo para accesibilidad"
                  maxLength={200}
                />
                <span className="char-count">{editAltText.length}/200</span>
              </div>

              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setEditMode(false)}
                >
                  Cancelar
                </button>
                <button
                  className="btn-submit"
                  onClick={handleUpdateMetadata}
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagesSection;
