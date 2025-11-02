import type { WorkWithUs, WorkWithUsListResponse } from '../types/work-with-us.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class AdminWorkWithUsService {
  /**
   * Obtiene todas las aplicaciones con paginación
   */
  async getAll(page: number = 1, limit: number = 20): Promise<WorkWithUsListResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/work-with-us?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener las aplicaciones');
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.data,
      pagination: {
        currentPage: data.page,
        totalPages: data.totalPages,
        totalItems: data.total,
        itemsPerPage: limit,
      },
    };
  }

  /**
   * Obtiene una aplicación por ID
   */
  async getById(id: string): Promise<WorkWithUs> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/work-with-us/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener la aplicación');
    }

    return await response.json();
  }

  /**
   * Actualiza el estado de una aplicación
   */
  async updateStatus(id: string, status: string): Promise<WorkWithUs> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/work-with-us/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el estado');
    }

    return await response.json();
  }

  /**
   * Elimina una aplicación (soft delete)
   */
  async delete(id: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/work-with-us/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar la aplicación');
    }
  }
}

export default new AdminWorkWithUsService();
