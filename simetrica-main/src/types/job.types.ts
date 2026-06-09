export const JobStatusEnum = {
  PRIORITY: 'PRIORITY',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
} as const;

export type JobStatus = typeof JobStatusEnum[keyof typeof JobStatusEnum];

export const JobModalityEnum = {
  PRESENCIAL: 'PRESENCIAL',
  REMOTO: 'REMOTO',
  HIBRIDO: 'HIBRIDO',
} as const;

export type JobModality = typeof JobModalityEnum[keyof typeof JobModalityEnum];

export const JobTypeEnum = {
  TIEMPO_COMPLETO: 'TIEMPO_COMPLETO',
  CONTRATO: 'CONTRATO',
} as const;

export type JobType = typeof JobTypeEnum[keyof typeof JobTypeEnum];

export interface Job {
  _id: string;
  cargo: string;
  ciudad: string;
  modalidad: JobModality;
  tipo: JobType;
  descripcion: string;
  skills: string[];
  status: JobStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobListResponse {
  data: Job[];
  total: number;
  totalOpen?: number;
  totalPriority?: number;
  totalClosed?: number;
}

export interface JobAdminListResponse {
  data: Job[];
  total: number;
  page: number;
  totalPages: number;
}

export interface JobStatsResponse {
  totalActive: number;
  totalOpen: number;
  totalPriority: number;
  totalClosed: number;
  ciudades: number;
}
