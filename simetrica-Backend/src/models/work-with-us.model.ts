import { Schema, model, Document, Types } from 'mongoose';

// Enums
export enum SpecialtyEnum {
  OBRA_NEGRA = 'OBRA_NEGRA',
  OBRA_BLANCA = 'OBRA_BLANCA',
  CARPINTERIA = 'CARPINTERIA',
  ELECTRICIDAD = 'ELECTRICIDAD',
  PLOMERIA = 'PLOMERIA',
  ESTRUCTURAS_METALICAS = 'ESTRUCTURAS_METALICAS',
  OTRO = 'OTRO',
}

export enum ExperienceEnum {
  LESS_THAN_ONE = 'LESS_THAN_ONE',
  ONE_TO_THREE = 'ONE_TO_THREE',
  THREE_TO_FIVE = 'THREE_TO_FIVE',
  FIVE_TO_TEN = 'FIVE_TO_TEN',
  MORE_THAN_TEN = 'MORE_THAN_TEN',
}

export enum AvailabilityEnum {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  WEEKENDS = 'WEEKENDS',
  CONTRACT = 'CONTRACT',
}

export enum ProjectsRangeEnum {
  ZERO_FIVE = '0_5',
  FIVE_TEN = '5_10',
  TEN_TWENTY = '10_20',
  TWENTY_THIRTY = '20_30',
  THIRTY_THIRTYFIVE = '30_35',
  MORE_THAN_THIRTYFIVE = 'MORE_THAN_35',
}

export enum ApplicationStatusEnum {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CONTACTED = 'CONTACTED',
  ARCHIVED = 'ARCHIVED',
}

// Sub-schemas
interface IReference {
  name: string;
  phone: string;
  relationship?: string;
}

interface IProjectPhoto {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
}

// Interface principal
export interface IWorkWithUs extends Document {
  // Información personal
  fullName: string;
  identificationNumber: string;
  contactNumber: string;
  birthDate: Date;
  email: string;
  
  // Ubicación
  department: string;
  municipality: string;
  
  // Información profesional
  specialties: SpecialtyEnum[];
  otherSpecialtyDetail?: string;
  experienceLevel: ExperienceEnum;
  hasCertifications: boolean;
  availability: AvailabilityEnum;
  completedProjectsRange: ProjectsRangeEnum;
  constructionExperienceDescription?: string;
  
  // Archivos y referencias
  projectPhotos: IProjectPhoto[];
  references: IReference[];
  
  // Información administrativa
  status: ApplicationStatusEnum;
  applicationScore?: number;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  additionalComments?: string;
  
  // Metadata
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Sub-schema para fotos de proyectos
const projectPhotoSchema = new Schema<IProjectPhoto>(
  {
    url: {
      type: String,
      required: [true, 'La URL de la foto es requerida'],
      trim: true,
    },
    filename: {
      type: String,
      required: [true, 'El nombre del archivo es requerido'],
      trim: true,
    },
    mimeType: {
      type: String,
      required: [true, 'El tipo MIME es requerido'],
      enum: {
        values: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        message: 'Formato de imagen no válido',
      },
    },
    size: {
      type: Number,
      required: [true, 'El tamaño del archivo es requerido'],
      max: [5242880, 'El archivo no puede superar 5MB'], // 5MB
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Sub-schema para referencias
const referenceSchema = new Schema<IReference>(
  {
    name: {
      type: String,
      required: [true, 'El nombre de la referencia es requerido'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    phone: {
      type: String,
      required: [true, 'El teléfono de la referencia es requerido'],
      trim: true,
      match: [
        /^(\+57)?[0-9]{10}$/,
        'Por favor ingrese un número de teléfono válido',
      ],
    },
    relationship: {
      type: String,
      trim: true,
      maxlength: [100, 'La relación no puede exceder 100 caracteres'],
    },
  },
  { _id: false }
);

// Schema principal
const workWithUsSchema = new Schema<IWorkWithUs>(
  {
    // Información personal
    fullName: {
      type: String,
      required: [true, 'El nombre completo es requerido'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
      index: true,
    },
    identificationNumber: {
      type: String,
      required: [true, 'El número de identificación es requerido'],
      trim: true,
      unique: true,
      minlength: [7, 'La identificación debe tener al menos 7 dígitos'],
      maxlength: [10, 'La identificación no puede exceder 10 dígitos'],
      match: [/^[0-9]+$/, 'La identificación solo debe contener números'],
      index: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'El número de contacto es requerido'],
      trim: true,
      match: [
        /^(\+57)?[0-9]{10}$/,
        'Por favor ingrese un número de teléfono válido (10 dígitos)',
      ],
    },
    birthDate: {
      type: Date,
      required: [true, 'La fecha de nacimiento es requerida'],
      validate: {
        validator: function (value: Date) {
          const age = new Date().getFullYear() - value.getFullYear();
          return age >= 18 && age <= 70;
        },
        message: 'El aplicante debe tener entre 18 y 70 años',
      },
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
    
    // Ubicación
    department: {
      type: String,
      required: [true, 'El departamento es requerido'],
      trim: true,
      index: true,
    },
    municipality: {
      type: String,
      required: [true, 'El municipio es requerido'],
      trim: true,
      index: true,
    },
    
    // Información profesional
    specialties: {
      type: [String],
      enum: {
        values: Object.values(SpecialtyEnum),
        message: 'Especialidad inválida',
      },
      required: [true, 'Debe seleccionar al menos una especialidad'],
      validate: {
        validator: function (value: string[]) {
          return value.length > 0 && value.length <= 7;
        },
        message: 'Debe seleccionar entre 1 y 7 especialidades',
      },
    },
    otherSpecialtyDetail: {
      type: String,
      trim: true,
      maxlength: [200, 'El detalle no puede exceder 200 caracteres'],
      validate: {
        validator: function (this: IWorkWithUs, value: string) {
          // Required if "OTRO" is selected
          if (this.specialties.includes(SpecialtyEnum.OTRO)) {
            return !!value && value.length > 0;
          }
          return true;
        },
        message: 'Debe especificar la otra especialidad',
      },
    },
    experienceLevel: {
      type: String,
      enum: {
        values: Object.values(ExperienceEnum),
        message: 'Nivel de experiencia inválido',
      },
      required: [true, 'El nivel de experiencia es requerido'],
      index: true,
    },
    hasCertifications: {
      type: Boolean,
      required: [true, 'Debe indicar si tiene certificaciones'],
      default: false,
    },
    availability: {
      type: String,
      enum: {
        values: Object.values(AvailabilityEnum),
        message: 'Disponibilidad inválida',
      },
      required: [true, 'La disponibilidad es requerida'],
      index: true,
    },
    completedProjectsRange: {
      type: String,
      enum: {
        values: Object.values(ProjectsRangeEnum),
        message: 'Rango de proyectos inválido',
      },
      required: [true, 'El rango de proyectos completados es requerido'],
    },
    constructionExperienceDescription: {
      type: String,
      trim: true,
      maxlength: [200, 'La descripción no puede exceder 200 caracteres'],
    },
    
    // Archivos y referencias
    projectPhotos: {
      type: [projectPhotoSchema],
      validate: {
        validator: function (value: IProjectPhoto[]) {
          return value.length <= 10;
        },
        message: 'No puede subir más de 10 fotos',
      },
    },
    references: {
      type: [referenceSchema],
      validate: {
        validator: function (value: IReference[]) {
          return value.length >= 1 && value.length <= 5;
        },
        message: 'Debe proporcionar entre 1 y 5 referencias',
      },
    },
    
    // Información administrativa
    status: {
      type: String,
      enum: {
        values: Object.values(ApplicationStatusEnum),
        message: 'Estado inválido',
      },
      default: ApplicationStatusEnum.PENDING,
      index: true,
    },
    applicationScore: {
      type: Number,
      min: [0, 'La puntuación no puede ser negativa'],
      max: [100, 'La puntuación no puede exceder 100'],
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
    additionalComments: {
      type: String,
      trim: true,
      maxlength: [200, 'Los comentarios no pueden exceder 200 caracteres'],
    },
    
    // Metadata
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'work_with_us_applications',
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        // Desestructurar para excluir campos sensibles
        const { __v, ipAddress, userAgent, ...rest } = ret;
        return rest;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Índices compuestos para optimizar consultas
workWithUsSchema.index({ status: 1, createdAt: -1 });
workWithUsSchema.index({ experienceLevel: 1, availability: 1 });
workWithUsSchema.index({ department: 1, municipality: 1 });
workWithUsSchema.index({ specialties: 1, experienceLevel: 1 });

// Virtual para calcular edad
workWithUsSchema.virtual('age').get(function (this: IWorkWithUs) {
  const today = new Date();
  const birthDate = new Date(this.birthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Virtual para calcular tiempo desde aplicación
workWithUsSchema.virtual('daysSinceApplication').get(function (this: IWorkWithUs) {
  const now = new Date();
  const diff = now.getTime() - this.createdAt.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
});

// Middleware pre-save para validaciones adicionales
workWithUsSchema.pre('save', function (next) {
  // Actualizar reviewedAt cuando cambia el estado
  if (this.isModified('status') && this.status !== ApplicationStatusEnum.PENDING && !this.reviewedAt) {
    this.reviewedAt = new Date();
  }
  
  next();
});

// Método estático para obtener estadísticas
workWithUsSchema.statics.getStats = async function () {
  return await this.aggregate([
    {
      $facet: {
        byStatus: [
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ],
        byExperience: [
          { $group: { _id: '$experienceLevel', count: { $sum: 1 } } },
        ],
        byLocation: [
          { $group: { _id: { department: '$department', municipality: '$municipality' }, count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ],
        bySpecialty: [
          { $unwind: '$specialties' },
          { $group: { _id: '$specialties', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
      },
    },
  ]);
};

// Método de instancia para cambiar estado
workWithUsSchema.methods.updateStatus = function (
  newStatus: ApplicationStatusEnum,
  reviewedBy?: string,
  notes?: string
) {
  this.status = newStatus;
  this.reviewedBy = reviewedBy;
  this.reviewedAt = new Date();
  if (notes) {
    this.reviewNotes = notes;
  }
  return this.save();
};

// Método de instancia para agregar foto
workWithUsSchema.methods.addProjectPhoto = function (photoData: IProjectPhoto) {
  if (this.projectPhotos.length >= 10) {
    throw new Error('No puede subir más de 10 fotos');
  }
  this.projectPhotos.push(photoData);
  return this.save();
};

export default model<IWorkWithUs>('WorkWithUs', workWithUsSchema);
