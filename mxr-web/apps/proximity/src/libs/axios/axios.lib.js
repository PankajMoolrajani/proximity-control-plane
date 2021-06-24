import axios from 'axios'
import https from 'https'
import {
  DATA_SERVICE_URL,
  WORKFLOW_SERVICE_URL
} from '/mxr-web/apps/proximity/src/config'
import orgStore from '/mxr-web/apps/proximity/src/stores/org.store'

const getAxiosInstance = () => {
  const userOrgs = orgStore.getUserOrgs()
  if (!userOrgs) {
    return
  }
  const orgs = userOrgs.Orgs
  const activeOrgs = orgs.filter((org) => org.isDefault)
  if (activeOrgs.length === 0) {
    return
  }
  const activeOrg = activeOrgs[0]
  const [databaseName, shortId] = activeOrg.database.split('_')
  const BASE_URL = `${DATA_SERVICE_URL}/crud/${shortId}/${databaseName}`
  const axiosInstance = axios.create()
  axiosInstance.defaults.baseURL = BASE_URL
  axiosInstance.CancelToken = axios.CancelToken
  axiosInstance.isCancel = axios.isCancel
  return axiosInstance
}

const getAxiosPdsInstance = () => {
  const BASE_URL = `${DATA_SERVICE_URL}/crud/xqgc/prxmtdataservice`
  const axiosPdsInstance = axios.create()
  axiosPdsInstance.defaults.baseURL = BASE_URL
  axiosPdsInstance.CancelToken = axios.CancelToken
  axiosPdsInstance.isCancel = axios.isCancel
  return axiosPdsInstance
}

const getAxiosServiceInstance = () => {
  const axiosServiceInstance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  })
  axiosServiceInstance.defaults.baseURL = WORKFLOW_SERVICE_URL

  return axiosServiceInstance
}

export { getAxiosInstance, getAxiosServiceInstance, getAxiosPdsInstance }
