import React, { useState } from 'react';
import adminImageService from '../../services/adminImageService';
import './ImageUploadModalStyle.css';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [preview, setPreview] = useState<string>('');
  const [description, setDescription] = useState('');
  const [altText, setAltText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB (base64 aumenta ~33%)
  const ALLOWED_TYPES = ['image/png', 'image/svg+xml', 'image/jpeg', 'image/jpg', 'image/webp'];

  // Convertir URL de Google Drive a formato directo
  const convertGoogleDriveUrl = (url: string): string => {
    // Formatos de Google Drive:
    // https://drive.google.com/file/d/FILE_ID/view
    // https://drive.google.com/open?id=FILE_ID
    // https://drive.google.com/uc?id=FILE_ID
    
    const patterns = [
      /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
      /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
      /drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }

    return url;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validar tipo
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError('Solo se permiten archivos PNG, JPG, WEBP y SVG');
      return;
    }

    // Validar tamaño
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('El archivo excede el tamaño máximo de 10MB');
      return;
    }

    setError('');
    setFile(selectedFile);
    setUploadMode('file');

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUrlChange = (url: string) => {
    setUrlInput(url);
    if (url.trim()) {
      const lowerUrl = url.toLowerCase();
      
      // Verificar si es Google Drive
      const isGoogleDrive = lowerUrl.includes('drive.google.com');
      
      // Verificar si es una URL directa de imagen
      const isDirectImageUrl = lowerUrl.endsWith('.png') || 
                               lowerUrl.endsWith('.svg') || 
                               lowerUrl.endsWith('.jpg') || 
                               lowerUrl.endsWith('.jpeg') || 
                               lowerUrl.endsWith('.webp');
      
      // Aceptar Google Drive o URLs directas de imagen
      if (!isGoogleDrive && !isDirectImageUrl) {
        setError('La URL debe terminar en .png, .svg, .jpg o ser un enlace de Google Drive');
        return;
      }
      
      setError('');
      setFile(null);
      setUploadMode('url');
      
      // Convertir URL de Google Drive si es necesario
      const finalUrl = isGoogleDrive ? convertGoogleDriveUrl(url) : url;
      setPreview(finalUrl);
    } else {
      setPreview('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file && !urlInput.trim()) {
      setError('Selecciona un archivo o ingresa una URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let source: string | File;
      let filename: string | undefined;
      
      if (uploadMode === 'url') {
        // Convertir URL de Google Drive si es necesario
        const finalUrl = urlInput.toLowerCase().includes('drive.google.com') 
          ? convertGoogleDriveUrl(urlInput)
          : urlInput;
        source = finalUrl;
        
        // Generar nombre de archivo apropiado
        if (urlInput.toLowerCase().includes('drive.google.com')) {
          const fileId = finalUrl.match(/id=([a-zA-Z0-9_-]+)/)?.[1];
          filename = fileId ? `google-drive-${fileId}.jpg` : 'google-drive-image.jpg';
        } else {
          filename = urlInput.split('/').pop()?.split('?')[0];
        }
      } else {
        source = file!;
        filename = undefined;
      }
      
      await adminImageService.upload(source, {
        description: description.trim() || undefined,
        altText: altText.trim() || undefined,
        filename,
      });

      // Limpiar formulario
      setFile(null);
      setUrlInput('');
      setPreview('');
      setDescription('');
      setAltText('');
      setUploadMode('file');
      
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error('Error uploading image:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al subir la imagen';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFile(null);
      setUrlInput('');
      setPreview('');
      setDescription('');
      setAltText('');
      setError('');
      setUploadMode('file');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Subir Imagen</h2>
          <button className="close-btn" onClick={handleClose} disabled={loading}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          {error && <div className="error-message">{error}</div>}

          <div className="upload-mode-selector">
            <button
              type="button"
              className={`mode-btn ${uploadMode === 'file' ? 'active' : ''}`}
              onClick={() => {
                setUploadMode('file');
                setUrlInput('');
                setPreview('');
              }}
            >
              ↑ Subir Archivo
            </button>
            <button
              type="button"
              className={`mode-btn ${uploadMode === 'url' ? 'active' : ''}`}
              onClick={() => {
                setUploadMode('url');
                setFile(null);
                setPreview('');
              }}
            >
              ⎘ URL Externa
            </button>
          </div>

          {uploadMode === 'url' ? (
            <div className="form-group">
              <label htmlFor="url-input">URL de la imagen</label>
              <input
                id="url-input"
                type="url"
                value={urlInput}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://ejemplo.com/imagen.png"
                disabled={loading}
                className="url-input"
              />
              <p className="upload-hint">
                Soporta: Google Drive, Imgur, enlaces directos (.png, .svg, .jpg)
              </p>
              {preview && (
                <div className="url-preview">
                  <img src={preview} alt="Preview" onError={() => setError('No se pudo cargar la imagen desde la URL')} />
                </div>
              )}
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="file-input" className="file-input-label">
                {preview ? (
                  <img src={preview} alt="Preview" className="image-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <span className="upload-icon">+</span>
                    <p>Click para seleccionar imagen</p>
                    <p className="upload-hint">
                      Formatos: PNG, JPG, WEBP, SVG<br />
                      Tamaño máximo: 10MB
                    </p>
                  </div>
                )}
              </label>
              <input
                id="file-input"
                type="file"
                accept=".png,.svg,.jpg,.jpeg,.webp,image/png,image/svg+xml,image/jpeg,image/webp"
                onChange={handleFileChange}
                disabled={loading}
                style={{ display: 'none' }}
              />
            </div>
          )}

          {(file || (uploadMode === 'url' && urlInput && !error)) && (
            <>
              {file && (
                <div className="file-info">
                  <p><strong>Archivo:</strong> {file.name}</p>
                  <p><strong>Tamaño:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p><strong>Tipo:</strong> {file.type}</p>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="description">Descripción (opcional)</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe esta imagen..."
                  maxLength={500}
                  rows={3}
                  disabled={loading}
                />
                <span className="char-count">{description.length}/500</span>
              </div>

              <div className="form-group">
                <label htmlFor="altText">Texto alternativo (opcional)</label>
                <input
                  id="altText"
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Texto descriptivo para accesibilidad"
                  maxLength={200}
                  disabled={loading}
                />
                <span className="char-count">{altText.length}/200</span>
              </div>
            </>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={(!file && !urlInput.trim()) || loading}
            >
              {loading ? 'Subiendo...' : 'Subir Imagen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageUploadModal;
