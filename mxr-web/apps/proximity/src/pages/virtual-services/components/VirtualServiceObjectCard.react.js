import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import VirtualServiceListCard from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServiceListCard.react'
import VirtualServiceStdObjCard from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServiceStdObjCard.react'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const { virtualServiceStore } = stores

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
    return <Box>{this._renderObjectCard()}</Box>
  }
}

export default observer(VirtualServiceObjectCard)
