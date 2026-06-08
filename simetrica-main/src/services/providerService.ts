import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface ProviderFormData {
  empresa: string;
  contacto: string;
  email: string;
  telefono: string;
  categoria: string;
  descripcion: string;
  ciudad: string;
  acepto: boolean;
}

export const submitProviderRegistration = async (data: ProviderFormData): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.post(`${API_URL}/providers`, {
      nombre: data.empresa,
      contacto: data.contacto,
      email: data.email,
      telefono: data.telefono,
      categoria: data.categoria,
      descripcion: data.descripcion,
      ciudad: data.ciudad,
      acepto: data.acepto,
    });
    return {
      success: true,
      message: response.data.message || 'Registro enviado correctamente',
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.join(', ') || 'Error al enviar el registro';
      return {
        success: false,
        message: errorMessage,
      };
    }
    return {
      success: false,
      message: 'Error inesperado al enviar el registro',
    };
  }
};
