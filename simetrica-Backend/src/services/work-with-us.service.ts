import WorkWithUsModel, {
  ApplicationStatusEnum,
  ExperienceEnum,
} from '../models/work-with-us.model.js';
import type { IWorkWithUs } from '../models/work-with-us.model.js';

export class WorkWithUsService {
  async create(data: any): Promise<IWorkWithUs> {
    const exists = await WorkWithUsModel.findOne({
      $or: [
        { email: data.email },
        { identificationNumber: data.identificationNumber },
      ],
    });

    if (exists) {
      throw new Error('Ya existe una aplicación con este correo o cédula');
    }

    const applicationScore = this.calculateScore(data);

    const application = await WorkWithUsModel.create({
      ...data,
      jobId: data.jobId || null,
      status: ApplicationStatusEnum.PENDING,
      applicationScore,
      isActive: true,
    });

    return application;
  }

  async getAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      WorkWithUsModel.find({ isActive: true }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      WorkWithUsModel.countDocuments({ isActive: true }),
    ]);

    return {
      data: applications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getById(id: string): Promise<IWorkWithUs | null> {
    return await WorkWithUsModel.findById(id);
  }

  async updateStatus(id: string, status: ApplicationStatusEnum): Promise<IWorkWithUs | null> {
    const application = await WorkWithUsModel.findByIdAndUpdate(
      id,
      {
        status,
        reviewedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    return application;
  }

  async delete(id: string): Promise<boolean> {
    const result = await WorkWithUsModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    return result !== null;
  }

  private calculateScore(data: any): number {
    let score = 50;

    const expPoints: any = {
      [ExperienceEnum.MORE_THAN_TEN]: 20,
      [ExperienceEnum.FIVE_TO_TEN]: 15,
      [ExperienceEnum.THREE_TO_FIVE]: 10,
      [ExperienceEnum.ONE_TO_THREE]: 5,
    };
    score += expPoints[data.experienceLevel] || 0;

    if (data.hasCertifications) score += 10;

    if (data.availability === 'FULL_TIME') score += 10;
    else if (data.availability === 'PART_TIME') score += 5;

    if (data.professionalProfile === 'CONSTRUCCION' && data.specialties?.length > 0) {
      score += Math.min(data.specialties.length * 2, 10);
    }

    if (data.skillsDescription?.length > 30) score += 3;

    const professionalProfiles = [
      'ARQUITECTO', 'INGENIERO', 'ABOGADO', 'ADMINISTRADOR',
      'TRABAJADOR_SOCIAL', 'CONSTRUCCION', 'TECNICO',
    ];
    if (data.professionalProfile && professionalProfiles.includes(data.professionalProfile)) {
      score += 5;
    }

    return Math.min(score, 100);
  }
}

export default new WorkWithUsService();
