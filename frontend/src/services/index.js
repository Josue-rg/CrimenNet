import api from './api';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const caseService = {
  getAll: async () => {
    const response = await api.get('/cases/');
    return response.data;
  },
  getOne: async (id) => {
    const response = await api.get(`/cases/${id}`);
    return response.data;
  },
  getSuspects: async (id) => {
    const response = await api.get(`/cases/${id}/suspects`);
    return response.data;
  },
  getTimeline: async (id) => {
    const response = await api.get(`/timeline/case/${id}`);
    return response.data;
  },
  getEvidence: async (id) => {
    const response = await api.get(`/evidence/case/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/cases/', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/cases/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/cases/${id}`);
  }
};

export const suspectService = {
  getAll: async () => {
    const response = await api.get('/suspects/');
    return response.data;
  },
  getOne: async (id) => {
    const response = await api.get(`/suspects/${id}`);
    return response.data;
  },
  getInterrogations: async (id) => {
    const response = await api.get(`/interrogations/suspect/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/suspects/', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/suspects/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/suspects/${id}`);
  }
};

export const evidenceService = {
  getByCase: async (caseId) => {
    const response = await api.get(`/evidence/case/${caseId}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/evidence/', data);
    return response.data;
  },
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload/evidence', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

export const interrogationService = {
  getAll: async () => {
    const response = await api.get('/interrogations/');
    return response.data;
  },
  getOne: async (id) => {
    const response = await api.get(`/interrogations/${id}`);
    return response.data;
  },
  getBySuspect: async (suspectId) => {
    const response = await api.get(`/interrogations/suspect/${suspectId}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/interrogations/', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/interrogations/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/interrogations/${id}`);
  }
};
