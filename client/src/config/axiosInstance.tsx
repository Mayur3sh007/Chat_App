import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1/user", // Update this to match your backend URL
  withCredentials: true, // Include cookies in requests
});

const axiosChatInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1/user", // Update this to match your backend URL
  withCredentials: true, // Include cookies in requests
});

export default {axiosInstance, axiosChatInstance};
