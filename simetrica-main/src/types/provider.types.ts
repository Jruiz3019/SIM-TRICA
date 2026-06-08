export const ProviderCategoryEnum = {
  CARPINTERIA: 'CARPINTERIA',
  MATERIALES_ACUSTICOS: 'MATERIALES_ACUSTICOS',
  ESTRUCTURAS_METALICAS: 'ESTRUCTURAS_METALICAS',
  ELECTRICIDAD: 'ELECTRICIDAD',
  ACABADOS: 'ACABADOS',
  OTRO: 'OTRO',
} as const;

export type ProviderCategory = typeof ProviderCategoryEnum[keyof typeof ProviderCategoryEnum];

export const ProviderStatusEnum = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  REJECTED: 'REJECTED',
} as const;

export type ProviderStatus = typeof ProviderStatusEnum[keyof typeof ProviderStatusEnum];

export interface Provider {
  _id: string;
  nombre: string;
  contacto: string;
  email: string;
  telefono: string;
  categoria: ProviderCategory;
  descripcion: string;
  ciudad: string;
  acepto: boolean;
  rating: number;
  verificado: boolean;
  fundacion?: string;
  proyectos: number;
  status: ProviderStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderListResponse {
  data: Provider[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProviderPublicListResponse {
  data: Provider[];
  categories: { _id: ProviderCategory; count: number }[];
  total: number;
}

export interface ProviderStatsResponse {
  byStatus: { _id: ProviderStatus; count: number }[];
  byCategory: { _id: ProviderCategory; count: number }[];
  byCity: { _id: string; count: number }[];
  overallTotals: {
    _id: null;
    total: number;
    totalVerificados: number;
    avgRating: number;
  }[];
}
