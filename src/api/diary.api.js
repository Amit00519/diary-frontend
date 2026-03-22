import { apiClient } from './client'

export const diaryApi = {
  getAll:  ()        => apiClient.get('/entries').then((r) => r.data),
  getOne:  (id)      => apiClient.get(`/entries/${id}`).then((r) => r.data),
  create:  (data)    => apiClient.post('/entries', data).then((r) => r.data),
  update:  (id,data) => apiClient.put(`/entries/${id}`, data).then((r) => r.data),
  remove:  (id)      => apiClient.delete(`/entries/${id}`).then((r) => r.data),
  search:  (data)    => apiClient.post('/entries/search', data).then((r) => r.data),
}
