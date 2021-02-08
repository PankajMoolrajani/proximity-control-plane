import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { MaterialBox, MaterialButton, MaterialTypography } from 'libs/material'
import AddIcon from '@material-ui/icons/Add'
import CodeIcon from '@material-ui/icons/Code'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ListIcon from '@material-ui/icons/List'
import PageLayout from 'apps/proximity/components/PageLayout'
import VirtualServiceObjectCard from 'apps/proximity/virtual-services/components/VirtualServiceObjectCard.react'
import {
  virtualServiceStore,
  policyStore
} from 'apps/proximity/stores/proximity.store'
import { logStore } from 'apps/platform/stores/platform.store'


class VirtualServicePage extends Component {
  componentWillUnmount() {
    virtualServiceStore.resetAllFields()
    policyStore.resetAllFields()
    logStore.resetAllFields()
  }


  _renderTitle() {
    return (
      <MaterialBox
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <MaterialBox style={{ marginRight: 25 }}>
          <CodeIcon />
        </MaterialBox>
        <MaterialTypography variant='h5'>Virtual Services</MaterialTypography>
      </MaterialBox>
    )
  }


  _renderSelectedObjectTitle() {
    const selectedObject = virtualServiceStore.getSelectedObject()
    return (
      <MaterialBox
        style={{
          display: 'flex',
          alignItems: 'top'
        }}
      >
        <MaterialBox
          style={{
            color: 'green',
            marginRight: 20
          }}
        >
          <CheckCircleIcon color='inherit' />
        </MaterialBox>
        <MaterialBox>
          <MaterialBox style={{ fontSize:20 }}>
            {selectedObject.currentRevision.virtualService.name}
          </MaterialBox>
          <MaterialBox style={{ marginTop: 5, fontSize:14 }}>
            <b>REVISION:</b> {selectedObject.currentRevision.name}
          </MaterialBox>
        </MaterialBox>
      </MaterialBox>
    )
  }


  _renderObjectHeader() {
    const viewMode = virtualServiceStore.getShowObjectViewMode()
    return (
      <MaterialBox>
        {viewMode === 'UPDATE'
          ? this._renderSelectedObjectTitle()
          : this._renderTitle()}
      </MaterialBox>
    )
  }


  _renderButtons() {
    const viewMode = virtualServiceStore.getShowObjectViewMode()
    return (
      <MaterialBox>
        {viewMode !== 'CREATE' ? (
          <MaterialButton
            color='primary'
            size='small'
            startIcon={<AddIcon />}
            style={{ fontWeight: 700 }}
            onClick={() => {
              virtualServiceStore.setFormFields({
                name: '',
                displayName: '',
                proximityUrl: '',
                targetUrl: '',
                policiesMetadata: []
              })
              virtualServiceStore.setShowObjectViewMode('CREATE')
              virtualServiceStore.setShowObjectViewModeSecondary('DETAILS')
            }}
          >
            Create
          </MaterialButton>
        ) : null}

        {viewMode !== 'LIST' ? (
          <MaterialButton
            color='primary'
            size='small'
            startIcon={<ListIcon />}
            style={{ fontWeight: 700 }}
            onClick={() => {
              virtualServiceStore.resetAllFields()
              virtualServiceStore.setShowObjectViewMode('LIST')
            }}
          >
            Show All
          </MaterialButton>
        ) : null}
      </MaterialBox>
    )
  }


  render() {
    return (
      <PageLayout
        title={this._renderObjectHeader()}
        actionButtons={this._renderButtons()}
      >
        <VirtualServiceObjectCard />
      </PageLayout>
    )
  }
}


export default observer(VirtualServicePage)
