import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { MaterialBox } from 'libs/material'
import PolicyListCard from '/mxr-web/apps/proximity/src/pages/policies/components/PolicyListCard.react'
import PolicyStdObjCard from '/mxr-web/apps/proximity/src/pages/policies/components/PolicyStdObjCard.react'


export class PolicyObjectCard extends Component {
  componentDidMount() {
   // policyStore.setShowObjectViewMode('LIST')
  }


  handleOnClose() {
    // policyStore.resetAllFields()
    // policyStore.setShowObjectViewMode('LIST')
  }


  _renderObjectCard() {
    const viewMode = policyStore.getShowObjectViewMode()
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
    return <MaterialBox>{this._renderObjectCard()}</MaterialBox>
  }
}


export default observer(PolicyObjectCard)
