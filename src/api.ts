import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const hppApi = {
  // READ: Get all plants
  getPlants: () => api.get('/plants').then(res => res.data),
  // CREATE: Add a new plant
  addPlant: (data: any) => api.post('/plants', data).then(res => res.data),
  // UPDATE: Update existing plant
  updatePlant: (id: number, data: any) => api.put(`/plants/${id}`, data).then(res => res.data),
  // DELETE: Remove a plant
  deletePlant: (id: number) => api.delete(`/plants/${id}`).then(res => res.data),
  // DATA: Get production metrics
  getProduction: () => api.get('/production').then(res => res.data),
};