import type { Job, JobListResponse, JobStatsResponse } from '../types/job.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class JobService {
  async getAll(filters?: {
    search?: string;
    ubicacion?: string;
    modalidad?: string;
    tipo?: string;
  }): Promise<JobListResponse> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.ubicacion) params.append('ubicacion', filters.ubicacion);
    if (filters?.modalidad) params.append('modalidad', filters.modalidad);
    if (filters?.tipo) params.append('tipo', filters.tipo);

    const response = await fetch(`${API_URL}/jobs?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Error al obtener vacantes');
    }

    return await response.json();
  }

  async getById(id: string): Promise<Job> {
    const response = await fetch(`${API_URL}/jobs/${id}`);

    if (!response.ok) {
      throw new Error('Error al obtener la vacante');
    }

    return await response.json();
  }

  async getStats(): Promise<JobStatsResponse> {
    const response = await fetch(`${API_URL}/jobs/stats`);

    if (!response.ok) {
      throw new Error('Error al obtener estadísticas');
    }

    return await response.json();
  }
}

export default new JobService();
