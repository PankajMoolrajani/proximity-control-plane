import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import CodeIcon from '@material-ui/icons/Code'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ListIcon from '@material-ui/icons/List'
import PageLayout from '/mxr-web/apps/proximity/src/components/PageLayout'
import VirtualServiceObjectCard from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServiceObjectCard.react'
import LogStore from '/mxr-web/apps/proximity/src/stores/Log.store'
import PolicyStore from '/mxr-web/apps/proximity/src/stores/Policy.store'
import VirtualServiceStore from '/mxr-web/apps/proximity/src/stores/VirtualService.store'

class VirtualServicePage extends Component {
  componentWillUnmount() {
    VirtualServiceStore.resetAllFields()
    PolicyStore.resetAllFields()
    LogStore.resetAllFields()
  }

  _renderTitle() {
    return (
      <Box
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Box style={{ marginRight: 25 }}>
          <CodeIcon />
        </Box>
        <Typography variant='h5'>Virtual Services</Typography>
      </Box>
    )
  }

  _renderSelectedObjectTitle() {
    const selectedObject = VirtualServiceStore.getSelectedObject()
    return (
      <Box
        style={{
          display: 'flex',
          alignItems: 'top'
        }}
      >
        <Box
          style={{
            color: 'green',
            marginRight: 20
          }}
        >
          <CheckCircleIcon color='inherit' />
        </Box>
        <Box>
          <Box style={{ fontSize: 20 }}>
            {selectedObject.currentRevision.virtualService.name}
          </Box>
          <Box style={{ marginTop: 5, fontSize: 14 }}>
            <b>REVISION:</b> {selectedObject.currentRevision.name}
          </Box>
        </Box>
      </Box>
    )
  }

  _renderObjectHeader() {
    const viewMode = VirtualServiceStore.getShowObjectViewMode()
    return (
      <Box>
        {viewMode === 'UPDATE'
          ? this._renderSelectedObjectTitle()
          : this._renderTitle()}
      </Box>
    )
  }

  _renderButtons() {
    const viewMode = VirtualServiceStore.getShowObjectViewMode()
    return (
      <Box>
        {viewMode !== 'CREATE' ? (
          <Button
            color='primary'
            size='small'
            startIcon={<AddIcon />}
            style={{ fontWeight: 700 }}
            onClick={() => {
              VirtualServiceStore.setFormFields({
                name: '',
                displayName: '',
                proximityUrl: '',
                targetUrl: '',
                policiesMetadata: []
              })
              VirtualServiceStore.setShowObjectViewMode('CREATE')
              VirtualServiceStore.setShowObjectViewModeSecondary('DETAILS')
            }}
          >
            Create
          </Button>
        ) : null}

        {viewMode !== 'LIST' ? (
          <Button
            color='primary'
            size='small'
            startIcon={<ListIcon />}
            style={{ fontWeight: 700 }}
            onClick={() => {
              VirtualServiceStore.resetAllFields()
              VirtualServiceStore.setShowObjectViewMode('LIST')
            }}
          >
            Show All
          </Button>
        ) : null}
      </Box>
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
