import axios from "axios";
const createAxiosInstance = (apiEndPoint) =>{

    const axiosInstance = axios.create({
        baseURL: apiEndPoint,
        headers: {
            'Content-Type': 'application/json',
          },
      });

      return axiosInstance
}

const requestConfig = (axiosInstance) => {

    axiosInstance.interceptors.request.use(
        (config) => {
          const accessToken = localStorage.getItem('accessToken');
          if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

}
export {createAxiosInstance,requestConfig};