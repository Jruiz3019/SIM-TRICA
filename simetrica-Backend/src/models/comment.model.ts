import { Schema, model, Document, Types } from 'mongoose';

export interface IReaction {
  userId: Types.ObjectId;
  type: 'like' | 'dislike';
}

export interface IComment extends Document {
  autor: Schema.Types.ObjectId;
  contenido: string;
  reactions: IReaction[];
  likes: number;
  dislikes: number;
  publicacionTipo: 'Project' | 'Design';
  publicacionId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const reactionSchema = new Schema<IReaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['like', 'dislike'],
      required: true,
    },
  },
  { _id: false }
);

const commentSchema = new Schema<IComment>(
  {
    autor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El autor es requerido'],
    },
    contenido: {
      type: String,
      required: [true, 'El contenido es requerido'],
      trim: true,
      maxlength: [1000, 'El comentario no puede exceder 1000 caracteres'],
    },
    reactions: [reactionSchema],
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    publicacionTipo: {
      type: String,
      required: true,
      enum: ['Project', 'Design'],
    },
    publicacionId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'publicacionTipo',
    },
  },
  {
    timestamps: true,
  }
);

// Índice compuesto para consultas eficientes
commentSchema.index({ publicacionTipo: 1, publicacionId: 1, createdAt: -1 });

export default model<IComment>('Comment', commentSchema);
