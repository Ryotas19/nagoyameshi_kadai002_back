import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
});

axiosInstance.interceptors.request.use(config => {
    const authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;
    
    if (authTokens) {
        config.headers.Authorization = `Bearer ${authTokens.access}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default axiosInstance;
