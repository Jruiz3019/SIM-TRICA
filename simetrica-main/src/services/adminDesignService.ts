import axios from 'axios';
import type { DesignListResponse, DesignResponse, DesignFormData, Design } from '../types/design.types';

const API_URL = 'http://localhost:3000/api';

class AdminDesignService {
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
   * Obtener todos los diseños
   */
  async getAll(page: number = 1, limit: number = 20): Promise<DesignListResponse> {
    const response = await axios.get<DesignListResponse>(
      `${API_URL}/designs?page=${page}&limit=${limit}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  /**
   * Obtener un diseño por ID
   */
  async getById(id: string): Promise<DesignResponse> {
    const response = await axios.get<DesignResponse>(
      `${API_URL}/designs/${id}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  /**
   * Crear un nuevo diseño
   */
  async create(data: DesignFormData): Promise<DesignResponse> {
    const response = await axios.post<DesignResponse>(
      `${API_URL}/designs`,
      data,
      this.getAuthHeaders()
    );
    return response.data;
  }

  /**
   * Actualizar un diseño
   */
  async update(id: string, data: Partial<DesignFormData>): Promise<DesignResponse> {
    const response = await axios.put<DesignResponse>(
      `${API_URL}/designs/${id}`,
      data,
      this.getAuthHeaders()
    );
    return response.data;
  }

  /**
   * Eliminar un diseño
   */
  async delete(id: string): Promise<boolean> {
    await axios.delete(`${API_URL}/designs/${id}`, this.getAuthHeaders());
    return true;
  }

  /**
   * Buscar diseños
   */
  async search(query: string): Promise<Design[]> {
    const response = await axios.get<{ success: boolean; designs: Design[] }>(
      `${API_URL}/designs/search?q=${encodeURIComponent(query)}`,
      this.getAuthHeaders()
    );
    return response.data.designs;
  }
}

export default new AdminDesignService();
