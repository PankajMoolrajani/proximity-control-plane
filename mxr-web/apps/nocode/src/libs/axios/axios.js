import axios from 'axios'
import UserStore from '../../store/user.store'

const DATA_SERVICE_URL = 'https://dev.monoxor.com/data-services'
console.log(DATA_SERVICE_URL)
const MONOXOR_DATASERVICE_PATH = '/graphql/3zx7/mxrdataservice'

const axiosMonoxorDataserviceInstance = axios.create()
axiosMonoxorDataserviceInstance.defaults.baseURL =
  DATA_SERVICE_URL + MONOXOR_DATASERVICE_PATH
axiosMonoxorDataserviceInstance.defaults.headers.common[
  'Access-Control-Allow-Origin'
] = '*'

const axiosMasterDataserviceInstance = axios.create()
axiosMasterDataserviceInstance.defaults.baseURL = DATA_SERVICE_URL

export { axiosMonoxorDataserviceInstance, axiosMasterDataserviceInstance }
