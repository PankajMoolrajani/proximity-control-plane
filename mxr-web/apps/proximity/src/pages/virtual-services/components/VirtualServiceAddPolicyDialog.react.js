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
import { toJS } from 'mobx'
const {
  virtualServiceStore,
  policyStore,
  policyRevisionStore,
  virtualServicePolicyRevisionStore
} = stores

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
                    const createdPolicy = await policyStore.objectCreate()

                    policyRevisionStore.setFormFields({
                      name: createdPolicy.name,
                      displayName: createdPolicy.displayName,
                      type: createdPolicy.type,
                      rules: createdPolicy.rules,
                      PolicyId: createdPolicy.id
                    })
                    const createdPolicyRevision = await policyRevisionStore.objectCreate()
                  }
                  if (viewMode === 'UPDATE') {
                    const selectedPolicyRevision = policyStore.getFormFields()
                    const selectedVirtualService = virtualServiceStore.getSelectedObject()
                    const oldPolicyRevisinoId =
                      selectedPolicyRevision.revisionId
                    const updatedPolicyDraft = {
                      ...selectedPolicyRevision
                    }
                    delete updatedPolicyDraft.revisionId
                    policyStore.setFormFields(updatedPolicyDraft)
                    const updatedPolicy = await policyStore.objectUpdate()
                    policyRevisionStore.setFormFields({
                      name: updatedPolicy.name,
                      displayName: updatedPolicy.displayName,
                      type: updatedPolicy.type,
                      rules: updatedPolicy.rules,
                      PolicyId: updatedPolicy.id
                    })
                    const createdPolicyRevision = await policyRevisionStore.objectCreate()

                    //Update virtual service policy mapping
                    virtualServicePolicyRevisionStore.setSearchQuery({
                      VirtualServiceId: selectedVirtualService.id,
                      PolicyRevisionId: oldPolicyRevisinoId
                    })
                    const existingVSPolicymapResponse = await virtualServicePolicyRevisionStore.objectQuery()
                    const existingVSPolicymap =
                      existingVSPolicymapResponse.rows[0]
                    console.log(existingVSPolicymap)
                    virtualServicePolicyRevisionStore.setFormFields({
                      id: existingVSPolicymap.id,
                      VirtualServiceId: existingVSPolicymap.VirtualServiceId,
                      PolicyRevisionId: createdPolicyRevision.id,
                      enforcementMode: existingVSPolicymap.enforcementMode
                    })
                    await virtualServicePolicyRevisionStore.objectUpdate()
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
                policyRevisionStore.resetAllFields()
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
