import { Fragment } from 'react'
import { observer } from 'mobx-react'
import stores from '../../../stores/proximity.store'
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@material-ui/core'
import PlatfromPopUpCard from '../../../components/platform/PlatfromPopUpCard.react'
import { Autocomplete } from '@material-ui/lab'
import { createPolicyProximityDp } from '/mxr-web/apps/proximity/src/libs/helpers/helper.lib'
const {
  virtualServiceStore,
  policyStore,
  virtualServicePolicyRevisionStore
} = stores

const VirtualServiceAddExistingPolicyDialogCard = ({
  isOpen,
  onClose,
  onOpen,
  virtualServiceId
}) => {
  const virtualServicePolicyRevision = virtualServicePolicyRevisionStore.getFormFields()
  const selectedPolicy = policyStore.getSelectedObject()

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
  return (
    <PlatfromPopUpCard
      isOpen={isOpen}
      onClose={onClose}
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
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => option.name}
              options={policyStore.getObjects() ? policyStore.getObjects() : []}
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
                      onClose()
                    } catch (error) {
                      onOpen()
                      console.log(
                        'Error: Creating virtual service policy mapping',
                        error
                      )
                    }
                    virtualServiceStore.setShowProcessCard(false) 
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

export default observer(VirtualServiceAddExistingPolicyDialogCard)
