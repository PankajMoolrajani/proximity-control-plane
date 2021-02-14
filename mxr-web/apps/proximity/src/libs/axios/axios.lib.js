import axios from 'axios'

const BASE_URL =
  'https://kushal.parikh.sb.intern.monoxor.com:8080/data-services/crud/k8ti/proximity'

const BASE_URL_SERVICES = 'https://graphql-prod.monoxor.com'

const axiosInstance = axios.create()
axiosInstance.defaults.baseURL = BASE_URL
axiosInstance.CancelToken = axios.CancelToken
axiosInstance.isCancel = axios.isCancel

const axiosServiceInstance = axios.create()
axiosServiceInstance.defaults.baseURL = BASE_URL_SERVICES

export { axiosInstance, axiosServiceInstance }
