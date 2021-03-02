import React, { Component } from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const { logStore } = stores
export class FeedsCard extends Component {
  state = {
    feeds: []
  }

  async componentDidMount() {
    logStore.setSearchPageObjectCount(1000000)
    logStore.setSearchQuery({ type: 'PROXIMITY_CRUD_LOG' })
    logStore.setSortQuery({ tsCreate: -1 })
    const logs = await logStore.objectQuery()
    this.setState({ feeds: logs.data })
  }

  render() {
    return (
      <Box
        style={{
          background: 'white',
          padding: '10px 20px',
          borderRadius: 10,
          textAlign: 'left'
        }}
      >
        <Box style={{ fontSize: 22, margin: '20px 0' }}>Feeds</Box>
        {this.state.feeds.map((feed) => (
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
            {moment(feed.tsCreate).format('MMM DD, YYYY hh:mm A')} {feed.data}
          </List>
        ))}
      </Box>
    )
  }
}

export default observer(FeedsCard)
