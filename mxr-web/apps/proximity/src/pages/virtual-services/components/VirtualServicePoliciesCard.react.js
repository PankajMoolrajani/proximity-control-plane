import { Fragment, useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import {
  Box,
  Button,
  Divider,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@material-ui/core'

import { Autocomplete } from '@material-ui/lab'
import AddIcon from '@material-ui/icons/Add'
import PolicyIcon from '@material-ui/icons/Policy'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { createPolicyProximityDp } from '/mxr-web/apps/proximity/src/libs/helpers/helper.lib'
import PlatfromPopUpCard from '../../../components/platform/PlatfromPopUpCard.react'
import VirtualServiceAddPolicyDialog from '../components/VirtualServiceAddPolicyDialog.react'
import PlatformLoaderCard from '../../../components/platform/PlatformLoaderCard.react'
import stores from '../../../stores/proximity.store'
const {
  virtualServiceStore,
  policyStore,
  policyRevisionStore,
  virtualServicePolicyRevisionStore
} = stores

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

  const _renderAddExistingPolicyDialogCard = () => {
    const virtualServicePolicyRevision = virtualServicePolicyRevisionStore.getFormFields()
    const selectedPolicy = policyStore.getSelectedObject()
    return (
      <PlatfromPopUpCard
        isOpen={showAddPolicyPopUp}
        onClose={() => setShowAddPolicyPopUp(false)}
        title='Add Existing Policy'
      >
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <Box
            style={{
              width: window.screen.width > 600 ? 600 : '100%',
              marginTop: 20
            }}
          >
            <Box>
              <Autocomplete
                fullWidth
                size='small'
                getOptionSelected={(option, value) =>
                  option.name === value.name
                }
                getOptionLabel={(option) => option.name}
                options={
                  policyStore.getObjects() ? policyStore.getObjects() : []
                }
                inputValue={
                  policyStore.getSearchText()
                    ? policyStore.getSearchText()
                    : policyStore.getSelectedObject()
                    ? policyStore.getSelectedObject()['name']
                    : ''
                }
                loading={policyStore.getShowProcessCard()}
                onChange={async (event, option) => {
                  if (!option) {
                    return
                  }
                  policyStore.setSelectedObject(option)
                }}
                onInputChange={async (e) => {
                  if (e && !e.target.value) {
                    policyStore.resetAllFields()
                    return
                  }
                  const cancelToken = policyStore.getCancelToken()
                  if (cancelToken) {
                    cancelToken.cancel()
                  }
                  policyStore.setSearchText(e.target.value)
                  policyStore.setSearchQuery({
                    name: {
                      $like: `%${e.target.value}%`
                    }
                  })
                  policyStore.setShowProcessCard(true)
                  const policies = await policyStore.objectQuery([
                    {
                      model: 'PolicyRevision'
                    }
                  ])
                  policyStore.setObjects(policies.rows)
                  policyStore.setShowProcessCard(false)
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Seach Policy'
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <Fragment>
                          {policyStore.getShowProcessCard() ? (
                            <CircularProgress color='inherit' size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </Fragment>
                      )
                    }}
                  />
                )}
              />
            </Box>
            {selectedPolicy ? (
              <Fragment>
                <Box style={{ marginTop: 20 }}>
                  <FormControl fullWidth variant='outlined' size='small'>
                    <InputLabel id='policy-revision-lable-id'>
                      Revision Name
                    </InputLabel>
                    <Select
                      labelId='policy-revision-lable-id'
                      label='Revision Name'
                      value={
                        virtualServicePolicyRevision
                          ? virtualServicePolicyRevision.PolicyRevisionId
                          : ''
                      }
                      renderValue={(value) =>
                        value ? `rev-${value.split('-').reverse()[0]}` : ''
                      }
                      onChange={(event) => {
                        virtualServicePolicyRevisionStore.setFormFields({
                          ...virtualServicePolicyRevision,
                          PolicyRevisionId: event.target.value.id
                        })
                      }}
                    >
                      {selectedPolicy.PolicyRevisions &&
                        selectedPolicy.PolicyRevisions.map((revision) => (
                          <MenuItem key={revision.id} value={revision}>
                            rev-{revision.id.split('-').reverse()[0]}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box style={{ marginTop: 20 }}>
                  <FormControl fullWidth variant='outlined' size='small'>
                    <InputLabel id='enforcement-lable-id'>
                      Enforcement Mode
                    </InputLabel>
                    <Select
                      ref={null}
                      labelId='enforcement-lable-id'
                      label='Enforcement Mode'
                      value={
                        virtualServicePolicyRevision
                          ? virtualServicePolicyRevision.enforcementMode
                          : ''
                      }
                      onChange={(event) => {
                        virtualServicePolicyRevisionStore.setFormFields({
                          ...virtualServicePolicyRevision,
                          enforcementMode: event.target.value
                        })
                      }}
                    >
                      <MenuItem value='ACTIVE'>Active</MenuItem>
                      <MenuItem value='PASSIVE'>Passive</MenuItem>
                      <MenuItem value='LEARNING'>Learning</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box style={{ marginTop: 20, textAlign: 'center' }}>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={async () => {
                      const virtualService = virtualServiceStore.getSelectedObject()
                      virtualServicePolicyRevisionStore.setFormFields({
                        ...virtualServicePolicyRevision,
                        VirtualServiceId: virtualService.id
                      })
                      virtualServiceStore.setShowProcessCard(true)
                      try {
                        const selectedPolicy = policyStore.getSelectedObject()
                        const createdVirtualServicePolicyRevision = await virtualServicePolicyRevisionStore.objectCreate()
                        await createPolicyProximityDp(
                          createdVirtualServicePolicyRevision.PolicyRevisionId
                        )
                        virtualServiceStore.setShowProcessCard(false)
                        virtualServiceStore.setShowSuccessCard(true)
                        await new Promise((res) => setTimeout(res, 2000))
                        virtualServiceStore.setShowSuccessCard(false)
                      } catch (error) {
                        console.log(
                          'Error: Creating virtual service policy mapping',
                          error
                        )
                      }
                      virtualServiceStore.setShowProcessCard(false)
                      setShowAddPolicyPopUp(false)
                      virtualServicePolicyRevisionStore.resetAllFields()
                      fetchVirtualServiceById()
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </Fragment>
            ) : null}
          </Box>
        </Box>
      </PlatfromPopUpCard>
    )
  }

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
      {_renderAddExistingPolicyDialogCard()}
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
