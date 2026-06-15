import api from './axios'

export const companyApi = {
  createCompany: (data) => api.post('/companies', data),
  getCompany: (id) => api.get(`/companies/${id}`),
  updateCompany: (id, data) => api.put(`/companies/${id}`, data),
  getMyCompany: () => api.get('/companies/my'),
  uploadLogo: (id, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/companies/${id}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
