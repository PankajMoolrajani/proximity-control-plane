import axios from 'axios'

const BASE_URL = 'https://platform.monoxor.com/data-services/'

const axiosInstance = axios.create()
axiosInstance.defaults.baseURL = BASE_URL

export { axiosInstance }
