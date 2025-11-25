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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const loadProject = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await projectService.getById(id);
      setProject(response.project);
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
      const reaction = project.reactions.find((r) => r.userId === user.id);
      setUserReaction(reaction?.type || null);
    }
  }, [project, user]);

  // Carrusel automático de imágenes
  useEffect(() => {
    if (!project || project.imagenes.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % project.imagenes.length
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [project]);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleNextImage = () => {
    if (!project) return;
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % project.imagenes.length
    );
  };

  const handlePrevImage = () => {
    if (!project) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? project.imagenes.length - 1 : prevIndex - 1
    );
  };

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!user) {
      alert('Debes iniciar sesión para reaccionar');
      navigate('/login');
      return;
    }

    if (!id) return;

    try {
      const response = await projectService.react(id, type);
      setProject(response.project);
      
      const reaction = response.project.reactions.find(r => r.userId === user.id);
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
        { label: "Diseños", href: "/diseños" }
      ]
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
        { label: "Política de Cookies", href: "/cookies" },
        { label: "Términos de Servicio", href: "/terminos" }
      ]
    }
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
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Volver
        </button>

        <div className="project-detail__container">
          {/* Carrusel de imágenes */}
          <div className="project-gallery">
            <div className="gallery-main">
              <button className="gallery-nav gallery-nav--prev" onClick={handlePrevImage}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <div className="gallery-image-container" onClick={() => handleImageClick(project.imagenes[currentImageIndex]?.url || PlaceholderImage)}>
                <img 
                  src={project.imagenes[currentImageIndex]?.url || PlaceholderImage} 
                  alt={`${project.nombre} - Imagen ${currentImageIndex + 1}`}
                  className="gallery-main-image"
                />
                <div className="gallery-zoom-hint">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M11 8V14M8 11H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Click para ampliar</span>
                </div>
              </div>
              
              <button className="gallery-nav gallery-nav--next" onClick={handleNextImage}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="gallery-thumbnails">
              {project.imagenes.map((img, idx) => (
                <button
                  key={idx}
                  className={`gallery-thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(idx)}
                >
                  <img src={img.url} alt={`Miniatura ${idx + 1}`} />
                </button>
              ))}
            </div>
            
            <div className="gallery-counter">
              {currentImageIndex + 1} / {project.imagenes.length}
            </div>
          </div>

          {/* Información del proyecto */}
          <div className="project-info">
            <div className="project-header">
              <h1 className="project-title">{project.nombre}</h1>
              
              <div className="project-stats">
                <button 
                  className={`stat-button stat-button--like ${userReaction === 'like' ? 'active' : ''}`}
                  onClick={() => handleReaction('like')}
                  disabled={!user}
                  title={user ? 'Me gusta' : 'Inicia sesión para reaccionar'}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 17.5L8.825 16.45C4.4 12.475 1.5 9.87 1.5 6.75C1.5 4.35 3.35 2.5 5.75 2.5C7.1 2.5 8.4 3.1 9.25 4.05C10.1 3.1 11.4 2.5 12.75 2.5C15.15 2.5 17 4.35 17 6.75C17 9.87 14.1 12.475 9.675 16.45L10 17.5Z" fill="currentColor"/>
                  </svg>
                  <span>{formatNumber(project.likes)}</span>
                </button>
                <button 
                  className={`stat-button stat-button--dislike ${userReaction === 'dislike' ? 'active' : ''}`}
                  onClick={() => handleReaction('dislike')}
                  disabled={!user}
                  title={user ? 'No me gusta' : 'Inicia sesión para reaccionar'}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2.5L11.175 3.55C15.6 7.525 18.5 10.13 18.5 13.25C18.5 15.65 16.65 17.5 14.25 17.5C12.9 17.5 11.6 16.9 10.75 15.95C9.9 16.9 8.6 17.5 7.25 17.5C4.85 17.5 3 15.65 3 13.25C3 10.13 5.9 7.525 10.325 3.55L10 2.5Z" fill="currentColor"/>
                  </svg>
                  <span>{formatNumber(project.dislikes)}</span>
                </button>
              </div>
            </div>

            <div className="project-meta">
              <div className="meta-item">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M15.5 7.5C15.5 12.75 9 17.25 9 17.25C9 17.25 2.5 12.75 2.5 7.5C2.5 5.77609 3.18482 4.12279 4.40381 2.90381C5.62279 1.68482 7.27609 1 9 1C10.7239 1 12.3772 1.68482 13.5962 2.90381C14.8152 4.12279 15.5 5.77609 15.5 7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <div>
                  <span className="meta-label">Ubicación</span>
                  <span className="meta-value">{project.ubicacion}</span>
                </div>
              </div>
              
              <div className="meta-item">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M9 4.5V9L12 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <div>
                  <span className="meta-label">Duración</span>
                  <span className="meta-value">{project.duracion}</span>
                </div>
              </div>
              
              <div className="meta-item">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M12 15.75V14.25C12 13.4544 11.6839 12.6913 11.1213 12.1287C10.5587 11.5661 9.79565 11.25 9 11.25H4.5C3.70435 11.25 2.94129 11.5661 2.37868 12.1287C1.81607 12.6913 1.5 13.4544 1.5 14.25V15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="6.75" cy="5.25" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M16.5 15.75V14.25C16.4996 13.5853 16.2822 12.9395 15.8802 12.4088C15.4782 11.8782 14.913 11.4908 14.27 11.3025" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.52 2.5525C12.1643 2.74031 12.7308 3.12766 13.1337 3.65897C13.5365 4.19028 13.7544 4.83722 13.7544 5.5025C13.7544 6.16778 13.5365 6.81472 13.1337 7.34603C12.7308 7.87734 12.1643 8.26469 11.52 8.4525" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <span className="meta-label">Equipo</span>
                  <span className="meta-value">{project.personasInvolucradas} personas</span>
                </div>
              </div>
            </div>

            <div className="project-client">
              <span className="client-label">Cliente:</span>
              <span className="client-name">{project.cliente}</span>
            </div>

            <div className="project-description">
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

      {/* Modal para ver imagen en grande */}
      {isImageModalOpen && (
        <div className="image-modal" onClick={() => setIsImageModalOpen(false)}>
          <button className="image-modal__close" onClick={() => setIsImageModalOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="image-modal__content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Vista ampliada" />
          </div>
        </div>
      )}

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
