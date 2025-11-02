import Comment from '../models/comment.model.js';
import type { IComment } from '../models/comment.model.js';
import Project from '../models/project.model.js';
import Design from '../models/design.model.js';
import { Types, Schema } from 'mongoose';

class CommentService {
  /**
   * Crear un comentario
   */
  async createComment(
    data: {
      contenido: string;
      publicacionTipo: 'Project' | 'Design';
      publicacionId: string;
    },
    userId: string
  ): Promise<IComment> {
    if (!Types.ObjectId.isValid(data.publicacionId)) {
      throw new Error('ID de publicación inválido');
    }

    // Verificar que la publicación existe
    if (data.publicacionTipo === 'Project') {
      const publicacion = await Project.findById(data.publicacionId);
      if (!publicacion) {
        throw new Error('Proyecto no encontrado');
      }
    } else {
      const publicacion = await Design.findById(data.publicacionId);
      if (!publicacion) {
        throw new Error('Diseño no encontrado');
      }
    }

    const comment = await Comment.create({
      ...data,
      autor: userId,
    });

    return await comment.populate('autor', 'username email');
  }

  /**
   * Obtener comentarios de una publicación (público)
   */
  async getCommentsByPublication(
    publicacionTipo: 'Project' | 'Design',
    publicacionId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    comments: IComment[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    if (!Types.ObjectId.isValid(publicacionId)) {
      throw new Error('ID de publicación inválido');
    }

    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comment.find({ publicacionTipo, publicacionId })
        .populate('autor', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Comment.countDocuments({ publicacionTipo, publicacionId }),
    ]);

    return {
      comments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtener un comentario por ID
   */
  async getCommentById(id: string): Promise<IComment | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID de comentario inválido');
    }

    return await Comment.findById(id).populate('autor', 'username email');
  }

  /**
   * Actualizar un comentario (solo el autor)
   */
  async updateComment(
    id: string,
    contenido: string,
    userId: string
  ): Promise<IComment | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID de comentario inválido');
    }

    const comment = await Comment.findById(id);
    
    if (!comment) {
      throw new Error('Comentario no encontrado');
    }

    // Verificar que el usuario es el autor
    if (comment.autor.toString() !== userId) {
      throw new Error('No tienes permiso para editar este comentario');
    }

    comment.contenido = contenido;
    await comment.save();

    return await comment.populate('autor', 'username email');
  }

  /**
   * Eliminar un comentario (autor o ADMIN)
   */
  async deleteComment(id: string, userId: string, isAdmin: boolean): Promise<IComment | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID de comentario inválido');
    }

    const comment = await Comment.findById(id);
    
    if (!comment) {
      throw new Error('Comentario no encontrado');
    }

    // Verificar permisos: autor o admin
    if (!isAdmin && comment.autor.toString() !== userId) {
      throw new Error('No tienes permiso para eliminar este comentario');
    }

    return await Comment.findByIdAndDelete(id);
  }

  /**
   * Reaccionar a un comentario (like/dislike)
   */
  async reactToComment(
    commentId: string,
    userId: string,
    type: 'like' | 'dislike'
  ): Promise<IComment | null> {
    if (!Types.ObjectId.isValid(commentId)) {
      throw new Error('ID de comentario inválido');
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error('Comentario no encontrado');
    }

    // Verificar si el usuario ya reaccionó
    const existingReactionIndex = comment.reactions.findIndex(
      (r) => r.userId.toString() === userId
    );

    if (existingReactionIndex !== -1) {
      const existingReaction = comment.reactions[existingReactionIndex];
      
      if (!existingReaction) {
        throw new Error('Error en la reacción');
      }

      // Si es la misma reacción, la eliminamos (toggle)
      if (existingReaction.type === type) {
        comment.reactions.splice(existingReactionIndex, 1);
        if (type === 'like') {
          comment.likes = Math.max(0, comment.likes - 1);
        } else {
          comment.dislikes = Math.max(0, comment.dislikes - 1);
        }
      } else {
        // Si es diferente, actualizamos
        const reaction = comment.reactions[existingReactionIndex];
        if (reaction) {
          reaction.type = type;
        }
        if (type === 'like') {
          comment.likes += 1;
          comment.dislikes = Math.max(0, comment.dislikes - 1);
        } else {
          comment.dislikes += 1;
          comment.likes = Math.max(0, comment.likes - 1);
        }
      }
    } else {
      // Nueva reacción
      comment.reactions.push({
        userId: new Types.ObjectId(userId),
        type,
      });
      if (type === 'like') {
        comment.likes += 1;
      } else {
        comment.dislikes += 1;
      }
    }

    await comment.save();
    return await comment.populate('autor', 'username email');
  }
}

export default new CommentService();
