export interface Image {
  _id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface Reaction {
  userId: string;
  type: 'like' | 'dislike';
}

export interface Project {
  _id: string;
  nombre: string;
  cliente: string;
  descripcion: string;
  ubicacion: string;
  duracion: string;
  personasInvolucradas: number;
  imagenes: Image[];
  reactions: Reaction[];
  likes: number;
  dislikes: number;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  nombre: string;
  cliente: string;
  descripcion: string;
  ubicacion: string;
  duracion: string;
  personasInvolucradas: number;
  imagenes?: string[];
}

export interface ProjectListResponse {
  success: boolean;
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProjectResponse {
  success: boolean;
  project: Project;
}
