import { Schema, model, Document } from 'mongoose';

export enum JobStatusEnum {
  PRIORITY = 'PRIORITY',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum JobModalityEnum {
  PRESENCIAL = 'PRESENCIAL',
  REMOTO = 'REMOTO',
  HIBRIDO = 'HIBRIDO',
}

export enum JobTypeEnum {
  TIEMPO_COMPLETO = 'TIEMPO_COMPLETO',
  CONTRATO = 'CONTRATO',
}

export interface IJob extends Document {
  cargo: string;
  ciudad: string;
  modalidad: JobModalityEnum;
  tipo: JobTypeEnum;
  descripcion: string;
  skills: string[];
  status: JobStatusEnum;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    cargo: {
      type: String,
      required: [true, 'El cargo es requerido'],
      trim: true,
      minlength: [3, 'El cargo debe tener al menos 3 caracteres'],
      maxlength: [100, 'El cargo no puede exceder 100 caracteres'],
      index: true,
    },
    ciudad: {
      type: String,
      required: [true, 'La ciudad es requerida'],
      trim: true,
      index: true,
    },
    modalidad: {
      type: String,
      enum: {
        values: Object.values(JobModalityEnum),
        message: 'Modalidad inválida',
      },
      required: [true, 'La modalidad es requerida'],
      index: true,
    },
    tipo: {
      type: String,
      enum: {
        values: Object.values(JobTypeEnum),
        message: 'Tipo de contrato inválido',
      },
      required: [true, 'El tipo de contrato es requerido'],
      index: true,
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es requerida'],
      trim: true,
      minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
      maxlength: [2000, 'La descripción no puede exceder 2000 caracteres'],
    },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: function (skills: string[]) {
          return skills.length <= 10;
        },
        message: 'Máximo 10 habilidades',
      },
    },
    status: {
      type: String,
      enum: {
        values: Object.values(JobStatusEnum),
        message: 'Estado inválido',
      },
      default: JobStatusEnum.OPEN,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ ciudad: 1, modalidad: 1, tipo: 1 });

const Job = model<IJob>('Job', jobSchema, 'jobs');

export default Job;
