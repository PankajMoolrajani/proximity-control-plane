import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Slide from '@material-ui/core/Slide'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import PolicyStdObjCard from '/mxr-web/apps/proximity/src/pages/policies/components/PolicyStdObjCard.react'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const { virtualServiceStore, policyStore } = stores

const classes = {
  appBar: {
    position: 'relative'
  },
  title: {
    flex: 1
  }
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

export class VirtualServiceAddPolicyDialog extends Component {
  render() {
    const showAddPolicyDialog = virtualServiceStore.getShowAddObjectDialog()
    const formFields = policyStore.getFormFields()
    return (
      <Dialog
        fullScreen
        open={showAddPolicyDialog}
        onClose={() => {
          virtualServiceStore.setShowAddObjectDialog(false)
          policyStore.setShowObjectViewMode(null)
        }}
        TransitionComponent={Transition}
      >
        <AppBar className={this.props.classes.appBar}>
          <Toolbar>
            <IconButton
              edge='start'
              color='inherit'
              onClick={() => {
                virtualServiceStore.setShowAddObjectDialog(false)
                policyStore.setShowObjectViewMode(null)
              }}
              aria-label='close'
            >
              <CloseIcon />
            </IconButton>
            <Typography variant='h6' className={this.props.classes.title}>
              {formFields.id ? 'Update' : 'Create'} : Policy
            </Typography>
            <Button
              autoFocus
              color='inherit'
              onClick={async () => {
                const viewMode = policyStore.getShowObjectViewMode()
                policyStore.setShowProcessCard(true)
                try {
                  if (viewMode === 'CREATE') {
                    await policyStore.objectCreate()
                  }
                  if (viewMode === 'UPDATE') {
                    const updatedPolicy = await policyStore.objectUpdate()
                    const exitingVirtualService = virtualServiceStore.getSelectedObject()
                    const updatePolicyMeta = exitingVirtualService.currentRevision.virtualService.policiesMetadata.filter(
                      (policyMeta) => policyMeta.id !== updatedPolicy.id
                    )
                    const oldPolicyMeta = exitingVirtualService.currentRevision.virtualService.policiesMetadata.find(
                      (policyMeta) => policyMeta.id === updatedPolicy.id
                    )
                    updatePolicyMeta.push({
                      id: updatedPolicy.id,
                      revisionId: updatedPolicy.currentRevisionId,
                      enforcementMode: oldPolicyMeta.enforcementMode
                    })
                    virtualServiceStore.setFormFields({
                      ...virtualServiceStore.getFormFields(),
                      policiesMetadata: updatePolicyMeta
                    })
                    const udpatedVirtualService = await virtualServiceStore.objectUpdate(
                      true
                    )
                    virtualServiceStore.setSelectedObject(udpatedVirtualService)
                  }
                  policyStore.setShowSuccessCard(true)
                  await new Promise((res) => setTimeout(res, 2000))
                  policyStore.setShowSuccessCard(false)
                  if (viewMode === 'UPDATE') {
                    await this.props.fetchPolicies()
                  }

                  policyStore.setShowObjectViewMode(null)
                  if (viewMode === 'CREATE') {
                    console.log('Show popup')
                    this.props.handleShowAddExistingPolicyPopup(true)
                  }
                  policyStore.setShowProcessCard(false)
                } catch (error) {
                  console.log('Error: Creating Policy', error)
                }
                policyStore.setShowProcessCard(false)
                policyStore.resetAllFields()
                virtualServiceStore.setShowAddObjectDialog(false)
              }}
              style={{
                marginRight: 20
              }}
            >
              save
            </Button>
          </Toolbar>
        </AppBar>
        <Box>
          <PolicyStdObjCard hideOpsButton hideTabs />
        </Box>
      </Dialog>
    )
  }
}

export default withStyles(classes)(observer(VirtualServiceAddPolicyDialog))
