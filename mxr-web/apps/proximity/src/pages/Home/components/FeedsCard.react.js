import { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import { Box } from '@material-ui/core'
import List from '@material-ui/core/List'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import PlatformLoaderCard from '/mxr-web/apps/proximity/src/components/platform/PlatformLoaderCard.react'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const { logStore } = stores

const FeedsCard = () => {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      logStore.setSearchPageObjectCount(15)
      logStore.setSearchQuery({ type: 'PROXIMITY_CRUD_LOG' })
      logStore.setSortQuery([['createdAt', 'DESC']])
      const logs = await logStore.objectQuery()
      setFeeds(logs.rows)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()

    return () => {
      logStore.resetAllFields()
    }
  }, [])

  return (
    <Box
      style={{
        background: 'white',
        padding: '10px 20px',
        borderRadius: 10,
        textAlign: 'left',
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
      <Box style={{ fontSize: 22, margin: '20px 0' }}>Feeds</Box>
      {feeds.map((feed) => (
        <List
          style={{
            color: 'grey',
            fontSize: 18,
            backgroundColor: '#f7f7f7',
            margin: '5px 0',
            padding: 5,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <FiberManualRecordIcon
            style={{ color: '#56CCF2', fontSize: 18, marginRight: 10 }}
          />
          {moment(feed.createdAt).format('MMM DD, YYYY hh:mm A')} {feed.data}
        </List>
      ))}
    </Box>
  )
}

export default observer(FeedsCard)
