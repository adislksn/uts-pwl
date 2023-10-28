import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:  'http://localhost:6543',
  headers:{
    "Accept":"application/json, text/plain, /",
    "Content-Type": "multipart/form-data",
    "access-control-allow-origin": "http://localhost:6543"}

  // You can set your base URL and other config options here
});

// Add a request interceptor
axiosInstance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axiosInstance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

export default axiosInstance;