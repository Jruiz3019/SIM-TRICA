import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface Project {
  _id: string;
  nombre: string;
  cliente: string;
  descripcion: string;
  ubicacion: string;
  duracion: string;
  personasInvolucradas: number;
  imagenes: Array<{
    _id: string;
    url: string;
    filename: string;
    altText?: string;
    description?: string;
  }>;
  likes: number;
  dislikes: number;
  reactions: Array<{
    userId: string;
    type: 'like' | 'dislike';
  }>;
  createdBy: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ProjectListResponse {
  success: boolean;
  projects: Project[];
  total: number;
  page: number;
  totalPages: number;
}

interface ProjectResponse {
  success: boolean;
  data: Project;
}

class ProjectService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getAll(page: number = 1, limit: number = 12): Promise<ProjectListResponse> {
    const response = await axios.get(`${API_URL}/projects?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getById(id: string): Promise<ProjectResponse> {
    const response = await axios.get(`${API_URL}/projects/${id}`);
    return response.data;
  }

  async search(query: string): Promise<{ success: boolean; data: Project[] }> {
    const response = await axios.get(`${API_URL}/projects/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  async react(projectId: string, type: 'like' | 'dislike'): Promise<ProjectResponse> {
    const response = await axios.post(
      `${API_URL}/projects/${projectId}/react`,
      { type },
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  getUserReaction(project: Project, userId: string | null): 'like' | 'dislike' | null {
    if (!userId) return null;
    const reaction = project.reactions.find(r => r.userId === userId);
    return reaction ? reaction.type : null;
  }
}

export default new ProjectService();
