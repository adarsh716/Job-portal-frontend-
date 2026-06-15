import api from './axios'

export const authApi = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  register: (email, password, role) =>
    api.post('/auth/register', { email, password, role }),

  refreshToken: (token) =>
    api.post('/auth/refresh', { refreshToken: token }),
}
