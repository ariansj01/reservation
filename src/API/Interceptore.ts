import axios from "axios";

const api = axios.create({
    // baseURL : 'http://127.0.0.1:8080/api/v1/'
    // baseURL : 'https://reservation-1hm5.onrender.com/api/v1/' 
    baseURL : 'https://reservation-1-uaiz.onrender.com/api/v1/' 
    // baseURL : 'https://ariansj.ir/api/v1/'
}) 

// List of public routes that don't require authentication
// const publicRoutes = ['/login', '/register', '/verify_token' , '/usersuser/:email', '/verify-captcha', '/verification-email', '/send-verification-email'];
const publicRoutes = [''];

// Check if the current route is public
const isPublicRoute = (url: string) => {
    return publicRoutes.some(route => url.includes(route));
};

// استفاده از Request Interceptor برای اضافه کردن Authorization header
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('AccessToken');
      
      // If no token and not a public route, redirect to login
      if (!token && !isPublicRoute(config.url || '')) {
        window.location.href = '/login';
        return Promise.reject('No token found');
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers["Access-Control-Allow-Origin"] = '*';
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

// استفاده از Response Interceptor برای مدیریت خطاهای 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If it's a public route, don't handle 401
      if (isPublicRoute(originalRequest.url)) {
        return Promise.reject(error);
      }

      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const res = await api.post('/verify_token', {
            token: localStorage.getItem('RefreshToken'),
            email: localStorage.getItem('email')
          });
          if (res.status === 200) {
            const newToken = res.data.AccessToken;
            localStorage.setItem('AccessToken', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } else {
            // Clear all auth data and redirect to login
            localStorage.removeItem('AccessToken');
            localStorage.removeItem('RefreshToken');
            localStorage.removeItem('email');
            localStorage.removeItem('userRole');
            window.location.href = '/login';
            return Promise.reject(error);
          }
        } catch (refreshError) {
          // Clear all auth data and redirect to login
          localStorage.removeItem('AccessToken');
          localStorage.removeItem('RefreshToken');
          localStorage.removeItem('email');
          localStorage.removeItem('userRole');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
);

export default api;