import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface WorkWithUsFormData {
  fullName: string;
  identificationNumber: string;
  contactNumber: string;
  birthDate: string;
  email: string;

  department: string;
  municipality: string;

  professionalProfile: string;
  otherProfessionalProfileDetail?: string;
  specialties: string[];
  otherSpecialtyDetail?: string;
  skillsDescription?: string;
  experienceLevel: string;
  hasCertifications: boolean;
  availability: string;
  jobId?: string;
}

export const submitWorkApplication = async (data: WorkWithUsFormData): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.post(`${API_URL}/work-with-us`, data);
    return {
      success: true,
      message: response.data.message || 'Aplicación enviada exitosamente'
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.join(', ') || 'Error al enviar la aplicación';
      return {
        success: false,
        message: errorMessage
      };
    }
    return {
      success: false,
      message: 'Error inesperado al enviar la aplicación'
    };
  }
};
