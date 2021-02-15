import axios from 'axios'

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

export const createPolicyProximityDp = async (virtualService, policy) => {
  const virtualServiceBaseUrl = new URL(virtualService.proximityUrl).origin

  //Check if service is deployed
  const healthCheckResponse = await axios.get(`${virtualServiceBaseUrl}/health`)
  if (healthCheckResponse.status === 200) {
    console.log(JSON.stringify(policy))
    let policyName
    let policyType
    if (policy.name.includes('INGRESS-')) {
      policyName = policy.name.replace('INGRESS-', '')
      policyType = 'INGRESS'
    }

    if (policy.name.includes('EGRESS-')) {
      policyName = policy.name.replace('EGRESS-', '')
      policyType = 'EGRESS'
    }
    const createdPolicyProximityDp = await axios.post(
      `${virtualServiceBaseUrl}/policy/create-policy`,
      {
        policyName: policyName,
        policyType: policyType,
        rules: policy.rules
      }
    )
  }
}
