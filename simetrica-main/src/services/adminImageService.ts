import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface Image {
  _id: string;
  url: string;
  filename: string;
  description?: string;
  altText?: string;
  size: number;
  mimeType: string;
  uploadedBy: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ImageListResponse {
  success: boolean;
  images: Image[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ImageResponse {
  success: boolean;
  image: Image;
}

export interface ImageUploadData {
  url: string;
  filename: string;
  description?: string;
  altText?: string;
  size: number;
  mimeType: string;
}

class AdminImageService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  /**
   * Obtener todas las imágenes
   */
  async getAll(page: number = 1, limit: number = 20): Promise<ImageListResponse> {
    const response = await axios.get<ImageListResponse>(
      `${API_URL}/images?page=${page}&limit=${limit}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  /**
   * Obtener una imagen por ID
   */
  async getById(id: string): Promise<ImageResponse> {
    const response = await axios.get<ImageResponse>(
      `${API_URL}/images/${id}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  /**
   * Obtener mis imágenes
   */
  async getMyImages(page: number = 1, limit: number = 20): Promise<ImageListResponse> {
    const response = await axios.get<ImageListResponse>(
      `${API_URL}/images/user/me?page=${page}&limit=${limit}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  /**
   * Subir una nueva imagen desde URL o archivo
   */
  async upload(fileOrUrl: File | string, metadata: Partial<ImageUploadData>): Promise<ImageResponse> {
    let imageData: ImageUploadData;

    if (typeof fileOrUrl === 'string') {
      // Es una URL externa (Drive, imgur, etc.)
      imageData = {
        url: fileOrUrl,
        filename: metadata.filename || fileOrUrl.split('/').pop() || 'external-image',
        size: 0, // URL externa, tamaño desconocido
        mimeType: fileOrUrl.endsWith('.svg') ? 'image/svg+xml' : 'image/png',
        description: metadata.description,
        altText: metadata.altText,
      };
    } else {
      // Es un archivo - convertir a base64 para almacenar en MongoDB
      const base64 = await this.fileToBase64(fileOrUrl);
      
      imageData = {
        url: base64,
        filename: fileOrUrl.name,
        size: fileOrUrl.size,
        mimeType: fileOrUrl.type,
        description: metadata.description,
        altText: metadata.altText,
      };
    }

    const response = await axios.post<ImageResponse>(
      `${API_URL}/images`,
      imageData,
      this.getAuthHeaders()
    );
    return response.data;
  }

  /**
   * Convertir archivo a base64
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Actualizar metadata de una imagen
   */
  async update(id: string, data: Partial<ImageUploadData>): Promise<ImageResponse> {
    const response = await axios.put<ImageResponse>(
      `${API_URL}/images/${id}`,
      data,
      this.getAuthHeaders()
    );
    return response.data;
  }

  /**
   * Eliminar una imagen
   */
  async delete(id: string): Promise<boolean> {
    await axios.delete(`${API_URL}/images/${id}`, this.getAuthHeaders());
    return true;
  }
}

export default new AdminImageService();
