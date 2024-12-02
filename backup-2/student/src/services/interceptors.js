import axios from "axios";
import { createAxiosInstance, requestConfig } from "../utils/Constants";
const apiEndPoint = process.env.REACT_APP_BASE_URL;

const axiosInstance = createAxiosInstance(apiEndPoint);

requestConfig(axiosInstance);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401) {
      if (error.response.data.errorCode === "e402") {
        //access token expire
        originalRequest._retry = true;
        const accessToken = await refreshAccessToken();
        axiosInstance.defaults.headers.common["Authorization"] =
          "Bearer " + accessToken;
        return axiosAdminPrivate(originalRequest);
      } else if (error.response.data.errorCode === "e403") {
        //access invalid
        alert("Something went wrong! Please login again");
        localStorage.clear();
        window.location.replace("/");
      } else {
        localStorage.clear();
        alert("Authentication failed,Please login to continue");
        window.location.replace("/");
      }
    }
    return Promise.reject(error);
  }
);

const refreshAccessToken = async () => {
  const accessToken = localStorage.getItem("accessToken");
  console.log(accessToken);
  const refreshToken = localStorage.getItem("refreshToken");
  const data = { refresh: refreshToken };
  try {
    const response = await axios.post(apiEndPoint + "admin/login/refresh", data);

    const accessToken = response?.data?.accessToken;
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (err) {
    localStorage.clear();
    if (err.response.data.errorCode === "e405") {
      //refresh token invalid or expired when creating access token using refresh token
      alert("Session expired! Please login to continue");
      window.location.replace("/");
    } else if (err.response.data.errorCode === "e404")  {
      //refresh token required e404
      alert("Something went wrong! Please login");
      window.location.replace("/");
    } else{
      alert("Unable to process the request please login");
      window.location.replace("/");
    }
  }
};

const axiosAdminPrivate = axiosInstance;

export { axiosAdminPrivate };
