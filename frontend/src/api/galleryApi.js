import apiClient from './apiClient';

export const galleryApi = {
  getGalleryItems: async () => {
    const response = await apiClient.get('/gallery');
    return response.data;
  },

  addGalleryItem: async (formData) => {
    const response = await apiClient.post('/gallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateGalleryItem: async (id, formData) => {
    const response = await apiClient.put(`/gallery/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteGalleryItem: async (id) => {
    const response = await apiClient.delete(`/gallery/${id}`);
    return response.data;
  },
};
