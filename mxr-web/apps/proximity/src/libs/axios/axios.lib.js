import axios from 'axios'
import https from 'https'
import {
  DATA_SERVICE_URL,
  WORKFLOW_SERVICE_URL
} from '/mxr-web/apps/proximity/src/config'

const BASE_URL = `${DATA_SERVICE_URL}/crud/k8ti/proximity`

const axiosInstance = axios.create()
axiosInstance.defaults.baseURL = BASE_URL
axiosInstance.CancelToken = axios.CancelToken
axiosInstance.isCancel = axios.isCancel

const axiosServiceInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})
axiosServiceInstance.defaults.baseURL = WORKFLOW_SERVICE_URL

export { axiosInstance, axiosServiceInstance }
