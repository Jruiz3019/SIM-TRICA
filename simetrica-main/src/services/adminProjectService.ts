import axios from 'axios';
import type { ProjectListResponse, ProjectResponse, ProjectFormData, Project } from '../types/project.types';

const API_URL = 'http://localhost:3000/api';

class AdminProjectService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  /**
   * Obtener todos los proyectos
   */
  async getAll(page: number = 1, limit: number = 20): Promise<ProjectListResponse> {
    const response = await axios.get<ProjectListResponse>(
      `${API_URL}/projects?page=${page}&limit=${limit}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  /**
   * Obtener un proyecto por ID
   */
  async getById(id: string): Promise<ProjectResponse> {
    const response = await axios.get<ProjectResponse>(
      `${API_URL}/projects/${id}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  /**
   * Crear un nuevo proyecto
   */
  async create(data: ProjectFormData): Promise<ProjectResponse> {
    const response = await axios.post<ProjectResponse>(
      `${API_URL}/projects`,
      data,
      this.getAuthHeaders()
    );
    return response.data;
  }

  /**
   * Actualizar un proyecto
   */
  async update(id: string, data: Partial<ProjectFormData>): Promise<ProjectResponse> {
    const response = await axios.put<ProjectResponse>(
      `${API_URL}/projects/${id}`,
      data,
      this.getAuthHeaders()
    );
    return response.data;
  }

  /**
   * Eliminar un proyecto
   */
  async delete(id: string): Promise<boolean> {
    await axios.delete(`${API_URL}/projects/${id}`, this.getAuthHeaders());
    return true;
  }

  /**
   * Buscar proyectos
   */
  async search(query: string): Promise<Project[]> {
    const response = await axios.get<{ success: boolean; projects: Project[] }>(
      `${API_URL}/projects/search?q=${encodeURIComponent(query)}`,
      this.getAuthHeaders()
    );
    return response.data.projects;
  }
}

export default new AdminProjectService();
