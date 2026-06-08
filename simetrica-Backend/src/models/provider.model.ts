import { Schema, model, Document } from 'mongoose';

export enum ProviderCategoryEnum {
  CARPINTERIA = 'CARPINTERIA',
  MATERIALES_ACUSTICOS = 'MATERIALES_ACUSTICOS',
  ESTRUCTURAS_METALICAS = 'ESTRUCTURAS_METALICAS',
  ELECTRICIDAD = 'ELECTRICIDAD',
  ACABADOS = 'ACABADOS',
  OTRO = 'OTRO',
}

export enum ProviderStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  REJECTED = 'REJECTED',
}

export interface IProvider extends Document {
  nombre: string;
  contacto: string;
  email: string;
  telefono: string;
  categoria: ProviderCategoryEnum;
  descripcion: string;
  ciudad: string;
  acepto: boolean;
  rating: number;
  verificado: boolean;
  fundacion?: string;
  proyectos: number;
  status: ProviderStatusEnum;
  ipAddress?: string;
  userAgent?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const providerSchema = new Schema<IProvider>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre de la empresa es requerido'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
      index: true,
    },
    contacto: {
      type: String,
      required: [true, 'El nombre de contacto es requerido'],
      trim: true,
      minlength: [3, 'El nombre de contacto debe tener al menos 3 caracteres'],
      maxlength: [100, 'El nombre de contacto no puede exceder 100 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El correo electrónico es requerido'],
      lowercase: true,
      trim: true,
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Por favor ingrese un correo electrónico válido',
      ],
      index: true,
    },
    telefono: {
      type: String,
      required: [true, 'El número de teléfono es requerido'],
      trim: true,
      match: [
        /^(\+57)?[0-9]{10}$/,
        'Por favor ingrese un número de teléfono válido (10 dígitos)',
      ],
    },
    categoria: {
      type: String,
      enum: {
        values: Object.values(ProviderCategoryEnum),
        message: 'Categoría inválida',
      },
      required: [true, 'La categoría es requerida'],
      index: true,
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción de servicios es requerida'],
      trim: true,
      minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
      maxlength: [2000, 'La descripción no puede exceder 2000 caracteres'],
    },
    ciudad: {
      type: String,
      required: [true, 'La ciudad es requerida'],
      trim: true,
      index: true,
      maxlength: [80, 'La ciudad no puede exceder 80 caracteres'],
    },
    acepto: {
      type: Boolean,
      required: [true, 'Debe aceptar los términos y condiciones'],
      validate: {
        validator: (value: boolean) => value === true,
        message: 'Debe aceptar los términos y condiciones para registrarse',
      },
    },
    rating: {
      type: Number,
      min: [1, 'La calificación mínima es 1'],
      max: [5, 'La calificación máxima es 5'],
      default: 1,
    },
    verificado: {
      type: Boolean,
      default: false,
    },
    fundacion: {
      type: String,
      trim: true,
      maxlength: [4, 'El año de fundación no puede exceder 4 dígitos'],
    },
    proyectos: {
      type: Number,
      min: [0, 'El número de proyectos no puede ser negativo'],
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(ProviderStatusEnum),
        message: 'Estado inválido',
      },
      default: ProviderStatusEnum.PENDING,
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
    reviewedBy: {
      type: String,
      trim: true,
    },
    reviewedAt: {
      type: Date,
    },
    reviewNotes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Las notas no pueden exceder 1000 caracteres'],
    },
  },
  {
    timestamps: true,
    collection: 'providers',
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        const { __v, ipAddress, userAgent, ...rest } = ret;
        return rest;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

providerSchema.index({ status: 1, createdAt: -1 });
providerSchema.index({ categoria: 1, status: 1 });
providerSchema.index({ ciudad: 1, categoria: 1 });
providerSchema.index({ rating: -1 });

providerSchema.virtual('daysSinceRegistration').get(function (this: IProvider) {
  const now = new Date();
  const diff = now.getTime() - this.createdAt.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
});

providerSchema.statics.getStats = async function () {
  return await this.aggregate([
    {
      $facet: {
        byStatus: [
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ],
        byCategory: [
          { $group: { _id: '$categoria', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        byCity: [
          { $group: { _id: '$ciudad', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ],
        overallTotals: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              totalVerificados: {
                $sum: { $cond: ['$verificado', 1, 0] },
              },
              avgRating: { $avg: '$rating' },
            },
          },
        ],
      },
    },
  ]);
};

export default model<IProvider>('Provider', providerSchema);
