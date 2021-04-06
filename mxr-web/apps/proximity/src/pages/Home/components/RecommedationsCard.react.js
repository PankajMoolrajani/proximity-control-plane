import { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import { Box } from '@material-ui/core'
import PlatformLoaderCard from '/mxr-web/apps/proximity/src/components/platform/PlatformLoaderCard.react'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const { policyRecommendationStore } = stores

const RecommendationsCard = () => {
  const [
    policyRecommendationsLast7days,
    setPolicyRecommendationsLast7days
  ] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      policyRecommendationStore.setSearchPageObjectCount(1000)
      policyRecommendationStore.setSearchQuery({
        createdAt: {
          $gt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
        }
      })
      const policyRecommendations = await policyRecommendationStore.objectQuery()
      setPolicyRecommendationsLast7days(policyRecommendations.count)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Box
      style={{
        background: 'white',
        padding: '10px',
        borderRadius: 10,
        textAlign: 'center',
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
      <Box style={{ fontSize: 18 }}>New Recommendations</Box>
      <Box style={{ fontSize: 50, color: '#2D9CDB', margin: '10px 0' }}>
        {policyRecommendationsLast7days}
      </Box>
      <Box>in last 7 days</Box>
    </Box>
  )
}

export default observer(RecommendationsCard)
