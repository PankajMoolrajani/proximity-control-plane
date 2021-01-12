import axios from 'axios'
import UserStore from '../../store/user.store'

const axiosSecureInstance = axios.create()

axiosSecureInstance.defaults.baseURL =
  'https://kushal.parikh.sb.intern.monoxor.com:8080'

axiosSecureInstance.interceptors.request.use((config) => {
  const token = UserStore.getAccessToken()
  config.headers.Authorization = token ? `Bearer ${token}` : ''
  return config
})
export default axiosSecureInstance
