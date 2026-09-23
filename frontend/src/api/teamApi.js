import apiClient from './apiClient';

export const teamApi = {
  getTeamMembers: async () => {
    const response = await apiClient.get('/team');
    return response.data;
  },

  addTeamMember: async (formData) => {
    const response = await apiClient.post('/team', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateTeamMember: async (id, formData) => {
    const response = await apiClient.put(`/team/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteTeamMember: async (id) => {
    const response = await apiClient.delete(`/team/${id}`);
    return response.data;
  },
};
