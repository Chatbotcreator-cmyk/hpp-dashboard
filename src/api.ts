import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const hppApi = {
  getPlants: () => api.get('/plants').then(res => res.data),
  addPlant: (data: any) => api.post('/plants', data).then(res => res.data),
  deletePlant: (id: number) => api.delete(`/plants/${id}`).then(res => res.data),
  getProduction: () => api.get('/production').then(res => res.data),
};