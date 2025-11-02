export const ContactStatusEnum = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type ContactStatus = typeof ContactStatusEnum[keyof typeof ContactStatusEnum];

export interface Contact {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactStatus;
  ipAddress?: string;
  userAgent?: string;
  isRead: boolean;
  readAt?: string;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactListResponse {
  success: boolean;
  data: Contact[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
