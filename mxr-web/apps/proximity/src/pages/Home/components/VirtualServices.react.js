import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import VirtualServiceStore from '/mxr-web/apps/proximity/src/stores/VirtualService.store'

class VirtualServices extends Component {
  state = {
    totalVirtualServices: 0,
    virtualServiceLast7days: 0
  }

  async componentDidMount() {
    VirtualServiceStore.setSearchPageObjectCount(1000)
    const virtualServices = await VirtualServiceStore.objectQuery()
    this.setState({ totalVirtualServices: virtualServices.count })
    let last7Days = 0
    virtualServices.data.forEach((virtualService) => {
      if (
        new Date(virtualService.tsCreate) >
        new Date().getTime() - 7 * 24 * 60 * 60 * 1000
      ) {
        last7Days++
      }
    })
    this.setState({ virtualServiceLast7days: last7Days })
  }

  render() {
    return (
      <Box
        style={{
          background: 'white',
          padding: '10px',
          borderRadius: 10,
          textAlign: 'center'
        }}
      >
        <Box style={{ fontSize: 18 }}>Virtual Service</Box>
        <Box style={{ fontSize: 50, color: '#2D9CDB', margin: '10px 0' }}>
          {this.state.totalVirtualServices}
        </Box>
        <Box>
          <span style={{ color: '#00e300' }}>
            +{this.state.virtualServiceLast7days}{' '}
          </span>
          in last 7 days
        </Box>
      </Box>
    )
  }
}

export default observer(VirtualServices)
