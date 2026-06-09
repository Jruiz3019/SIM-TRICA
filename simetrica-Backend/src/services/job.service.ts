import Job from '../models/job.model.js';
import type { IJob } from '../models/job.model.js';
import { JobStatusEnum } from '../models/job.model.js';

export class JobService {
  async create(data: any): Promise<IJob> {
    const job = await Job.create({
      cargo: data.cargo,
      ciudad: data.ciudad,
      modalidad: data.modalidad,
      tipo: data.tipo,
      descripcion: data.descripcion,
      skills: data.skills || [],
      status: data.status || JobStatusEnum.OPEN,
      isActive: true,
    });

    return job;
  }

  async getPublicJobs(filters: {
    search?: string | undefined;
    ubicacion?: string | undefined;
    modalidad?: string | undefined;
    tipo?: string | undefined;
  } = {}) {
    const query: any = {
      isActive: true,
      status: { $in: [JobStatusEnum.OPEN, JobStatusEnum.PRIORITY] },
    };

    if (filters?.search) {
      const regex = { $regex: filters.search, $options: 'i' };
      query.$or = [{ cargo: regex }, { descripcion: regex }];
    }

    if (filters?.ubicacion) {
      query.ciudad = { $regex: filters.ubicacion, $options: 'i' };
    }

    if (filters?.modalidad) {
      query.modalidad = filters.modalidad;
    }

    if (filters?.tipo) {
      query.tipo = filters.tipo;
    }

    const jobs = await Job.find(query).sort({ status: -1, createdAt: -1 });
    const total = await Job.countDocuments(query);

    return {
      data: jobs,
      total,
      totalOpen: await Job.countDocuments({ ...query, status: JobStatusEnum.OPEN }),
      totalPriority: await Job.countDocuments({ ...query, status: JobStatusEnum.PRIORITY }),
      totalClosed: await Job.countDocuments({ isActive: true, status: JobStatusEnum.CLOSED }),
    };
  }

  async getById(id: string): Promise<IJob | null> {
    return await Job.findOne({ _id: id, isActive: true });
  }

  async getAllAdmin(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find({ isActive: true }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Job.countDocuments({ isActive: true }),
    ]);

    return {
      data: jobs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, data: any): Promise<IJob | null> {
    const job = await Job.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { new: true, runValidators: true }
    );

    return job;
  }

  async delete(id: string): Promise<boolean> {
    const result = await Job.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    return result !== null;
  }

  async getStats() {
    const [totalActive, totalOpen, totalPriority, totalClosed, ciudades] = await Promise.all([
      Job.countDocuments({ isActive: true, status: { $ne: JobStatusEnum.CLOSED } }),
      Job.countDocuments({ isActive: true, status: JobStatusEnum.OPEN }),
      Job.countDocuments({ isActive: true, status: JobStatusEnum.PRIORITY }),
      Job.countDocuments({ isActive: true, status: JobStatusEnum.CLOSED }),
      Job.distinct('ciudad', { isActive: true, status: { $ne: JobStatusEnum.CLOSED } }),
    ]);

    return {
      totalActive,
      totalOpen,
      totalPriority,
      totalClosed,
      ciudades: ciudades.length,
    };
  }
}

export default new JobService();
