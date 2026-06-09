import type { Project } from '../../services/projectService';
import PlaceholderImage from '../../assets/project1.png';
import './ProjectCardStyle.css';

interface ProjectCardProps {
  project: Project;
  isFeatured?: boolean;
  index: number;
  onClick: () => void;
}

const deriveCategory = (project: Project): string | null => {
  const text = `${project.cliente} ${project.nombre}`.toLowerCase();

  if (/iglesia|capilla|catedral|templo|parroquia|santuario/.test(text)) return 'IGLESIA';
  if (/residencial|casa|apartamento|vivienda|hogar|habitacional|conjunto/.test(text)) return 'RESIDENCIAL';
  if (/comercial|tienda|local|negocio|oficina|centro comercial/.test(text)) return 'COMERCIAL';
  if (/hotel|hostal|alojamiento/.test(text)) return 'HOTELERÍA';
  if (/hospital|clínica|salud|centro médico/.test(text)) return 'SALUD';
  if (/colegio|universidad|educativo|biblioteca|escolar/.test(text)) return 'EDUCATIVO';
  if (/industrial|fábrica|bodega|almacén/.test(text)) return 'INDUSTRIAL';
  if (/auditorio|teatro|sala|estudio|acústica|insonorización/.test(text)) return 'AUDITORIO';

  return null;
};

const ProjectCard = ({ project, isFeatured = false, index, onClick }: ProjectCardProps) => {
  const category = deriveCategory(project);

  return (
    <div
      className={`project-card-card ${isFeatured ? 'project-card-card--featured' : ''}`}
      style={{ '--i': index } as React.CSSProperties}
      onClick={onClick}
    >
      <div className="project-card-card__image-wrap">
        <img
          src={project.imagenes[0]?.url || PlaceholderImage}
          alt={project.nombre}
          className="project-card-card__image"
        />
        <div className="project-card-card__image-overlay" />

        {category && (
          <span className="project-card-card__badge project-card-card__badge--category">
            {category}
          </span>
        )}

        {isFeatured && (
          <span className="project-card-card__badge project-card-card__badge--featured">
            DESTACADO
          </span>
        )}
      </div>

      <div className="project-card-card__body">
        <span className="project-card-card__client">{project.cliente}</span>
        <h3 className="project-card-card__title">{project.nombre}</h3>
        <p className="project-card-card__desc">{project.descripcion}</p>

        <div className="project-card-card__separator" />

        <div className="project-card-card__footer">
          <div className="project-card-card__stats">
            <span className={`project-card-card__stat ${project.likes > 0 ? 'project-card-card__stat--liked' : ''}`}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {project.likes}
            </span>
            <span className="project-card-card__stat">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {project.dislikes}
            </span>
          </div>

          <span className="project-card-card__cta">
            Ver proyecto
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
