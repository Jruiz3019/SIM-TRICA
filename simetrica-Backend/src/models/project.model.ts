import { Schema, model, Document, Types } from 'mongoose';

export interface IReaction {
  userId: Types.ObjectId;
  type: 'like' | 'dislike';
}

export interface IProject extends Document {
  nombre: string;
  cliente: string;
  descripcion: string;
  ubicacion: string;
  duracion: string;
  personasInvolucradas: number;
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

const projectSchema = new Schema<IProject>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del proyecto es requerido'],
      trim: true,
      maxlength: [200, 'El nombre no puede exceder 200 caracteres'],
    },
    cliente: {
      type: String,
      required: [true, 'El cliente es requerido'],
      trim: true,
      maxlength: [200, 'El nombre del cliente no puede exceder 200 caracteres'],
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es requerida'],
      maxlength: [2000, 'La descripción no puede exceder 2000 caracteres'],
    },
    ubicacion: {
      type: String,
      required: [true, 'La ubicación es requerida'],
      trim: true,
      maxlength: [200, 'La ubicación no puede exceder 200 caracteres'],
    },
    duracion: {
      type: String,
      required: [true, 'La duración es requerida'],
      trim: true,
      maxlength: [100, 'La duración no puede exceder 100 caracteres'],
    },
    personasInvolucradas: {
      type: Number,
      required: [true, 'El número de personas involucradas es requerido'],
      min: [1, 'Debe haber al menos 1 persona involucrada'],
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
projectSchema.index({ nombre: 'text', descripcion: 'text', cliente: 'text' });

export default model<IProject>('Project', projectSchema);
