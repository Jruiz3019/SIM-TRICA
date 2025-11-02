import Project from '../models/project.model.js';
import type { IProject } from '../models/project.model.js';
import Image from '../models/image.model.js';
import { Types, Schema } from 'mongoose';

class ProjectService {
  /**
   * Crear un nuevo proyecto
   */
  async createProject(
    data: {
      nombre: string;
      cliente: string;
      descripcion: string;
      ubicacion: string;
      duracion: string;
      personasInvolucradas: number;
      imagenes?: string[];
    },
    userId: string
  ): Promise<IProject> {
    const project = await Project.create({
      ...data,
      imagenes: data.imagenes || [],
      createdBy: userId,
    });

    return await project.populate('imagenes createdBy', '-password');
  }

  /**
   * Obtener todos los proyectos (público)
   */
  async getAllProjects(page: number = 1, limit: number = 10): Promise<{
    projects: IProject[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    const [projects, total] = await Promise.all([
      Project.find()
        .populate('imagenes')
        .populate('createdBy', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Project.countDocuments(),
    ]);

    return {
      projects,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtener un proyecto por ID (público)
   */
  async getProjectById(id: string): Promise<IProject | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID de proyecto inválido');
    }

    return await Project.findById(id)
      .populate('imagenes')
      .populate('createdBy', 'username email');
  }

  /**
   * Actualizar un proyecto (solo ADMIN)
   */
  async updateProject(
    id: string,
    data: Partial<{
      nombre: string;
      cliente: string;
      descripcion: string;
      ubicacion: string;
      duracion: string;
      personasInvolucradas: number;
      imagenes: string[];
    }>
  ): Promise<IProject | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID de proyecto inválido');
    }

    return await Project.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('imagenes')
      .populate('createdBy', 'username email');
  }

  /**
   * Eliminar un proyecto (solo ADMIN)
   */
  async deleteProject(id: string): Promise<IProject | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID de proyecto inválido');
    }

    const project = await Project.findByIdAndDelete(id);
    
    // Opcional: eliminar las imágenes asociadas
    if (project && project.imagenes.length > 0) {
      await Image.deleteMany({ _id: { $in: project.imagenes } });
    }

    return project;
  }

  /**
   * Reaccionar a un proyecto (like/dislike)
   */
  async reactToProject(
    projectId: string,
    userId: string,
    type: 'like' | 'dislike'
  ): Promise<IProject | null> {
    if (!Types.ObjectId.isValid(projectId)) {
      throw new Error('ID de proyecto inválido');
    }

    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error('Proyecto no encontrado');
    }

    // Verificar si el usuario ya reaccionó
    const existingReactionIndex = project.reactions.findIndex(
      (r) => r.userId.toString() === userId
    );

    if (existingReactionIndex !== -1) {
      const existingReaction = project.reactions[existingReactionIndex];
      
      if (!existingReaction) {
        throw new Error('Error en la reacción');
      }

      // Si es la misma reacción, la eliminamos (toggle)
      if (existingReaction.type === type) {
        project.reactions.splice(existingReactionIndex, 1);
        if (type === 'like') {
          project.likes = Math.max(0, project.likes - 1);
        } else {
          project.dislikes = Math.max(0, project.dislikes - 1);
        }
      } else {
        // Si es diferente, actualizamos
        const reaction = project.reactions[existingReactionIndex];
        if (reaction) {
          reaction.type = type;
        }
        if (type === 'like') {
          project.likes += 1;
          project.dislikes = Math.max(0, project.dislikes - 1);
        } else {
          project.dislikes += 1;
          project.likes = Math.max(0, project.likes - 1);
        }
      }
    } else {
      // Nueva reacción
      project.reactions.push({
        userId: new Types.ObjectId(userId),
        type,
      });
      if (type === 'like') {
        project.likes += 1;
      } else {
        project.dislikes += 1;
      }
    }

    await project.save();
    return await project.populate('imagenes createdBy', '-password');
  }

  /**
   * Buscar proyectos por texto
   */
  async searchProjects(query: string): Promise<IProject[]> {
    return await Project.find({
      $text: { $search: query },
    })
      .populate('imagenes')
      .populate('createdBy', 'username email')
      .sort({ score: { $meta: 'textScore' } });
  }
}

export default new ProjectService();
