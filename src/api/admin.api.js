import api from './axios'

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: ({ page = 0, size = 20 } = {}) => api.get('/admin/users', { params: { page, size } }),
  setUserActive: (userId, active) =>
    active ? api.put(`/admin/users/${userId}/unban`) : api.put(`/admin/users/${userId}/ban`),
  getCompanies: ({ page = 0, size = 20 } = {}) => api.get('/admin/companies', { params: { page, size } }),
  verifyCompany: (id) => api.put(`/admin/companies/${id}/verify`),
  getAllJobs: ({ page = 0, size = 20 } = {}) => api.get('/admin/jobs', { params: { page, size } }),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
}
