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
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const { policyStore, virtualServiceStore, logStore } = stores

class VirtualServicePage extends Component {
  componentWillUnmount() {
    virtualServiceStore.resetAllFields()
    policyStore.resetAllFields()
    logStore.resetAllFields()
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
    const selectedObject = virtualServiceStore.getSelectedObject()
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
    const viewMode = virtualServiceStore.getShowObjectViewMode()
    return (
      <Box>
        {viewMode === 'UPDATE'
          ? this._renderSelectedObjectTitle()
          : this._renderTitle()}
      </Box>
    )
  }

  _renderButtons() {
    const viewMode = virtualServiceStore.getShowObjectViewMode()
    return (
      <Box>
        {viewMode !== 'CREATE' ? (
          <Button
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
          </Button>
        ) : null}

        {viewMode !== 'LIST' ? (
          <Button
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
