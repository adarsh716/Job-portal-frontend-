import api from './axios'

export const profileApi = {
  getMyProfile: () => api.get('/profile/me'),
  updateProfile: (data) => api.put('/profile/me', data),
  uploadResume: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/profile/me/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
