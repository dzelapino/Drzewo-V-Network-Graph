import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  withCredentials: true,
});

export default {
  install: (app) => {
    app.config.globalProperties.$axios = axiosInstance;
  },
};