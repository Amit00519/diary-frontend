import axios from 'axios'
import { API_BASE_URL, STORAGE_KEY } from '../constants'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request
apiClient.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const auth = JSON.parse(raw)
      if (auth?.token) config.headers.Authorization = `Bearer ${auth.token}`
    }
  } catch { /* ignore */ }
  return config
})

// On 401 → clear storage and redirect to login
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEY)
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
