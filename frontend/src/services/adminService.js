// // import api from './api';

// // const adminService = {
// //   // Get all issues (admin view)
// //   getAllIssues: async (params = {}) => {
// //     try {
// //       const response = await api.get('/admin/issues', { params });
// //       return response.data;
// //     } catch (error) {
// //       throw error.response?.data || error.message;
// //     }
// //   },

// //   // Update issue status
// //   updateStatus: async (id, status) => {
// //     try {
// //       const response = await api.put(`/admin/issues/${id}/status`, { status });
// //       return response.data;
// //     } catch (error) {
// //       throw error.response?.data || error.message;
// //     }
// //   },

// //   // Resolve issue with image
// //   resolveIssue: async (id, formData) => {
// //     try {
// //       const response = await api.put(`/admin/issues/${id}/resolve`, formData, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data',
// //         },
// //       });
// //       return response.data;
// //     } catch (error) {
// //       throw error.response?.data || error.message;
// //     }
// //   },

// //   // Delete any issue
// //   deleteIssue: async (id) => {
// //     try {
// //       const response = await api.delete(`/admin/issues/${id}`);
// //       return response.data;
// //     } catch (error) {
// //       throw error.response?.data || error.message;
// //     }
// //   },

// //   // Export issues as CSV
// //   exportIssues: async () => {
// //     try {
// //       const response = await api.get('/admin/export', {
// //         responseType: 'blob',
// //       });
      
// //       // Create download link
// //       const url = window.URL.createObjectURL(new Blob([response.data]));
// //       const link = document.createElement('a');
// //       link.href = url;
// //       link.setAttribute('download', `issues-export-${new Date().toISOString()}.csv`);
// //       document.body.appendChild(link);
// //       link.click();
// //       link.remove();
      
// //       return { success: true };
// //     } catch (error) {
// //       throw error.response?.data || error.message;
// //     }
// //   },

// //   // Get system statistics
// //   getStats: async () => {
// //     try {
// //       const response = await api.get('/admin/stats');
// //       return response.data;
// //     } catch (error) {
// //       throw error.response?.data || error.message;
// //     }
// //   },
// // };

// // export default adminService;



// import api from './api';

// const adminService = {
//   // Get all issues (admin view)
//   getAllIssues: async (params = {}) => {
//     try {
//       const response = await api.get('/admin/issues', { params });
//       return response.data;
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch issues';
//       throw new Error(errorMessage);
//     }
//   },

//   // Update issue status
//   updateStatus: async (id, status, comment = '') => {
//     try {
//       const response = await api.put(`/admin/issues/${id}/status`, { status, comment });
//       return response.data;
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to update status';
//       throw new Error(errorMessage);
//     }
//   },

//   // Resolve issue with image
//   resolveIssue: async (id, formData) => {
//     try {
//       const response = await api.put(`/admin/issues/${id}/resolve`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           // You can use this to show upload progress
//           console.log(`Upload progress: ${percentCompleted}%`);
//         }
//       });
//       return response.data;
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to resolve issue';
//       throw new Error(errorMessage);
//     }
//   },

//   // Delete any issue
//   deleteIssue: async (id) => {
//     try {
//       const response = await api.delete(`/admin/issues/${id}`);
//       return response.data;
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to delete issue';
//       throw new Error(errorMessage);
//     }
//   },

//   // Export issues as CSV
//   exportIssues: async (filters = {}) => {
//     try {
//       const response = await api.get('/admin/export', {
//         params: filters,
//         responseType: 'blob',
//       });
      
//       // Create download link
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       const filename = `issues-export-${new Date().toISOString().split('T')[0]}.csv`;
//       link.setAttribute('download', filename);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
      
//       return { success: true, filename };
//     } catch (error) {
//       // If error is blob, try to parse it
//       if (error.response?.data instanceof Blob) {
//         const text = await error.response.data.text();
//         try {
//           const json = JSON.parse(text);
//           throw new Error(json.message || 'Export failed');
//         } catch {
//           throw new Error('Export failed');
//         }
//       }
//       throw new Error(error.response?.data?.message || error.message || 'Export failed');
//     }
//   },

//   // Get system statistics
//   getStats: async (timeRange = 'all') => {
//     try {
//       const response = await api.get('/admin/stats', {
//         params: { timeRange }
//       });
//       return response.data;
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch statistics';
//       throw new Error(errorMessage);
//     }
//   },

//   // Bulk delete issues
//   bulkDeleteIssues: async (issueIds) => {
//     try {
//       const response = await api.post('/admin/issues/bulk/delete', { issueIds });
//       return response.data;
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || 'Bulk delete failed';
//       throw new Error(errorMessage);
//     }
//   },

//   // Bulk update status
//   bulkUpdateStatus: async (issueIds, status) => {
//     try {
//       const response = await api.post('/admin/issues/bulk/status', { issueIds, status });
//       return response.data;
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || 'Bulk update failed';
//       throw new Error(errorMessage);
//     }
//   },

//   // Get single issue details
//   getIssueDetails: async (id) => {
//     try {
//       const response = await api.get(`/admin/issues/${id}`);
//       return response.data;
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch issue details';
//       throw new Error(errorMessage);
//     }
//   }
// };

// export default adminService;


import api from './api';

const adminService = {
  // Get all issues (admin view)
  getAllIssues: async (params = {}) => {
    try {
      const response = await api.get('/admin/issues', { params });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch issues';
      throw new Error(errorMessage);
    }
  },

  // Update issue status
  updateStatus: async (id, statusData) => {
    try {
      // statusData should be { status: 'resolved', note: 'optional note' }
      const response = await api.put(`/admin/issues/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update status';
      throw new Error(errorMessage);
    }
  },

  // Resolve issue with image
  resolveIssue: async (id, formData) => {
    try {
      const response = await api.put(`/admin/issues/${id}/resolve`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to resolve issue';
      throw new Error(errorMessage);
    }
  },

  // Delete any issue
  deleteIssue: async (id) => {
    try {
      const response = await api.delete(`/admin/issues/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete issue';
      throw new Error(errorMessage);
    }
  },

  // Export issues as CSV
  exportIssues: async (filters = {}) => {
    try {
      const response = await api.get('/admin/export', {
        params: filters,
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = `issues-export-${new Date().toISOString().split('T')[0]}.csv`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, filename };
    } catch (error) {
      // If error is blob, try to parse it
      if (error.response?.data instanceof Blob) {
        const text = await error.response.data.text();
        try {
          const json = JSON.parse(text);
          throw new Error(json.message || 'Export failed');
        } catch {
          throw new Error('Export failed');
        }
      }
      throw new Error(error.response?.data?.message || error.message || 'Export failed');
    }
  },

  // Get system statistics
  getStats: async (timeRange = 'all') => {
    try {
      const response = await api.get('/admin/stats', {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch statistics';
      throw new Error(errorMessage);
    }
  },

  // Bulk delete issues
  bulkDeleteIssues: async (issueIds) => {
    try {
      const response = await api.post('/admin/issues/bulk/delete', { issueIds });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Bulk delete failed';
      throw new Error(errorMessage);
    }
  },

  // Bulk update status
  bulkUpdateStatus: async (issueIds, status) => {
    try {
      const response = await api.post('/admin/issues/bulk/status', { issueIds, status });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Bulk update failed';
      throw new Error(errorMessage);
    }
  },

  // Get single issue details
  getIssueDetails: async (id) => {
    try {
      const response = await api.get(`/admin/issues/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch issue details';
      throw new Error(errorMessage);
    }
  }
};

export default adminService;