import { Schema, model, Document, Types } from 'mongoose';

export interface IReaction {
  userId: Types.ObjectId;
  type: 'like' | 'dislike';
}

export interface IDesign extends Document {
  nombre: string;
  descripcion: string;
  imagenes: Schema.Types.ObjectId[];
  reactions: IReaction[];
  likes: number;
  dislikes: number;
  createdBy: Schema.Types.ObjectId;
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

const designSchema = new Schema<IDesign>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del diseño es requerido'],
      trim: true,
      maxlength: [200, 'El nombre no puede exceder 200 caracteres'],
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es requerida'],
      maxlength: [2000, 'La descripción no puede exceder 2000 caracteres'],
    },
    imagenes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Image',
      },
    ],
    reactions: [reactionSchema],
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índice para búsquedas
designSchema.index({ nombre: 'text', descripcion: 'text' });

export default model<IDesign>('Design', designSchema);
