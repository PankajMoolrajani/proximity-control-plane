import { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import { Box, Button, Divider, Typography } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import PolicyIcon from '@material-ui/icons/Policy'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import VirtualServiceAddPolicyDialog from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServiceAddPolicyDialog.react'
import VirtualServiceAddExistingPolicyDialogCard from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServiceAddExistingPolicyDialogCard.react'
import PlatformLoaderCard from '/mxr-web/apps/proximity/src/components/platform/PlatformLoaderCard.react'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const { virtualServiceStore, policyStore } = stores

const VirtualServicePoliciesCard = ({ virtualServiceId }) => {
  const [showAddPolicyPopUp, setShowAddPolicyPopUp] = useState(false)
  const showLoader = virtualServiceStore.getShowProcessCard()
  const fetchVirtualServiceById = async () => {
    virtualServiceStore.setShowProcessCard(true)
    try {
      const virtualService = await virtualServiceStore.objectQueryById(
        virtualServiceId,
        [
          {
            model: 'PolicyRevision'
          }
        ]
      )
      if (virtualService) {
        virtualServiceStore.setSelectedObject(virtualService)
      }
    } catch (error) {
      virtualServiceStore.setShowProcessCard(false)
      console.log(error)
    }
    virtualServiceStore.setShowProcessCard(false)
  }

  useEffect(() => {
    fetchVirtualServiceById()
  }, [])

  const _renderPoliciesListCard = () => {
    const virtualService = virtualServiceStore.getSelectedObject()
    const policyRevisions =
      virtualService && virtualService.PolicyRevisions
        ? virtualService.PolicyRevisions
        : []
    return (
      <DataTable
        className='p-datatable-striped p-datatable-hovered'
        value={policyRevisions}
        selectionMode='single'
        rows={10}
        sortMode='multiple'
        rowsPerPageOptions={[10, 20, 50, 1000]}
        onSelectionChange={(e) => {
          const policy = {
            id: e.value.PolicyId,
            name: e.value.name,
            displayName: e.value.displayName,
            type: e.value.type,
            rules: e.value.rules,
            revisionId: e.value.id
          }
          policyStore.setSelectedObject(policy)
          delete policy.name
          policyStore.setFormFields(policy)

          policyStore.setShowObjectViewMode('UPDATE')
          virtualServiceStore.setShowAddObjectDialog(true)
        }}
        removableSort
        paginator
      >
        <Column
          field='name'
          header='Name'
          body={(policyRevision) => policyRevision.name}
          sortable
        ></Column>
        <Column
          field='enforcementMode'
          header='Enforcement Mode'
          body={(policyRevision) =>
            policyRevision.VirtualServicePolicyRevision.enforcementMode
          }
          sortable
        ></Column>
        <Column
          field='revision'
          header='Revision'
          body={(policyRevision) =>
            `rev-${policyRevision.id.split('-').reverse()[0]}`
          }
          sortable
        ></Column>
        <Column
          field='tsCreate'
          header='Date Created'
          body={(policyRevision) =>
            moment(policyRevision.createdAt).format('MMM DD, YYYY')
          }
          sortable
        ></Column>
        <Column
          field='tsUpdate'
          header='Date Modified'
          body={(policyRevision) =>
            moment(policyRevision.updatedAt).format('MMM DD, YYYY')
          }
          sortable
        ></Column>
      </DataTable>
    )
  }

  const showAddPolicyDialog = virtualServiceStore.getShowAddObjectDialog()
  if (showLoader) {
    return (
      <Box style={{ margin: 50 }}>
        <PlatformLoaderCard />
      </Box>
    )
  }
  return (
    <Box>
      <Box
        style={{
          display: 'flex',
          padding: '10px 24px',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Box style={{ marginRight: 20 }}>
            <PolicyIcon />
          </Box>
          <Typography variant='h5'>Policies</Typography>
        </Box>
        <Box
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Button
            color='primary'
            size='small'
            startIcon={<AddIcon />}
            style={{ marginRight: 10, fontWeight: 700 }}
            onClick={() => {
              policyStore.resetAllFields()
              setShowAddPolicyPopUp(true)
            }}
          >
            Add existing policy
          </Button>
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
              virtualServiceStore.setShowAddObjectDialog(true)
            }}
          >
            Create new policy
          </Button>
        </Box>
      </Box>
      <Divider />
      {_renderPoliciesListCard()}
      <VirtualServiceAddExistingPolicyDialogCard
        virtualServiceId={virtualServiceId}
        isOpen={showAddPolicyPopUp}
        onClose={() => setShowAddPolicyPopUp(false)}
      />
      {showAddPolicyDialog ? (
        <VirtualServiceAddPolicyDialog
          handleShowAddExistingPolicyPopup={(value) =>
            setShowAddPolicyPopUp(value)
          }
          fetchPolicies={fetchVirtualServiceById}
        />
      ) : null}
    </Box>
  )
}

export default observer(VirtualServicePoliciesCard)
