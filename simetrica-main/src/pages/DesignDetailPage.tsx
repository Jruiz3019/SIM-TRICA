import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import HeaderLayout from "../layouts/HeaderLayout";
import Footer from "../layouts/Footer";
import "./styles/DesignDetailPageStyle.css";
import LogoSimetrica from "../assets/logo-simetrica-blanco.png";
import PlaceholderImage from "../assets/Diseno.png";
import designService from '../services/designService';
import commentService, { type Comment } from '../services/commentService';
import { useAuth } from '../context/useAuth';
import type { Design } from '../types/design.types';

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const DesignDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const loadDesign = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await designService.getById(id);
      setDesign(data);
      setError('');
      
      // Cargar comentarios
      const commentsData = await commentService.getDesignComments(id);
      setComments(commentsData.comments);
    } catch (err) {
      console.error('Error cargando diseño:', err);
      setError('Error al cargar el diseño');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDesign();
  }, [loadDesign]);

  useEffect(() => {
    if (design && user) {
      // Verificar si el usuario ya reaccionó
      const reaction = design.reactions.find(r => r.userId === user.id);
      setUserReaction(reaction?.type || null);
    }
  }, [design, user]);

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!user) {
      alert('Debes iniciar sesión para reaccionar');
      navigate('/login');
      return;
    }

    if (!id) return;

    try {
      const updatedDesign = await designService.react(id, type);
      setDesign(updatedDesign);
      
      // Actualizar la reacción del usuario
      const reaction = updatedDesign.reactions.find(r => r.userId === user.id);
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
      await commentService.createDesignComment(id, commentText.trim());
      
      // Recargar comentarios
      const commentsData = await commentService.getDesignComments(id);
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
      
      // Recargar comentarios
      if (id) {
        const commentsData = await commentService.getDesignComments(id);
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
      
      // Recargar comentarios
      if (id) {
        const commentsData = await commentService.getDesignComments(id);
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
        <div className="loading-container">Cargando diseño...</div>
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

  if (error || !design) {
    return (
      <>
        <HeaderLayout />
        <div className="error-container">{error || 'Diseño no encontrado'}</div>
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
      <main className="design-detail">
        <button className="back-button" onClick={() => window.history.back()}>
          Volver
        </button>

        <div className="design-detail__content">
          <div className="design-detail__gallery">
            <div className="main-image">
              <img 
                src={design.imagenes[0]?.url || PlaceholderImage} 
                alt={design.nombre} 
              />
            </div>
            <div className="thumbnail-images">
              {design.imagenes.slice(1, 4).map((img, idx) => (
                <img key={idx} src={img.url} alt={`${design.nombre} - ${idx + 2}`} />
              ))}
            </div>
          </div>

          <div className="design-detail__info">
            <div className="design-detail__header">
              <div className="design-detail__title-section">
                <div className="design-detail__title-category">
                  <h1>{design.nombre}</h1>
                </div>
                <p className="design-detail__description">{design.descripcion}</p>
              </div>
              <div className="design-detail__stats">
                <button 
                  className={`likes ${userReaction === 'like' ? 'active' : ''}`}
                  onClick={() => handleReaction('like')}
                  disabled={!user}
                >
                  <span className="icon">♥</span> {formatNumber(design.likes)}
                </button>
                <button 
                  className={`dislikes ${userReaction === 'dislike' ? 'active' : ''}`}
                  onClick={() => handleReaction('dislike')}
                  disabled={!user}
                >
                  <span className="icon">×</span> {formatNumber(design.dislikes)}
                </button>
              </div>
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

export default DesignDetailPage;