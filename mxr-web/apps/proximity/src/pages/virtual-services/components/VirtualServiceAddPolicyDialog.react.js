import React, { Component } from 'react'
import { observer } from 'mobx-react'
import {
  Box,
  Button,
  IconButton,
  Slide,
  Dialog,
  AppBar,
  Toolbar,
  Typography,
  makeStyles
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { useAuth0 } from '@auth0/auth0-react'
import { createPolicyProximityDp } from '/mxr-web/apps/proximity/src/libs/helpers/helper.lib'
import { createCrudLog } from '/mxr-web/apps/proximity/src/libs/logs/log.lib'
import PolicyDetailsCard from '/mxr-web/apps/proximity/src/pages/policies/components/PolicyDetailsCard.react'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const {
  virtualServiceStore,
  policyStore,
  policyRevisionStore,
  virtualServicePolicyRevisionStore
} = stores

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative'
  },
  title: {
    flex: 1
  }
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})
const VirtualServiceAddPolicyDialog = (props) => {
  const classes = useStyles()
  const { user } = useAuth0()
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
      <AppBar className={classes.appBar}>
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
          <Typography variant='h6' className={classes.title}>
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
                  createCrudLog(
                    `${user.name ? user.name : user.email} Created Policy - ${
                      createdPolicy.displayName
                    }`
                  )
                }
                if (viewMode === 'UPDATE') {
                  const selectedPolicyRevision = policyStore.getFormFields()
                  const selectedVirtualService = virtualServiceStore.getSelectedObject()
                  const oldPolicyRevisinoId = selectedPolicyRevision.revisionId
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
                  createCrudLog(
                    `${user.name ? user.name : user.email} Updated Policy - ${
                      updatedPolicy.displayName
                    }`
                  )
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
                  await createPolicyProximityDp(createdPolicyRevision.id)
                }
                policyStore.setShowSuccessCard(true)
                await new Promise((res) => setTimeout(res, 2000))
                policyStore.setShowSuccessCard(false)
                if (viewMode === 'UPDATE') {
                  await props.fetchPolicies()
                }
                policyStore.setShowObjectViewMode(null)
                if (viewMode === 'CREATE') {
                  console.log('Show popup')
                  props.handleShowAddExistingPolicyPopup(true)
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
        {<PolicyDetailsCard hideOpsButton hideTabs policyId={formFields.id} />}
      </Box>
    </Dialog>
  )
}

export default observer(VirtualServiceAddPolicyDialog)
