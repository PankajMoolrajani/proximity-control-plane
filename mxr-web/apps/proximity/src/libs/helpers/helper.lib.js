import axios from 'axios'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const {
  virtualServiceStore,
  policyRevisionStore,
  virtualServicePolicyRevisionStore
} = stores

export const transformSortQuery = (sortQuery) => {
  if (!sortQuery) {
    return []
  }
  const sortQueryTransformed = []
  sortQuery.forEach((sort) => {
    sortQueryTransformed.push({
      field: sort[0],
      order: sort[1] === 'ASC' ? 1 : -1
    })
  })
  return sortQueryTransformed
}

export const onSortQuery = (sortQuery, e) => {
  if (!sortQuery) {
    sortQuery = []
  }
  let updatedSortQuery = []
  console.log(sortQuery)
  e.multiSortMeta.forEach((sortMeta) => {
    updatedSortQuery.push([
      sortMeta.field,
      sortMeta.order === 1 ? 'ASC' : 'DESC'
    ])
  })
  return updatedSortQuery
}

export const createPolicyProximityDp = async (policyRevisionId) => {
  const selectedVirtualService = virtualServiceStore.getSelectedObject()
  const virtualServiceBaseUrl = new URL(selectedVirtualService.proximityUrl)
    .href

  //Check if service is deployed
  const healthCheckResponse = await axios.get(`${virtualServiceBaseUrl}/health`)
  if (healthCheckResponse.status === 200) {
    //Get Policy revision with mapping
    const policyRevision = await policyRevisionStore.objectQueryById(
      policyRevisionId
    )
    virtualServicePolicyRevisionStore.setSearchQuery({
      PolicyRevisionId: policyRevisionId,
      VirtualServiceId: selectedVirtualService.id
    })
    const virtualServicePolicyRevision = await virtualServicePolicyRevisionStore.objectQuery()
    const policyRevisionDp = {
      ...policyRevision,
      VirtualServicePolicyRevision: {
        ...virtualServicePolicyRevision[0]
      }
    }
    const createdPolicyProximityDp = await axios.post(
      `${virtualServiceBaseUrl}/create-policy`,
      policyRevisionDp
    )
  }
}
