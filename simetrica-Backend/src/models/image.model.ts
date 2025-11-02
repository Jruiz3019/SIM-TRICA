import { Schema, model, Document } from 'mongoose';

export interface IImage extends Document {
  url: string;
  filename: string;
  description?: string;
  altText?: string;
  size: number; // Tamaño en bytes
  mimeType: string;
  uploadedBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const imageSchema = new Schema<IImage>(
  {
    url: {
      type: String,
      required: [true, 'La URL de la imagen es requerida'],
      trim: true,
    },
    filename: {
      type: String,
      required: [true, 'El nombre del archivo es requerido'],
      trim: true,
      maxlength: [255, 'El nombre del archivo no puede exceder 255 caracteres'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripción no puede exceder 500 caracteres'],
    },
    altText: {
      type: String,
      trim: true,
      maxlength: [200, 'El texto alternativo no puede exceder 200 caracteres'],
    },
    size: {
      type: Number,
      required: [true, 'El tamaño del archivo es requerido'],
      min: [0, 'El tamaño no puede ser negativo'],
      max: [10485760, 'El tamaño no puede exceder 10MB'], // 10MB
    },
    mimeType: {
      type: String,
      required: true,
      enum: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IImage>('Image', imageSchema);
