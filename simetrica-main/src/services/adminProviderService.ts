import type { Provider, ProviderListResponse, ProviderStatsResponse } from '../types/provider.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class AdminProviderService {
  async getAll(page: number = 1, limit: number = 20, status?: string, categoria?: string, search?: string): Promise<ProviderListResponse> {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status && status !== 'ALL') params.append('status', status);
    if (categoria && categoria !== 'ALL') params.append('categoria', categoria);
    if (search) params.append('search', search);

    const response = await fetch(`${API_URL}/providers?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener proveedores');
    }

    return await response.json();
  }

  async getById(id: string): Promise<Provider> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/providers/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el proveedor');
    }

    return await response.json();
  }

  async update(id: string, data: Partial<Provider>): Promise<Provider> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/providers/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el proveedor');
    }

    return await response.json();
  }

  async delete(id: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/providers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el proveedor');
    }
  }

  async getStats(): Promise<ProviderStatsResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/providers/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener estadísticas');
    }

    return await response.json();
  }
}

export default new AdminProviderService();
