import api from './api';

const issueService = {
  // Get all issues with filters
  getIssues: async (params = {}) => {
    try {
      const response = await api.get('/issues', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single issue
  getIssueById: async (id) => {
    try {
      const response = await api.get(`/issues/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new issue
  createIssue: async (formData) => {
    try {
      const response = await api.post('/issues', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update issue
  updateIssue: async (id, formData) => {
    try {
      const response = await api.put(`/issues/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete issue
  deleteIssue: async (id) => {
    try {
      const response = await api.delete(`/issues/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add comment
  addComment: async (id, comment) => {
    try {
      const response = await api.post(`/issues/${id}/comment`, comment);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ⭐ ⭐ LIKE COMMENT (VERY IMPORTANT)
  likeComment: async (commentId) => {
    try {
      const response = await api.post(`/issues/comments/${commentId}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Upvote issue
  upvoteIssue: async (id) => {
    try {
      const response = await api.post(`/issues/${id}/upvote`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's issues
  getUserIssues: async () => {
    try {
      const response = await api.get('/issues/user/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get nearby issues
  getNearbyIssues: async (lat, lng, distance = 5000) => {
    try {
      const response = await api.get('/issues', {
        params: {
          latitude: lat,
          longitude: lng,
          maxDistance: distance,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default issueService;