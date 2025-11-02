import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface ProjectPhoto {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  uploadedAt?: Date;
}

export interface WorkWithUsFormData {
  // Información personal
  fullName: string;
  identificationNumber: string;
  contactNumber: string;
  birthDate: string;
  email: string;
  
  // Ubicación
  department: string;
  municipality: string;
  
  // Información profesional
  specialties: string[];
  otherSpecialtyDetail?: string;
  experienceLevel: string;
  hasCertifications: boolean;
  availability: string;
  completedProjectsRange: string;
  constructionExperienceDescription?: string;
  
  // Proyectos
  projectPhotos?: ProjectPhoto[];
  
  // Referencias
  references: {
    name: string;
    phone: string;
    relationship?: string;
  }[];
  
  // Comentarios adicionales
  additionalComments?: string;
}

/**
 * Envía la aplicación de trabajo al backend
 */
export const submitWorkApplication = async (data: WorkWithUsFormData): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('=== DATOS A ENVIAR ===', JSON.stringify(data, null, 2));
    const response = await axios.post(`${API_URL}/work-with-us`, data);
    console.log('=== RESPUESTA EXITOSA ===', response.data);
    return {
      success: true,
      message: response.data.message || 'Aplicación enviada exitosamente'
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('=== ERROR AXIOS ===');
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Errores:', error.response?.data?.errors);
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.join(', ') || 'Error al enviar la aplicación';
      return {
        success: false,
        message: errorMessage
      };
    }
    console.error('=== ERROR INESPERADO ===', error);
    return {
      success: false,
      message: 'Error inesperado al enviar la aplicación'
    };
  }
};
