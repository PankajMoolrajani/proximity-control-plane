import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { MaterialBox } from 'libs/material'
import { virtualServiceStore } from 'apps/proximity/stores/proximity.store'

class VirtualServices extends Component {
  state = {
    totalVirtualServices: 0,
    virtualServiceLast7days:0
  }


  async componentDidMount() {
    virtualServiceStore.setSearchPageObjectCount(1000)
    const virtualServices = await virtualServiceStore.objectQuery()
    this.setState({totalVirtualServices: virtualServices.count})
    let last7Days = 0
    virtualServices.data.forEach(virtualService => {
      if(new Date(virtualService.tsCreate) > (new Date().getTime() - 7*24*60*60*1000)) {
        last7Days++
      }
    })
    this.setState({virtualServiceLast7days: last7Days})
  }


  
  render() {
    return (
      <MaterialBox
        style={{
          background: 'white',
          padding: '10px',
          borderRadius: 10,
          textAlign: 'center'
        }}
      >
        <MaterialBox style={{ fontSize: 18 }}>Virtual Service</MaterialBox>
        <MaterialBox
          style={{ fontSize: 50, color: '#2D9CDB', margin: '10px 0' }}
        >
          { this.state.totalVirtualServices }
        </MaterialBox>
        <MaterialBox>
          <span style={{ color: '#00e300' }}>+{this.state.virtualServiceLast7days} </span>in last 7 days
        </MaterialBox>
      </MaterialBox>
    )
  }
}


export default observer(VirtualServices)
