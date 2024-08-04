import axios from 'axios'

export const axiosInstance = axios.create({
  // baseURL: 'https://api.rgcm.online/api/',
  baseURL: 'http://localhost:8800/api/',
})
