import ProviderModel, {
  ProviderStatusEnum,
} from '../models/provider.model.js';
import type { IProvider } from '../models/provider.model.js';

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

interface CreateProviderData {
  nombre: string;
  contacto: string;
  email: string;
  telefono: string;
  categoria: string;
  descripcion: string;
  ciudad: string;
  acepto: boolean;
  ipAddress?: string;
  userAgent?: string;
}

interface UpdateProviderData {
  rating?: number;
  verificado?: boolean;
  fundacion?: string;
  proyectos?: number;
  status?: ProviderStatusEnum;
  reviewNotes?: string;
}

interface GetAllForAdminOptions {
  page?: number;
  limit?: number;
  status?: string;
  categoria?: string;
  search?: string;
}

export class ProviderService {
  async create(data: CreateProviderData): Promise<IProvider> {
    const provider = await ProviderModel.create({
      ...data,
      status: ProviderStatusEnum.PENDING,
      rating: 1,
      verificado: false,
      proyectos: 0,
    });

    return provider;
  }

  async getAllPublic() {
    return await ProviderModel.find({
      status: { $in: [ProviderStatusEnum.APPROVED, ProviderStatusEnum.ACTIVE] },
    }).sort({ rating: -1, createdAt: -1 }).limit(100);
  }

  async getAllAdmin(options: GetAllForAdminOptions = {}) {
    const { page = 1, status, categoria, search } = options;
    const limit = Math.min(options.limit || 20, 100);
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (status && status !== 'ALL') {
      filter.status = status;
    }

    if (categoria && categoria !== 'ALL') {
      filter.categoria = categoria;
    }

    if (search) {
      const escaped = escapeRegExp(search);
      filter.$or = [
        { nombre: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } },
      ];
    }

    const [providers, total] = await Promise.all([
      ProviderModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ProviderModel.countDocuments(filter),
    ]);

    return {
      data: providers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getById(id: string): Promise<IProvider | null> {
    return await ProviderModel.findById(id);
  }

  async getByIdPublic(id: string): Promise<IProvider | null> {
    return await ProviderModel.findOne({
      _id: id,
      status: { $in: [ProviderStatusEnum.APPROVED, ProviderStatusEnum.ACTIVE] },
    });
  }

  async update(
    id: string,
    data: UpdateProviderData,
    reviewedBy?: string
  ): Promise<IProvider | null> {
    const updateData: Record<string, unknown> = { ...data };

    if (data.status && data.status !== ProviderStatusEnum.PENDING) {
      updateData.reviewedBy = reviewedBy;
      updateData.reviewedAt = new Date();
    }

    const provider = await ProviderModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return provider;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ProviderModel.findByIdAndDelete(id);
    return result !== null;
  }

  async getStats() {
    const result = await (ProviderModel as any).getStats();
    return result[0] || null;
  }

  async getCategoriesSummary() {
    return await ProviderModel.aggregate([
      {
        $match: {
          status: { $in: [ProviderStatusEnum.APPROVED, ProviderStatusEnum.ACTIVE] },
        },
      },
      {
        $group: {
          _id: '$categoria',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
  }
}

export default new ProviderService();
