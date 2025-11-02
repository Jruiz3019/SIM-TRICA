import axios from 'axios';
import type { DesignListResponse, DesignResponse, Design } from '../types/design.types';

const API_URL = 'http://localhost:3000/api';

/**
 * Servicio público para diseños (cualquier usuario puede ver)
 */
class DesignService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (token) {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
    return {};
  }

  /**
   * Obtener todos los diseños (público)
   */
  async getAll(page: number = 1, limit: number = 20): Promise<DesignListResponse> {
    const response = await axios.get<DesignListResponse>(
      `${API_URL}/designs?page=${page}&limit=${limit}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  /**
   * Obtener un diseño por ID (público)
   */
  async getById(id: string): Promise<Design> {
    const response = await axios.get<DesignResponse>(
      `${API_URL}/designs/${id}`,
      this.getAuthHeaders()
    );
    return response.data.design;
  }

  /**
   * Buscar diseños (público)
   */
  async search(query: string): Promise<Design[]> {
    const response = await axios.get<{ success: boolean; designs: Design[] }>(
      `${API_URL}/designs/search?q=${encodeURIComponent(query)}`,
      this.getAuthHeaders()
    );
    return response.data.designs;
  }

  /**
   * Reaccionar a un diseño (requiere autenticación)
   */
  async react(designId: string, type: 'like' | 'dislike'): Promise<Design> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Debes iniciar sesión para reaccionar');
    }

    const response = await axios.post<DesignResponse>(
      `${API_URL}/designs/${designId}/react`,
      { type },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.design;
  }

  /**
   * Obtener la reacción del usuario actual para un diseño
   */
  getUserReaction(design: Design, userId: string | null): 'like' | 'dislike' | null {
    if (!userId) return null;
    const reaction = design.reactions?.find(r => r.userId === userId);
    return reaction ? reaction.type : null;
  }
}

export default new DesignService();
