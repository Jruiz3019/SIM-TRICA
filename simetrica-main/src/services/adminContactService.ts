import type { Contact, ContactListResponse } from '../types/contact.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ContactService {
  /**
   * Obtiene todos los mensajes de contacto con paginación
   */
  async getAll(page: number = 1, limit: number = 20): Promise<ContactListResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/contact?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los mensajes de contacto');
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
   * Obtiene un mensaje de contacto por ID
   */
  async getById(id: string): Promise<Contact> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/contact/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el mensaje de contacto');
    }

    return await response.json();
  }

  /**
   * Marca un mensaje como leído
   */
  async markAsRead(id: string): Promise<Contact> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/contact/${id}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al marcar el mensaje como leído');
    }

    return await response.json();
  }

  /**
   * Actualiza el estado de un mensaje
   */
  async updateStatus(id: string, status: string): Promise<Contact> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/contact/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el estado del mensaje');
    }

    return await response.json();
  }

  /**
   * Elimina un mensaje de contacto
   */
  async delete(id: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/contact/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el mensaje');
    }
  }
}

export default new ContactService();
