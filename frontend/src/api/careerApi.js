import apiClient from './apiClient';

export const careerApi = {
  // Public Candidate Methods
  getActiveJobs: async () => {
    const response = await apiClient.get('/careers/jobs');
    return response.data;
  },

  applyForJob: async (formData) => {
    const response = await apiClient.post('/careers/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  trackApplication: async (applicationId) => {
    const response = await apiClient.get(`/careers/track/${encodeURIComponent(String(applicationId).trim())}`);
    return response.data;
  },

  // Admin Job Opening Management
  getAdminJobs: async () => {
    const response = await apiClient.get('/careers/admin/jobs');
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await apiClient.post('/careers/admin/jobs', jobData);
    return response.data;
  },

  toggleJobStatus: async (id) => {
    const response = await apiClient.patch(`/careers/admin/jobs/${id}/toggle`);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await apiClient.delete(`/careers/admin/jobs/${id}`);
    return response.data;
  },

  // Admin Candidate Application Management
  getApplications: async (status = 'all', search = '') => {
    const params = {};
    if (status && status !== 'all') params.status = status;
    if (search && search.trim()) params.search = search.trim();
    const response = await apiClient.get('/careers/applications', { params });
    return response.data;
  },

  updateApplicationStatus: async (id, status, adminNotes) => {
    const response = await apiClient.patch(`/careers/applications/${id}/status`, {
      status,
      adminNotes,
    });
    return response.data;
  },

  deleteApplication: async (id) => {
    const response = await apiClient.delete(`/careers/applications/${id}`);
    return response.data;
  },

  // Generate verified resume viewing / download URL
  getResumeViewUrl: (appId, rawResumeUrl) => {
    const isLocalhost =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1');

    const apiBase = isLocalhost
      ? (import.meta.env.VITE_LOCAL_API_URL || 'http://localhost:5000')
      : (import.meta.env.VITE_API_URL || 'http://localhost:5000');

    const token = localStorage.getItem('token');
    const tokenQuery = token ? `?token=${encodeURIComponent(token)}` : '';

    if (appId) {
      return `${apiBase}/api/careers/applications/${appId}/resume${tokenQuery}`;
    }

    if (rawResumeUrl && rawResumeUrl.startsWith('/uploads')) {
      return `${apiBase}${rawResumeUrl}`;
    }

    return rawResumeUrl || '#';
  },
};
