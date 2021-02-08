import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/styles'
import {
  MaterialBox,
  MaterialButton,
  MaterialIconButton,
  MaterialSlide,
  MaterialDialog,
  MaterialAppBar,
  MaterialToolbar,
  MaterialTypography
} from 'libs/material'
import CloseIcon from '@material-ui/icons/Close'
import PolicyStdObjCard from 'apps/proximity/policies/components/PolicyStdObjCard.react'
import {
  virtualServiceStore,
  policyStore
} from 'apps/proximity/stores/proximity.store'


const classes = {
  appBar: {
    position: 'relative'
  },
  title: {
    flex: 1
  }
}


const Transition = React.forwardRef(function Transition(props, ref) {
  return <MaterialSlide direction='up' ref={ref} {...props} />
})


export class VirtualServiceAddPolicyDialog extends Component {
  render() {
    const showAddPolicyDialog = virtualServiceStore.getShowAddObjectDialog()
    const formFields = policyStore.getFormFields()
    return (
      <MaterialDialog
        fullScreen
        open={showAddPolicyDialog}
        onClose={() => {
          virtualServiceStore.setShowAddObjectDialog(false)
          policyStore.setShowObjectViewMode(null)
        }}
        TransitionComponent={Transition}
      >
        <MaterialAppBar className={this.props.classes.appBar}>
          <MaterialToolbar>
            <MaterialIconButton
              edge='start'
              color='inherit'
              onClick={() => {
                virtualServiceStore.setShowAddObjectDialog(false)
                policyStore.setShowObjectViewMode(null)
              }}
              aria-label='close'
            >
              <CloseIcon />
            </MaterialIconButton>
            <MaterialTypography
              variant='h6'
              className={this.props.classes.title}
            >
              {formFields.id ? 'Update' : 'Create'} : Policy
            </MaterialTypography>
            <MaterialButton
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
            </MaterialButton>
          </MaterialToolbar>
        </MaterialAppBar>
        <MaterialBox>
          <PolicyStdObjCard hideOpsButton hideTabs />
        </MaterialBox>
      </MaterialDialog>
    )
  }
}


export default withStyles(classes)(observer(VirtualServiceAddPolicyDialog))
