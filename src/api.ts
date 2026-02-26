import axios from 'axios';
import type { PowerPlant, WeeklyProduction } from './types';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const hppApi = {
  // Matches prefix="/plants" in your main.py
  getPlants: () => api.get<PowerPlant[]>('/plants').then(res => res.data),
  
  // Matches prefix="/production" in your main.py
  getProduction: () => api.get<WeeklyProduction[]>('/production').then(res => res.data),
};