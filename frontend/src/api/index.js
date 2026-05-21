import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  withCredentials: true
})

// src/api/index.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Якщо бекенд каже, що ми не авторизовані
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user'); // ОДНОЗНАЧНО ВИДАЛЯЄМО ЮЗЕРА!
      window.location.href = '/login'; // І тільки потім кидаємо на логін
    }
    return Promise.reject(error);
  }
);

export default api