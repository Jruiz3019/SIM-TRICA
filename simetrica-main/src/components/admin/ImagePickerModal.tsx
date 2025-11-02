import React, { useState, useEffect, useCallback } from 'react';
import adminImageService, { type Image } from '../../services/adminImageService';
import './ImagePickerModalStyle.css';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (images: string[]) => void;
  selectedImages?: string[];
  multiple?: boolean;
}

const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedImages = [],
  multiple = true,
}) => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<string[]>(selectedImages);

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await adminImageService.getAll(page, 20);
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
    if (isOpen) {
      loadImages();
      setSelected(selectedImages);
    }
  }, [isOpen, loadImages, selectedImages]);

  const handleToggleSelect = (imageId: string) => {
    if (multiple) {
      setSelected((prev) =>
        prev.includes(imageId)
          ? prev.filter((id) => id !== imageId)
          : [...prev, imageId]
      );
    } else {
      setSelected([imageId]);
    }
  };

  const handleConfirm = () => {
    onSelect(selected);
    onClose();
  };

  const handleClose = () => {
    setSelected(selectedImages);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="image-picker-overlay" onClick={handleClose}>
      <div className="image-picker-content" onClick={(e) => e.stopPropagation()}>
        <div className="image-picker-header">
          <h2>Seleccionar Imágenes</h2>
          <button className="close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="image-picker-info">
          <p>
            {multiple
              ? `${selected.length} imagen(es) seleccionada(s)`
              : selected.length > 0
              ? '1 imagen seleccionada'
              : 'Selecciona una imagen'}
          </p>
        </div>

        {loading ? (
          <div className="loading">Cargando imágenes...</div>
        ) : (
          <>
            <div className="picker-images-grid">
              {images.map((image) => {
                const isSelected = selected.includes(image._id);
                return (
                  <div
                    key={image._id}
                    className={`picker-image-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleToggleSelect(image._id)}
                  >
                    <div className="picker-image-wrapper">
                      <img
                        src={image.url}
                        alt={image.altText || image.filename}
                        className="picker-image-thumbnail"
                      />
                      {isSelected && (
                        <div className="selected-indicator">
                          <span className="checkmark">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="picker-image-name">{image.filename}</p>
                  </div>
                );
              })}
            </div>

            {images.length === 0 && (
              <div className="empty-state">
                <p>No hay imágenes disponibles. Sube imágenes primero.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="picker-pagination">
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

        <div className="picker-actions">
          <button className="btn-cancel" onClick={handleClose}>
            Cancelar
          </button>
          <button
            className="btn-confirm"
            onClick={handleConfirm}
            disabled={selected.length === 0}
          >
            Confirmar Selección
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePickerModal;
