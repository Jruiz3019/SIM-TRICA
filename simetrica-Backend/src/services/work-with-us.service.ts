import WorkWithUsModel, {
  ApplicationStatusEnum,
  ExperienceEnum,
} from '../models/work-with-us.model.js';
import type { IWorkWithUs } from '../models/work-with-us.model.js';

/**
 * Servicio para aplicaciones de trabajo
 */
export class WorkWithUsService {
  /**
   * Crea una nueva aplicación
   */
  async create(data: any): Promise<IWorkWithUs> {
    // Verificar duplicados
    const exists = await WorkWithUsModel.findOne({
      $or: [
        { email: data.email },
        { identificationNumber: data.identificationNumber },
      ],
    });

    if (exists) {
      throw new Error('Ya existe una aplicación con este correo o cédula');
    }

    // Calcular score
    const applicationScore = this.calculateScore(data);

    // Crear
    const application = await WorkWithUsModel.create({
      ...data,
      status: ApplicationStatusEnum.PENDING,
      applicationScore,
      isActive: true,
      projectPhotos: [],
    });

    return application;
  }

  /**
   * Obtiene todas las aplicaciones con paginación
   */
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

  /**
   * Obtiene una aplicación por ID
   */
  async getById(id: string): Promise<IWorkWithUs | null> {
    return await WorkWithUsModel.findById(id);
  }

  /**
   * Actualiza el estado de una aplicación
   */
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

  /**
   * Elimina una aplicación (soft delete)
   */
  async delete(id: string): Promise<boolean> {
    // Soft delete - marcar como inactivo en lugar de eliminar físicamente
    const result = await WorkWithUsModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    return result !== null;
  }

  /**
   * Calcula score basado en criterios
   */
  private calculateScore(data: any): number {
    let score = 50;

    // Experiencia (0-20)
    const expPoints: any = {
      [ExperienceEnum.MORE_THAN_TEN]: 20,
      [ExperienceEnum.FIVE_TO_TEN]: 15,
      [ExperienceEnum.THREE_TO_FIVE]: 10,
      [ExperienceEnum.ONE_TO_THREE]: 5,
    };
    score += expPoints[data.experienceLevel] || 0;

    // Certificaciones (0-10)
    if (data.hasCertifications) score += 10;

    // Disponibilidad (0-10)
    if (data.availability === 'FULL_TIME') score += 10;
    else if (data.availability === 'PART_TIME') score += 5;

    // Especialidades (0-10)
    score += Math.min(data.specialties.length * 2, 10);

    // Referencias (0-15)
    score += Math.min(data.references.length * 3, 15);

    // Descripción (0-5)
    if (data.constructionExperienceDescription?.length > 50) score += 5;

    return Math.min(score, 100);
  }
}

export default new WorkWithUsService();
