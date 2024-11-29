import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://chat-app-backend-5es5.onrender.com/api/v1/user", // Update this to match your backend URL
  withCredentials: true, // Include cookies in requests
});

const axiosChatInstance = axios.create({
  baseURL: "https://chat-app-backend-5es5.onrender.com/api/v1/user", // Update this to match your backend URL
  withCredentials: true, // Include cookies in requests
});

export default {axiosInstance, axiosChatInstance};
