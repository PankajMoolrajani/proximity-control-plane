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
import VirtualServiceStore from '/mxr-web/apps/proximity/src/stores/VirtualService.store'
import PolicyStore from '/mxr-web/apps/proximity/src/stores/Policy.store'

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
    const showAddPolicyDialog = VirtualServiceStore.getShowAddObjectDialog()
    const formFields = PolicyStore.getFormFields()
    return (
      <Dialog
        fullScreen
        open={showAddPolicyDialog}
        onClose={() => {
          VirtualServiceStore.setShowAddObjectDialog(false)
          PolicyStore.setShowObjectViewMode(null)
        }}
        TransitionComponent={Transition}
      >
        <AppBar className={this.props.classes.appBar}>
          <Toolbar>
            <IconButton
              edge='start'
              color='inherit'
              onClick={() => {
                VirtualServiceStore.setShowAddObjectDialog(false)
                PolicyStore.setShowObjectViewMode(null)
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
                const viewMode = PolicyStore.getShowObjectViewMode()
                PolicyStore.setShowProcessCard(true)
                try {
                  if (viewMode === 'CREATE') {
                    await PolicyStore.objectCreate()
                  }
                  if (viewMode === 'UPDATE') {
                    const updatedPolicy = await PolicyStore.objectUpdate()
                    const exitingVirtualService = VirtualServiceStore.getSelectedObject()
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
                    VirtualServiceStore.setFormFields({
                      ...VirtualServiceStore.getFormFields(),
                      policiesMetadata: updatePolicyMeta
                    })
                    const udpatedVirtualService = await VirtualServiceStore.objectUpdate(
                      true
                    )
                    VirtualServiceStore.setSelectedObject(udpatedVirtualService)
                  }
                  PolicyStore.setShowSuccessCard(true)
                  await new Promise((res) => setTimeout(res, 2000))
                  PolicyStore.setShowSuccessCard(false)
                  if (viewMode === 'UPDATE') {
                    await this.props.fetchPolicies()
                  }

                  PolicyStore.setShowObjectViewMode(null)
                  if (viewMode === 'CREATE') {
                    console.log('Show popup')
                    this.props.handleShowAddExistingPolicyPopup(true)
                  }
                  PolicyStore.setShowProcessCard(false)
                } catch (error) {
                  console.log('Error: Creating Policy', error)
                }
                PolicyStore.setShowProcessCard(false)
                PolicyStore.resetAllFields()
                VirtualServiceStore.setShowAddObjectDialog(false)
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
