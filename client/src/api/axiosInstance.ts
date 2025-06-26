import axios from "axios";

const axiosInstance = axios.create({
    // baseURL: "http://localhost:3300/api",
    baseURL: "https://www.scrumx.space/api",
    withCredentials: true,
});

export default axiosInstance;
