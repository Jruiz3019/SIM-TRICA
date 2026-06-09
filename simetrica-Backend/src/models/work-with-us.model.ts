import { Schema, model, Document, Types } from 'mongoose';

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

export enum ProfessionalProfileEnum {
  ARQUITECTO = 'ARQUITECTO',
  INGENIERO = 'INGENIERO',
  ABOGADO = 'ABOGADO',
  ADMINISTRADOR = 'ADMINISTRADOR',
  TRABAJADOR_SOCIAL = 'TRABAJADOR_SOCIAL',
  TECNICO = 'TECNICO',
  CONSTRUCCION = 'CONSTRUCCION',
  OTRO = 'OTRO',
}

export enum ApplicationStatusEnum {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CONTACTED = 'CONTACTED',
  ARCHIVED = 'ARCHIVED',
}

export interface IWorkWithUs extends Document {
  fullName: string;
  identificationNumber: string;
  contactNumber: string;
  birthDate: Date;
  email: string;

  department: string;
  municipality: string;

  professionalProfile: ProfessionalProfileEnum;
  otherProfessionalProfileDetail?: string;
  specialties: SpecialtyEnum[];
  otherSpecialtyDetail?: string;
  skillsDescription?: string;
  experienceLevel: ExperienceEnum;
  hasCertifications: boolean;
  availability: AvailabilityEnum;

  status: ApplicationStatusEnum;
  applicationScore?: number;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;

  jobId?: Types.ObjectId;

  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const workWithUsSchema = new Schema<IWorkWithUs>(
  {
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

    professionalProfile: {
      type: String,
      enum: {
        values: Object.values(ProfessionalProfileEnum),
        message: 'Perfil profesional inválido',
      },
      required: [true, 'El perfil profesional es requerido'],
      index: true,
    },
    otherProfessionalProfileDetail: {
      type: String,
      trim: true,
      maxlength: [100, 'El detalle no puede exceder 100 caracteres'],
      validate: {
        validator: function (this: IWorkWithUs, value: string) {
          if (this.professionalProfile === ProfessionalProfileEnum.OTRO) {
            return !!value && value.length > 0;
          }
          return true;
        },
        message: 'Debe especificar el otro perfil profesional',
      },
    },
    specialties: {
      type: [String],
      enum: {
        values: Object.values(SpecialtyEnum),
        message: 'Especialidad inválida',
      },
      default: [],
      validate: {
        validator: function (this: IWorkWithUs, value: string[]) {
          if (this.professionalProfile === ProfessionalProfileEnum.CONSTRUCCION) {
            return value.length > 0 && value.length <= 7;
          }
          return true;
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
          if (this.specialties.includes(SpecialtyEnum.OTRO)) {
            return !!value && value.length > 0;
          }
          return true;
        },
        message: 'Debe especificar la otra especialidad',
      },
    },
    skillsDescription: {
      type: String,
      trim: true,
      maxlength: [150, 'La descripción no puede exceder 150 caracteres'],
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

    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      default: null,
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
        const { __v, ipAddress, userAgent, ...rest } = ret;
        return rest;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

workWithUsSchema.index({ status: 1, createdAt: -1 });
workWithUsSchema.index({ professionalProfile: 1, experienceLevel: 1 });
workWithUsSchema.index({ department: 1, municipality: 1 });
workWithUsSchema.index({ specialties: 1, experienceLevel: 1 });

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

workWithUsSchema.virtual('daysSinceApplication').get(function (this: IWorkWithUs) {
  const now = new Date();
  const diff = now.getTime() - this.createdAt.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
});

workWithUsSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status !== ApplicationStatusEnum.PENDING && !this.reviewedAt) {
    this.reviewedAt = new Date();
  }

  next();
});

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
        byProfessionalProfile: [
          { $group: { _id: '$professionalProfile', count: { $sum: 1 } } },
        ],
      },
    },
  ]);
};

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

export default model<IWorkWithUs>('WorkWithUs', workWithUsSchema);
