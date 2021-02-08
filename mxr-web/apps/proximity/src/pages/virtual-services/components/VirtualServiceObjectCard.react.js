import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { MaterialBox } from 'libs/material'
import VirtualServiceListCard from 'apps/proximity/virtual-services/components/VirtualServiceListCard.react'
import VirtualServiceStdObjCard from 'apps/proximity/virtual-services/components/VirtualServiceStdObjCard.react'
import { virtualServiceStore } from 'apps/proximity/stores/proximity.store'


export class VirtualServiceObjectCard extends Component {
  componentDidMount() {
    virtualServiceStore.setShowObjectViewMode('LIST')
  }


  handleOnClose() {
    virtualServiceStore.resetAllFields()
    virtualServiceStore.setShowObjectViewMode('LIST')
  }


  _renderObjectCard() {
    let viewMode = virtualServiceStore.getShowObjectViewMode()
    switch (viewMode) {
      case 'CREATE':
        return <VirtualServiceStdObjCard onClose={this.handleOnClose} />
        break
      case 'UPDATE':
        return <VirtualServiceStdObjCard onClose={this.handleOnClose} />
        break
      case 'LIST':
        return <VirtualServiceListCard />
        break
      default:
        return <VirtualServiceListCard />
    }
  }


  render() {
    return <MaterialBox>{this._renderObjectCard()}</MaterialBox>
  }
}


export default observer(VirtualServiceObjectCard)
