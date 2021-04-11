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
        </Toolbar>
      </AppBar>
      <Box>
        {
          <PolicyDetailsCard
            hideTabs
            policyId={formFields.id}
            createCallback={async () => {
              props.handleShowAddExistingPolicyPopup(true)
            }}
            updateCallback={async () => {
              //Update virtual service policy mapping
              const selectedPolicyRevision = policyStore.getFormFields()
              const oldPolicyRevisinoId = selectedPolicyRevision.revisionId
              const selectedVirtualService = virtualServiceStore.getSelectedObject()
              virtualServicePolicyRevisionStore.setSearchQuery({
                VirtualServiceId: selectedVirtualService.id,
                PolicyRevisionId: oldPolicyRevisinoId
              })
              const existingVSPolicymapResponse = await virtualServicePolicyRevisionStore.objectQuery()
              const existingVSPolicymap = existingVSPolicymapResponse.rows[0]
              console.log(existingVSPolicymap)
              const createdPolicyRevision = policyRevisionStore.getFormFields()
              virtualServicePolicyRevisionStore.setFormFields({
                id: existingVSPolicymap.id,
                VirtualServiceId: existingVSPolicymap.VirtualServiceId,
                PolicyRevisionId: createdPolicyRevision.id,
                enforcementMode: existingVSPolicymap.enforcementMode
              })
              await virtualServicePolicyRevisionStore.objectUpdate()
              await createPolicyProximityDp(createdPolicyRevision.id)
              await props.fetchPolicies()
            }}
            finalCallback={async () => {
              policyStore.resetAllFields()
              policyRevisionStore.resetAllFields()
              virtualServiceStore.setShowAddObjectDialog(false)
            }}
          />
        }
      </Box>
    </Dialog>
  )
}

export default observer(VirtualServiceAddPolicyDialog)
