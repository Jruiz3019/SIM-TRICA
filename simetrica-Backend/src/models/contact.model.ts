import { Schema, model, Document } from 'mongoose';

// Enums
export enum ContactStatusEnum {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  ARCHIVED = 'ARCHIVED',
}

// Interface para el documento de Contact
export interface IContact extends Document {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactStatusEnum;
  ipAddress?: string;
  userAgent?: string;
  isRead: boolean;
  readAt?: Date;
  assignedTo?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema con validaciones mejoradas
const contactSchema = new Schema<IContact>(
  {
    fullName: {
      type: String,
      required: [true, 'El nombre completo es requerido'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
      index: true,
    },
    email: {
      type: String,
      required: [true, 'El correo electrónico es requerido'],
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Por favor ingrese un correo electrónico válido',
      ],
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'El número de teléfono es requerido'],
      trim: true,
      match: [
        /^(\+57)?[0-9]{10}$/,
        'Por favor ingrese un número de teléfono válido (10 dígitos)',
      ],
    },
    subject: {
      type: String,
      required: [true, 'El asunto es requerido'],
      trim: true,
      minlength: [5, 'El asunto debe tener al menos 5 caracteres'],
      maxlength: [200, 'El asunto no puede exceder 200 caracteres'],
      index: true,
    },
    message: {
      type: String,
      required: [true, 'El mensaje es requerido'],
      trim: true,
      minlength: [10, 'El mensaje debe tener al menos 10 caracteres'],
      maxlength: [2000, 'El mensaje no puede exceder 2000 caracteres'],
    },
    status: {
      type: String,
      enum: {
        values: Object.values(ContactStatusEnum),
        message: 'Estado inválido',
      },
      default: ContactStatusEnum.PENDING,
      index: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
    assignedTo: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Las notas no pueden exceder 1000 caracteres'],
    },
  },
  {
    timestamps: true,
    collection: 'contacts',
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        const { __v, ...rest } = ret;
        return rest;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Índices compuestos para mejorar rendimiento de consultas
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ isRead: 1, createdAt: -1 });

// Virtual para calcular tiempo transcurrido
contactSchema.virtual('timeElapsed').get(function (this: IContact) {
  const now = new Date();
  const diff = now.getTime() - this.createdAt.getTime();
  return Math.floor(diff / (1000 * 60 * 60)); // horas
});

// Middleware para actualizar readAt cuando isRead cambia a true
contactSchema.pre('save', function (next) {
  if (this.isModified('isRead') && this.isRead && !this.readAt) {
    this.readAt = new Date();
  }
  next();
});

// Método estático para obtener estadísticas
contactSchema.statics.getStats = async function () {
  return await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);
};

// Método de instancia para marcar como leído
contactSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

export default model<IContact>('Contact', contactSchema);
