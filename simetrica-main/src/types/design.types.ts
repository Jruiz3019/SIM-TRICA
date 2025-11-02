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

export interface Design {
  _id: string;
  nombre: string;
  descripcion: string;
  imagenes: Image[];
  reactions: Reaction[];
  likes: number;
  dislikes: number;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface DesignFormData {
  nombre: string;
  descripcion: string;
  imagenes?: string[];
}

export interface DesignListResponse {
  success: boolean;
  designs: Design[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DesignResponse {
  success: boolean;
  design: Design;
}
