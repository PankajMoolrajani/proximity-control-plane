import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import PolicyListCard from '/mxr-web/apps/proximity/src/pages/policies/components/PolicyListCard.react'
import PolicyStdObjCard from '/mxr-web/apps/proximity/src/pages/policies/components/PolicyStdObjCard.react'
import PolicyStore from '/mxr-web/apps/proximity/src/stores/Policy.store'

export class PolicyObjectCard extends Component {
  componentDidMount() {
    PolicyStore.setShowObjectViewMode('LIST')
  }

  handleOnClose() {
    PolicyStore.resetAllFields()
    PolicyStore.setShowObjectViewMode('LIST')
  }

  _renderObjectCard() {
    const viewMode = PolicyStore.getShowObjectViewMode()
    switch (viewMode) {
      case 'CREATE':
        return <PolicyStdObjCard onClose={this.handleOnClose} />
        break
      case 'UPDATE':
        return <PolicyStdObjCard onClose={this.handleOnClose} />
        break
      case 'LIST':
        return <PolicyListCard />
        break
      default:
        return <PolicyListCard />
    }
  }

  render() {
    return <Box>{this._renderObjectCard()}</Box>
  }
}

export default observer(PolicyObjectCard)
