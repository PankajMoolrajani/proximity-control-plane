import { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import { Box } from '@material-ui/core'
import PlatformLoaderCard from '/mxr-web/apps/proximity/src/components/platform/PlatformLoaderCard.react'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const { virtualServiceStore } = stores

const VirtualServices = () => {
  const [totalVirtualServices, setTotalVirtualServices] = useState(0)
  const [virtualServiceLast7days, setVirtualServiceLast7days] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    virtualServiceStore.setSearchPageObjectCount(1000)
    const virtualServices = await virtualServiceStore.objectQuery()
    setTotalVirtualServices(virtualServices.count)
    let last7Days = 0
    virtualServices.rows.forEach((virtualService) => {
      if (
        new Date(virtualService.createdAt).getTime() >
        new Date().getTime() - 7 * 24 * 60 * 60 * 1000
      ) {
        last7Days++
      }
    })
    setVirtualServiceLast7days(last7Days)
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
      <Box style={{ fontSize: 18 }}>Virtual Service</Box>
      <Box style={{ fontSize: 50, color: '#2D9CDB', margin: '10px 0' }}>
        {totalVirtualServices}
      </Box>
      <Box>
        <span style={{ color: '#00e300' }}>+{virtualServiceLast7days} </span>
        in last 7 days
      </Box>
    </Box>
  )
}

export default observer(VirtualServices)
