import Image from '../models/image.model.js';
import type { IImage } from '../models/image.model.js';
import { Types } from 'mongoose';

class ImageService {
  /**
   * Guardar información de una imagen
   */
  async createImage(
    data: {
      url: string;
      filename: string;
      description?: string;
      altText?: string;
      size: number;
      mimeType: string;
    },
    userId: string
  ): Promise<IImage> {
    return await Image.create({
      ...data,
      uploadedBy: userId,
    });
  }

  /**
   * Obtener una imagen por ID
   */
  async getImageById(id: string): Promise<IImage | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID de imagen inválido');
    }

    return await Image.findById(id).populate('uploadedBy', 'username email');
  }

  /**
   * Obtener todas las imágenes de un usuario
   */
  async getImagesByUser(userId: string): Promise<IImage[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('ID de usuario inválido');
    }

    return await Image.find({ uploadedBy: userId }).sort({ createdAt: -1 });
  }

  /**
   * Obtener todas las imágenes con paginación (público)
   */
  async getAllImages(page: number = 1, limit: number = 20): Promise<{
    images: IImage[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    const [images, total] = await Promise.all([
      Image.find()
        .populate('uploadedBy', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Image.countDocuments(),
    ]);

    return {
      images,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Actualizar información de imagen (solo ADMIN o propietario)
   */
  async updateImage(
    id: string,
    data: Partial<{
      description: string;
      altText: string;
    }>,
    userId: string,
    isAdmin: boolean
  ): Promise<IImage | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID de imagen inválido');
    }

    const image = await Image.findById(id);
    
    if (!image) {
      throw new Error('Imagen no encontrada');
    }

    // Verificar permisos
    if (!isAdmin && image.uploadedBy.toString() !== userId) {
      throw new Error('No tienes permiso para actualizar esta imagen');
    }

    return await Image.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('uploadedBy', 'username email');
  }

  /**
   * Eliminar una imagen (solo ADMIN o el usuario que la subió)
   */
  async deleteImage(id: string, userId: string, isAdmin: boolean): Promise<IImage | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID de imagen inválido');
    }

    const image = await Image.findById(id);
    
    if (!image) {
      throw new Error('Imagen no encontrada');
    }

    // Verificar permisos
    if (!isAdmin && image.uploadedBy.toString() !== userId) {
      throw new Error('No tienes permiso para eliminar esta imagen');
    }

    return await Image.findByIdAndDelete(id);
  }
}

export default new ImageService();
