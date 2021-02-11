import axios from 'axios'

const BASE_URL =
  'https://kushal.parikh.sb.intern.monoxor.com:8080/data-services/crud/k8ti/proximity'

const axiosInstance = axios.create()
axiosInstance.defaults.baseURL = BASE_URL

export { axiosInstance }
