import { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import { Pie } from 'react-chartjs-2'
import PlatformLoaderCard from '/mxr-web/apps/proximity/src/components/platform/PlatformLoaderCard.react'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const { policyStore } = stores

const PoliciesCard = () => {
  const [totalPolicies, setTotalPolicies] = useState(0)
  const [policiesLast7days, setPoliciesLast7days] = useState(0)
  const [wafPolicies, setWafPolicies] = useState(0)
  const [authnPolicies, setAuthnPolicies] = useState(0)
  const [authzPolicies, setAuthzPolicies] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      policyStore.setSearchPageObjectCount(1000)
      const policies = await policyStore.objectQuery()
      setTotalPolicies(policies.count)
      let last7Days = 0
      policies.rows.forEach((policy) => {
        if (
          new Date(policy.createdAt).getTime() >
          new Date().getTime() - 7 * 24 * 60 * 60 * 1000
        ) {
          last7Days++
        }
      })
      setPoliciesLast7days(last7Days)
      setWafPolicies(
        policies.rows.filter((policy) => policy.type === 'WAF').length
      )

      setAuthnPolicies(
        policies.rows.filter((policy) => policy.type === 'AUTHN').length
      )

      setAuthzPolicies(
        policies.rows.filter((policy) => policy.type === 'AUTHZ').length
      )
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const details = {
    labels: ['AUTHN', 'AUTHZ', 'WAF'],
    datasets: [
      {
        label: 'Polices',
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        data: [authnPolicies, authzPolicies, wafPolicies]
      }
    ]
  }
  return (
    <Box
      style={{
        background: 'white',
        padding: '10px',
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        opacity: loading ? 0.5 : 1
      }}
    >
      {loading ? (
        <Box
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <PlatformLoaderCard />
        </Box>
      ) : (
        ''
      )}
      <Box style={{ textAlign: 'center' }}>
        <Box style={{ fontSize: 18 }}>Policies</Box>
        <Box style={{ fontSize: 50, color: '#2D9CDB', margin: '10px 0' }}>
          {totalPolicies}
        </Box>
        <Box>
          <span style={{ color: '#00e300' }}>+{policiesLast7days} </span>
          in last 7 days
        </Box>
      </Box>
      <Box>
        <Pie
          width={200}
          height={100}
          data={details}
          options={{
            legend: {
              position: 'right',
              align: 'top',
              labels: {
                boxWidth: 20
              }
            }
          }}
        />
      </Box>
    </Box>
  )
}

export default observer(PoliciesCard)
