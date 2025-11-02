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
  publicacionId: string;
  publicacionTipo: 'Project' | 'Design';
  likes: number;
  dislikes: number;
  reactions: Array<{
    userId: string;
    type: 'like' | 'dislike';
  }>;
  createdAt: string;
  updatedAt: string;
}

interface CommentListResponse {
  success: boolean;
  comments: Comment[];
  total: number;
  page: number;
  totalPages: number;
}

interface CommentResponse {
  success: boolean;
  data: Comment;
}

class CommentService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getDesignComments(designId: string, page: number = 1, limit: number = 20): Promise<CommentListResponse> {
    const response = await axios.get(`${API_URL}/comments/design/${designId}?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getProjectComments(projectId: string, page: number = 1, limit: number = 20): Promise<CommentListResponse> {
    const response = await axios.get(`${API_URL}/comments/project/${projectId}?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async createDesignComment(designId: string, content: string): Promise<CommentResponse> {
    const response = await axios.post(
      `${API_URL}/comments/design/${designId}`,
      { content },
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async createProjectComment(projectId: string, content: string): Promise<CommentResponse> {
    const response = await axios.post(
      `${API_URL}/comments/project/${projectId}`,
      { content },
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async updateComment(commentId: string, content: string): Promise<CommentResponse> {
    const response = await axios.put(
      `${API_URL}/comments/${commentId}`,
      { content },
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async deleteComment(commentId: string): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete(`${API_URL}/comments/${commentId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async reactToComment(commentId: string, type: 'like' | 'dislike'): Promise<CommentResponse> {
    const response = await axios.post(
      `${API_URL}/comments/${commentId}/react`,
      { type },
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  getUserReaction(comment: Comment, userId: string | null): 'like' | 'dislike' | null {
    if (!userId) return null;
    const reaction = comment.reactions.find(r => r.userId === userId);
    return reaction ? reaction.type : null;
  }
}

export default new CommentService();
