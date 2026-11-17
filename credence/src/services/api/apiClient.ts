import axios from 'axios'
import { attachApiInterceptors } from './interceptors.ts'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://credence-back-end.onrender.com',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

attachApiInterceptors(apiClient)
