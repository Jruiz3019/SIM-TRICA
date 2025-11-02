// src/services/contactService.ts
import axios from 'axios';
import type { ContactFormData } from '../components/ContactForm/ContactForm';

const API_URL = 'http://localhost:3000/api';

interface ContactResponse {
  success: boolean;
  message: string;
}

/**
 * Envía los datos del formulario de contacto al backend
 */
export async function sendContact(data: ContactFormData): Promise<ContactResponse> {
  try {
    const response = await axios.post<ContactResponse>(
      `${API_URL}/contact`,
      {
        fullName: data.name.trim(),
        email: data.email.trim(),
        subject: data.subject?.trim() || '',
        phone: data.phone?.trim() || '',
        message: data.message.trim(),
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Error al enviar el mensaje';
      throw new Error(errorMessage);
    }
    throw new Error('Error de conexión con el servidor');
  }
}