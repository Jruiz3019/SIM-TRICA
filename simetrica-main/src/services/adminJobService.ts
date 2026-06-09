import type { Job, JobAdminListResponse } from '../types/job.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function handleError(response: Response): Promise<never> {
  const body = await response.json().catch(() => ({}));
  const message = body.message || body.errors?.join(', ') || `Error ${response.status}`;
  throw new Error(message);
}

class AdminJobService {
  async getAll(page: number = 1, limit: number = 20): Promise<JobAdminListResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/jobs/admin?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) await handleError(response);

    return await response.json();
  }

  async getById(id: string): Promise<Job> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) await handleError(response);

    return await response.json();
  }

  async create(data: Omit<Job, '_id' | 'isActive' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; message: string; data: Job }> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) await handleError(response);

    return await response.json();
  }

  async update(id: string, data: Partial<Job>): Promise<{ success: boolean; message: string; data: Job }> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) await handleError(response);

    return await response.json();
  }

  async delete(id: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) await handleError(response);
  }
}

export default new AdminJobService();
