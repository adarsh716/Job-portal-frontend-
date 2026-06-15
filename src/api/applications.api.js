import api from './axios'

export const applicationsApi = {
  apply: (jobId, data) => api.post(`/applications/${jobId}`, data),
  getMyApplications: () => api.get('/applications/my'),
  withdraw: (id) => api.put(`/applications/${id}/withdraw`),
  getJobApplicants: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
}
