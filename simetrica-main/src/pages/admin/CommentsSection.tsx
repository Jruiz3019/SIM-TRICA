import React, { useState, useEffect, useCallback } from 'react';
import adminCommentService, { type Comment } from '../../services/adminCommentService';
import adminProjectService from '../../services/adminProjectService';
import adminDesignService from '../../services/adminDesignService';
import './CommentsSectionStyle.css';

const CommentsSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'Project' | 'Design'>('all');
  const [selectedPublication, setSelectedPublication] = useState<string>('all');
  const [publications, setPublications] = useState<Array<{id: string; name: string; type: 'Project' | 'Design'}>>([]);

  const loadPublications = useCallback(async () => {
    try {
      const [projectsRes, designsRes] = await Promise.all([
        adminProjectService.getAll(1, 100),
        adminDesignService.getAll(1, 100),
      ]);

      const allPublications = [
        ...projectsRes.projects.map(p => ({ id: p._id, name: p.nombre, type: 'Project' as const })),
        ...designsRes.designs.map(d => ({ id: d._id, name: d.nombre, type: 'Design' as const })),
      ];

      setPublications(allPublications);
    } catch (err) {
      console.error('Error loading publications:', err);
    }
  }, []);

  const loadComments = useCallback(async () => {
    if (selectedPublication === 'all') {
      // Si no hay publicación seleccionada, no cargar comentarios
      setComments([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const publication = publications.find(p => p.id === selectedPublication);
      if (!publication) return;

      const response = publication.type === 'Project'
        ? await adminCommentService.getProjectComments(selectedPublication)
        : await adminCommentService.getDesignComments(selectedPublication);

      setComments(response.comments);
    } catch (err) {
      console.error('Error loading comments:', err);
      setError('Error al cargar los comentarios');
    } finally {
      setLoading(false);
    }
  }, [selectedPublication, publications]);

  useEffect(() => {
    loadPublications();
  }, [loadPublications]);

  useEffect(() => {
    if (selectedPublication !== 'all') {
      loadComments();
    }
  }, [selectedPublication, loadComments]);

  const handleDelete = async (commentId: string) => {
    if (!confirm('¿Estás seguro de eliminar este comentario?')) return;

    try {
      await adminCommentService.delete(commentId);
      loadComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Error al eliminar el comentario');
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredPublications = filter === 'all' 
    ? publications 
    : publications.filter(p => p.type === filter);

  const filteredComments = comments;

  return (
    <div className="comments-section">
      <div className="section-header">
        <h2>Gestión de Comentarios</h2>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label>Tipo de Publicación:</label>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as 'all' | 'Project' | 'Design');
              setSelectedPublication('all');
            }}
          >
            <option value="all">Todos</option>
            <option value="Project">Proyectos</option>
            <option value="Design">Diseños</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Publicación:</label>
          <select
            value={selectedPublication}
            onChange={(e) => setSelectedPublication(e.target.value)}
          >
            <option value="all">Seleccionar...</option>
            {filteredPublications.map(pub => (
              <option key={pub.id} value={pub.id}>
                {pub.name} ({pub.type === 'Project' ? 'Proyecto' : 'Diseño'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {selectedPublication === 'all' ? (
        <div className="empty-state">
          <p>Selecciona una publicación para ver sus comentarios</p>
        </div>
      ) : loading ? (
        <div className="loading">Cargando comentarios...</div>
      ) : (
        <>
          <div className="comments-list">
            {filteredComments.map((comment) => (
              <div key={comment._id} className="comment-card">
                <div className="comment-header">
                  <div className="comment-author">
                    <span className="author-name">{comment.autor.username}</span>
                    <span className="author-email">{comment.autor.email}</span>
                  </div>
                  <div className="comment-date">
                    {formatDate(comment.createdAt)}
                  </div>
                </div>

                <div className="comment-content">
                  <p>{comment.contenido}</p>
                </div>

                <div className="comment-footer">
                  <div className="comment-stats">
                    <span className="stat-likes">↑ {comment.likes}</span>
                    <span className="stat-dislikes">↓ {comment.dislikes}</span>
                  </div>

                  <div className="comment-actions">
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(comment._id)}
                      title="Eliminar comentario"
                    >
                      ✕ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredComments.length === 0 && !loading && (
            <div className="empty-state">
              <p>No hay comentarios para esta publicación</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentsSection;
