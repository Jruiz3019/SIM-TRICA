import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface Comment {
  _id: string;
  contenido: string;
  autor: {
    _id: string;
    username: string;
    email: string;
  };
  publicacionTipo: 'Project' | 'Design';
  publicacionId: string;
  reactions: Array<{
    userId: string;
    type: 'like' | 'dislike';
  }>;
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommentListResponse {
  success: boolean;
  comments: Comment[];
  total: number;
  page: number;
  totalPages: number;
}

class AdminCommentService {
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
   * Obtener comentarios de un proyecto
   */
  async getProjectComments(projectId: string, page: number = 1, limit: number = 20): Promise<CommentListResponse> {
    const response = await axios.get<CommentListResponse>(
      `${API_URL}/comments/project/${projectId}?page=${page}&limit=${limit}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  /**
   * Obtener comentarios de un diseño
   */
  async getDesignComments(designId: string, page: number = 1, limit: number = 20): Promise<CommentListResponse> {
    const response = await axios.get<CommentListResponse>(
      `${API_URL}/comments/design/${designId}?page=${page}&limit=${limit}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  /**
   * Eliminar un comentario (solo ADMIN)
   */
  async delete(commentId: string): Promise<boolean> {
    await axios.delete(
      `${API_URL}/comments/${commentId}`,
      this.getAuthHeaders()
    );
    return true;
  }
}

export default new AdminCommentService();
