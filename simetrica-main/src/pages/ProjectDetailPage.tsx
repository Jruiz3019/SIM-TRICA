import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import HeaderLayout from "../layouts/HeaderLayout";
import Footer from "../layouts/Footer";
import "./styles/ProjectDetailPageStyle.css";
import LogoSimetrica from "../assets/logo-simetrica-blanco.png";
import PlaceholderImage from "../assets/project1.png";
import projectService, { type Project } from '../services/projectService';
import commentService, { type Comment } from '../services/commentService';
import { useAuth } from '../context/useAuth';

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const loadProject = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await projectService.getById(id);
      setProject(response.data);
      setError('');
      
      // Cargar comentarios
      const commentsData = await commentService.getProjectComments(id);
      setComments(commentsData.comments);
    } catch (err) {
      console.error('Error cargando proyecto:', err);
      setError('Error al cargar el proyecto');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  useEffect(() => {
    if (project && user) {
      const reaction = project.reactions.find(r => r.userId === user.id);
      setUserReaction(reaction?.type || null);
    }
  }, [project, user]);

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!user) {
      alert('Debes iniciar sesión para reaccionar');
      navigate('/login');
      return;
    }

    if (!id) return;

    try {
      const response = await projectService.react(id, type);
      setProject(response.data);
      
      const reaction = response.data.reactions.find(r => r.userId === user.id);
      setUserReaction(reaction?.type || null);
    } catch (err) {
      console.error('Error al reaccionar:', err);
      alert('Error al procesar la reacción');
    }
  };

  const handleOpenModal = () => {
    if (!user) {
      alert('Debes iniciar sesión para comentar');
      navigate('/login');
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCommentText('');
  };

  const handleSubmitComment = async () => {
    if (!user || !id || !commentText.trim()) return;

    try {
      setSubmittingComment(true);
      await commentService.createProjectComment(id, commentText.trim());
      
      const commentsData = await commentService.getProjectComments(id);
      setComments(commentsData.comments);
      
      setCommentText('');
      setIsModalOpen(false);
      alert('Comentario agregado exitosamente');
    } catch (err) {
      console.error('Error al agregar comentario:', err);
      alert('Error al agregar el comentario');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCommentReaction = async (commentId: string, type: 'like' | 'dislike') => {
    if (!user) {
      alert('Debes iniciar sesión para reaccionar');
      navigate('/login');
      return;
    }

    try {
      await commentService.reactToComment(commentId, type);
      
      if (id) {
        const commentsData = await commentService.getProjectComments(id);
        setComments(commentsData.comments);
      }
    } catch (err) {
      console.error('Error al reaccionar al comentario:', err);
      alert('Error al procesar la reacción');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('¿Estás seguro de eliminar este comentario?')) return;

    try {
      await commentService.deleteComment(commentId);
      
      if (id) {
        const commentsData = await commentService.getProjectComments(id);
        setComments(commentsData.comments);
      }
      
      alert('Comentario eliminado');
    } catch (err) {
      console.error('Error al eliminar comentario:', err);
      alert('Error al eliminar el comentario');
    }
  };

  if (loading) {
    return (
      <>
        <HeaderLayout />
        <div className="loading-container">Cargando proyecto...</div>
        <Footer
          logoSrc={LogoSimetrica}
          logoAlt="Logo Simétrica"
          columns={[]}
          socialLinks={[]}
          copyright="© 2025 Simétrica. Todos los derechos reservados."
          ariaLabel="Pie de página"
        />
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <HeaderLayout />
        <div className="error-container">{error || 'Proyecto no encontrado'}</div>
        <Footer
          logoSrc={LogoSimetrica}
          logoAlt="Logo Simétrica"
          columns={[]}
          socialLinks={[]}
          copyright="© 2025 Simétrica. Todos los derechos reservados."
          ariaLabel="Pie de página"
        />
      </>
    );
  }

  const footerColumns = [
    {
      title: "Servicios",
      links: [
        { label: "Proyectos", href: "/proyectos" },
        { label: "Diseños", href: "/diseños" },
        { label: "Construcción", href: "/construccion" },
      ],
    },
    {
      title: "Empresa",
      links: [
        { label: "Asociados", href: "/asociados" },
        { label: "Trabaja con nosotros", href: "/trabaja-con-nosotros" },
        { label: "Contacto", href: "/contacto" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Política de Privacidad", href: "/privacidad" },
        { label: "Términos de Servicio", href: "/terminos" },
      ],
    },
  ];

  const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com/simetrica_ia/", external: true },
    { label: "Facebook", href: "https://www.facebook.com/share/17PvCWuUtm/?mibextid=wwXIfr", external: true },
    { label: "TikTok", href: "https://www.tiktok.com/@simetrica7?_t=ZS-90L6hiOnqKe&_r=1", external: true },
    { label: "Pinterest", href: "https://co.pinterest.com/insonorizacion_acustica7/?invite_code=dd12bf69cdd14ac8aecd84e3f084a435&sender=595601256878326965", external: true },
    { label: "WhatsApp", href: "https://wa.me/573103858223", external: true },
  ];

  return (
    <>
      <HeaderLayout />
      <main className="project-detail">
        <button className="back-button" onClick={() => window.history.back()}>
          ← Volver
        </button>

        <div className="project-detail__content">
          <div className="project-detail__gallery">
            <div className="main-image">
              <img 
                src={project.imagenes[0]?.url || PlaceholderImage} 
                alt={project.nombre} 
              />
            </div>
            <div className="thumbnail-images">
              {project.imagenes.slice(1, 4).map((img, idx) => (
                <img key={idx} src={img.url} alt={`${project.nombre} - ${idx + 2}`} />
              ))}
            </div>
          </div>

          <div className="project-detail__info">
            <div className="project-detail__header">
              <div className="project-detail__title-section">
                <h1>{project.nombre}</h1>
                <p className="project-client">Cliente: {project.cliente}</p>
                <div className="project-metadata">
                  <span>📍 {project.ubicacion}</span>
                  <span>⏱️ {project.duracion}</span>
                  <span>👥 {project.personasInvolucradas} personas</span>
                </div>
              </div>
              <div className="project-detail__stats">
                <button 
                  className={`likes ${userReaction === 'like' ? 'active' : ''}`}
                  onClick={() => handleReaction('like')}
                  disabled={!user}
                >
                  <span className="icon">♥</span> {formatNumber(project.likes)}
                </button>
                <button 
                  className={`dislikes ${userReaction === 'dislike' ? 'active' : ''}`}
                  onClick={() => handleReaction('dislike')}
                  disabled={!user}
                >
                  <span className="icon">×</span> {formatNumber(project.dislikes)}
                </button>
              </div>
            </div>

            <div className="project-detail__description">
              <h3>Descripción del Proyecto</h3>
              <p>{project.descripcion}</p>
            </div>

            <div className="comments-section">
              <h3 className="comments-title">
                Comentarios ({comments.length})
              </h3>
              
              <button 
                className="add-comment-button" 
                onClick={handleOpenModal}
                disabled={!user}
              >
                {user ? 'Agregar un comentario' : 'Inicia sesión para comentar'}
              </button>

              <div className="comments-list">
                {comments.length === 0 ? (
                  <p className="no-comments">No hay comentarios aún. ¡Sé el primero en comentar!</p>
                ) : (
                  comments.map((comment) => {
                    const commentReaction = commentService.getUserReaction(comment, user?.id || null);
                    const isAuthor = user?.id === comment.autor._id;
                    
                    return (
                      <div key={comment._id} className="comment-card">
                        <div className="comment-header">
                          <div className="comment-author-info">
                            <span className="comment-author">{comment.autor.username}</span>
                            <span className="comment-date">
                              {new Date(comment.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          {isAuthor && (
                            <button 
                              className="comment-delete-btn"
                              onClick={() => handleDeleteComment(comment._id)}
                              title="Eliminar comentario"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <p className="comment-content">{comment.contenido}</p>
                        <div className="comment-actions">
                          <button
                            className={`comment-reaction ${commentReaction === 'like' ? 'active' : ''}`}
                            onClick={() => handleCommentReaction(comment._id, 'like')}
                            disabled={!user}
                          >
                            ↑ {comment.likes}
                          </button>
                          <button
                            className={`comment-reaction ${commentReaction === 'dislike' ? 'active' : ''}`}
                            onClick={() => handleCommentReaction(comment._id, 'dislike')}
                            disabled={!user}
                          >
                            ↓ {comment.dislikes}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {isModalOpen && (
              <div className="modal-overlay" onClick={handleCloseModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>Agregar Comentario</h2>
                    <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
                  </div>
                  <textarea
                    className="comment-textarea"
                    placeholder="Escribe tu comentario..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    maxLength={500}
                    rows={5}
                  />
                  <span className="char-count">{commentText.length}/500</span>
                  <div className="modal-actions">
                    <button 
                      type="button" 
                      className="cancel-button" 
                      onClick={handleCloseModal}
                      disabled={submittingComment}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="button" 
                      className="submit-button" 
                      onClick={handleSubmitComment}
                      disabled={!commentText.trim() || submittingComment}
                    >
                      {submittingComment ? 'Enviando...' : 'Publicar'}
                    </button>
                  </div>
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

export default ProjectDetailPage;
