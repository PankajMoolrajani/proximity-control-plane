import axios from 'axios'
import UserStore from '../../store/user.store'

const BASE_URL = 'https://kushal.parikh.sb.intern.monoxor.com:8080'

const axiosSecureInstance = axios.create()
axiosSecureInstance.defaults.baseURL = BASE_URL
axiosSecureInstance.interceptors.request.use((config) => {
  const token = UserStore.getAccessToken()
  config.headers.Authorization = token ? `Bearer ${token}` : ''
  return config
})

const axiosUnsecureInstance = axios.create()
axiosUnsecureInstance.defaults.baseURL = BASE_URL

export { axiosSecureInstance, axiosUnsecureInstance }
