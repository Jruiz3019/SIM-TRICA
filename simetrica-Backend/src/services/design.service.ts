import Design from '../models/design.model.js';
import type { IDesign } from '../models/design.model.js';
import Image from '../models/image.model.js';
import { Types, Schema } from 'mongoose';

class DesignService {
  /**
   * Crear un nuevo diseño
   */
  async createDesign(
    data: {
      nombre: string;
      descripcion: string;
      imagenes?: string[];
    },
    userId: string
  ): Promise<IDesign> {
    const design = await Design.create({
      ...data,
      imagenes: data.imagenes || [],
      createdBy: userId,
    });

    return await design.populate('imagenes createdBy', '-password');
  }

  /**
   * Obtener todos los diseños (público)
   */
  async getAllDesigns(page: number = 1, limit: number = 10): Promise<{
    designs: IDesign[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    const [designs, total] = await Promise.all([
      Design.find()
        .populate('imagenes')
        .populate('createdBy', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Design.countDocuments(),
    ]);

    return {
      designs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtener un diseño por ID (público)
   */
  async getDesignById(id: string): Promise<IDesign | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID de diseño inválido');
    }

    return await Design.findById(id)
      .populate('imagenes')
      .populate('createdBy', 'username email');
  }

  /**
   * Actualizar un diseño (solo ADMIN)
   */
  async updateDesign(
    id: string,
    data: Partial<{
      nombre: string;
      descripcion: string;
      imagenes: string[];
    }>
  ): Promise<IDesign | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID de diseño inválido');
    }

    return await Design.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('imagenes')
      .populate('createdBy', 'username email');
  }

  /**
   * Eliminar un diseño (solo ADMIN)
   */
  async deleteDesign(id: string): Promise<IDesign | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID de diseño inválido');
    }

    const design = await Design.findByIdAndDelete(id);
    
    // Opcional: eliminar las imágenes asociadas
    if (design && design.imagenes.length > 0) {
      await Image.deleteMany({ _id: { $in: design.imagenes } });
    }

    return design;
  }

  /**
   * Reaccionar a un diseño (like/dislike)
   */
  async reactToDesign(
    designId: string,
    userId: string,
    type: 'like' | 'dislike'
  ): Promise<IDesign | null> {
    if (!Types.ObjectId.isValid(designId)) {
      throw new Error('ID de diseño inválido');
    }

    const design = await Design.findById(designId);
    if (!design) {
      throw new Error('Diseño no encontrado');
    }

    // Verificar si el usuario ya reaccionó
    const existingReactionIndex = design.reactions.findIndex(
      (r) => r.userId.toString() === userId
    );

    if (existingReactionIndex !== -1) {
      const existingReaction = design.reactions[existingReactionIndex];
      
      if (!existingReaction) {
        throw new Error('Error en la reacción');
      }

      // Si es la misma reacción, la eliminamos (toggle)
      if (existingReaction.type === type) {
        design.reactions.splice(existingReactionIndex, 1);
        if (type === 'like') {
          design.likes = Math.max(0, design.likes - 1);
        } else {
          design.dislikes = Math.max(0, design.dislikes - 1);
        }
      } else {
        // Si es diferente, actualizamos
        const reaction = design.reactions[existingReactionIndex];
        if (reaction) {
          reaction.type = type;
        }
        if (type === 'like') {
          design.likes += 1;
          design.dislikes = Math.max(0, design.dislikes - 1);
        } else {
          design.dislikes += 1;
          design.likes = Math.max(0, design.likes - 1);
        }
      }
    } else {
      // Nueva reacción
      design.reactions.push({
        userId: new Types.ObjectId(userId),
        type,
      });
      if (type === 'like') {
        design.likes += 1;
      } else {
        design.dislikes += 1;
      }
    }

    await design.save();
    return await design.populate('imagenes createdBy', '-password');
  }

  /**
   * Buscar diseños por texto
   */
  async searchDesigns(query: string): Promise<IDesign[]> {
    return await Design.find({
      $text: { $search: query },
    })
      .populate('imagenes')
      .populate('createdBy', 'username email')
      .sort({ score: { $meta: 'textScore' } });
  }
}

export default new DesignService();
