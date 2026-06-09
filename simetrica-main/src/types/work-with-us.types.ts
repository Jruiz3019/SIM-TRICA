export const ApplicationStatusEnum = {
  PENDING: 'PENDING',
  REVIEWING: 'REVIEWING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CONTACTED: 'CONTACTED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type ApplicationStatus = typeof ApplicationStatusEnum[keyof typeof ApplicationStatusEnum];

export const ExperienceEnum = {
  LESS_THAN_ONE: 'LESS_THAN_ONE',
  ONE_TO_THREE: 'ONE_TO_THREE',
  THREE_TO_FIVE: 'THREE_TO_FIVE',
  FIVE_TO_TEN: 'FIVE_TO_TEN',
  MORE_THAN_TEN: 'MORE_THAN_TEN',
} as const;

export type Experience = typeof ExperienceEnum[keyof typeof ExperienceEnum];

export const AvailabilityEnum = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  WEEKENDS: 'WEEKENDS',
  CONTRACT: 'CONTRACT',
} as const;

export type Availability = typeof AvailabilityEnum[keyof typeof AvailabilityEnum];

export const SpecialtyEnum = {
  OBRA_NEGRA: 'OBRA_NEGRA',
  OBRA_BLANCA: 'OBRA_BLANCA',
  CARPINTERIA: 'CARPINTERIA',
  ELECTRICIDAD: 'ELECTRICIDAD',
  PLOMERIA: 'PLOMERIA',
  ESTRUCTURAS_METALICAS: 'ESTRUCTURAS_METALICAS',
  OTRO: 'OTRO',
} as const;

export type Specialty = typeof SpecialtyEnum[keyof typeof SpecialtyEnum];

export const ProfessionalProfileEnum = {
  ARQUITECTO: 'ARQUITECTO',
  INGENIERO: 'INGENIERO',
  ABOGADO: 'ABOGADO',
  ADMINISTRADOR: 'ADMINISTRADOR',
  TRABAJADOR_SOCIAL: 'TRABAJADOR_SOCIAL',
  TECNICO: 'TECNICO',
  CONSTRUCCION: 'CONSTRUCCION',
  OTRO: 'OTRO',
} as const;

export type ProfessionalProfile = typeof ProfessionalProfileEnum[keyof typeof ProfessionalProfileEnum];

export interface WorkWithUs {
  _id: string;
  fullName: string;
  identificationNumber: string;
  contactNumber: string;
  birthDate: string;
  email: string;
  department: string;
  municipality: string;
  professionalProfile: ProfessionalProfile;
  otherProfessionalProfileDetail?: string;
  specialties: Specialty[];
  otherSpecialtyDetail?: string;
  skillsDescription?: string;
  experienceLevel: Experience;
  hasCertifications: boolean;
  availability: Availability;
  status: ApplicationStatus;
  applicationScore?: number;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  jobId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkWithUsListResponse {
  success: boolean;
  data: WorkWithUs[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
