import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ListIcon from '@material-ui/icons/List'
import PolicyIcon from '@material-ui/icons/Policy' 
import PageLayout from '/mxr-web/apps/proximity/src/components/PageLayout'
import PolicyObjectCard from '/mxr-web/apps/proximity/src/pages/policies/components/PolicyObjectCard.react'

class PolicyPage extends Component { 
  _renderTitle() {
    return (
      <Box
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Box style={{ marginRight: 25 }}>
          <PolicyIcon/>
        </Box>
        <Typography variant='h5'>Policies</Typography>
      </Box>
    )
  }


  _renderSelectedObjectTitle() {
    const selectedObject = policyStore.getSelectedObject()
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
        <Box  style={{ fontSize:20 }}>
          <Box>{selectedObject.name}</Box>
          <Box style={{ marginTop: 5, fontSize:14 }}>
            <b>REVISION:</b> {selectedObject.currentRevision.name}
          </Box>
        </Box>
      </Box>
    )
  }


  _renderObjectHeader() {
    const viewMode = policyStore.getShowObjectViewMode()
    return (
      <Box>
        {viewMode === 'UPDATE'
          ? this._renderSelectedObjectTitle()
          : this._renderTitle()}
      </Box>
    )
  }


  _renderButtons() {
    const viewMode = policyStore.getShowObjectViewMode()
    return (
      <Box>
        {viewMode !== 'CREATE' ? (
          <Button
            color='primary'
            size='small'
            startIcon={<AddIcon />}
            style={{ fontWeight: 700 }}
            onClick={() => {
              policyStore.setFormFields({
                name: '',
                displayName: '',
                type: '',
                rules: ''
              })
              policyStore.setShowObjectViewMode('CREATE')
              policyStore.setShowObjectViewModeSecondary('DETAILS')
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
              policyStore.resetAllFields()
              policyStore.setShowObjectViewMode('LIST')
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
        <PolicyObjectCard />
      </PageLayout>
    )
  }
}


export default observer(PolicyPage)
