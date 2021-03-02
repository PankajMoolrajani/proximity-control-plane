import axios from 'axios'
import UserStore from '../../store/user.store'

const BASE_URL =
  'https://kushal.parikh.sb.intern.monoxor.com:8080/data-services'

const MONOXOR_DATASERVICE_PATH = '/graphql/3zx7/mxrdataservice'

// const axiosSecureInstance = axios.create()
// axiosSecureInstance.defaults.baseURL = BASE_URL
// axiosSecureInstance.interceptors.request.use((config) => {
//   const token = UserStore.getAccessToken()
//   config.headers.Authorization = token ? `Bearer ${token}` : ''
//   return config
// })

const axiosMonoxorDataserviceInstance = axios.create()
axiosMonoxorDataserviceInstance.defaults.baseURL =
  BASE_URL + MONOXOR_DATASERVICE_PATH
axiosMonoxorDataserviceInstance.defaults.headers.common[
  'Access-Control-Allow-Origin'
] = '*'

const axiosMasterDataserviceInstance = axios.create()
axiosMasterDataserviceInstance.defaults.baseURL = BASE_URL

export { axiosMonoxorDataserviceInstance, axiosMasterDataserviceInstance }
