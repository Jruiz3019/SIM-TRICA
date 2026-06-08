import axios from 'axios';
import type { Project, ProjectListResponse } from '../types/project.types.js';

// Re-exportar el tipo Project para facilitar su uso en componentes
export type { Project } from '../types/project.types.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ProjectService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getAll(page: number = 1, limit: number = 12): Promise<ProjectListResponse> {
    const response = await axios.get(`${API_URL}/projects?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getById(id: string): Promise<{ success: boolean; project: Project }> {
    const response = await axios.get(`${API_URL}/projects/${id}`);
    return response.data;
  }

  async search(query: string): Promise<{ success: boolean; data: Project[] }> {
    const response = await axios.get(`${API_URL}/projects/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  async getCount(): Promise<{ success: boolean; total: number }> {
    const response = await this.getAll(1, 1);
    return { success: true, total: response.total };
  }

  async react(projectId: string, type: 'like' | 'dislike'): Promise<{ success: boolean; project: Project }> {
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
