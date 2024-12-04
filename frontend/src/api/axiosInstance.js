// frontend/src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://ariakashs-marksheet-management-backend-5yy1.onrender.com/api',
});

/*Add a request interceptor to include the token -->  https://ariakashs-marksheet-management-backend-5yy1.onrender.com

http://localhost:8000 */
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
