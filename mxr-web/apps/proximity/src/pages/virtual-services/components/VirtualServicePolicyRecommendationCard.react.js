import React, { Component } from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { Autocomplete } from '@material-ui/lab'
import CircularProgress from '@material-ui/core/CircularProgress'
import PlatfromPopUpCard from '/mxr-web/apps/proximity/src/components/platform/PlatfromPopUpCard.react'
import VirtualServiceAddPolicyDialog from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServiceAddPolicyDialog.react'
import VirtualServiceStore from '/mxr-web/apps/proximity/src/stores/VirtualService.store'
import PolicyStore from '/mxr-web/apps/proximity/src/stores/Policy.store'
import PolicyRecommendation from '/mxr-web/apps/proximity/src/stores/PolicyRecommendation.store'


class VirtualServicePolicyRecommendationCard extends Component {
  state = {
    expandedRows: null,
    showAddPolicyPopUp: false
  }


  handleShowAddPolicyPopup = (showAddPolicyPopUp) => {
    this.setState({
      showAddPolicyPopUp: showAddPolicyPopUp
    })
  }


  _renderPolicyTemplate = (poilcyRecommendation) => {
    return (
      <Box>
        <pre>{poilcyRecommendation.rules}</pre>
      </Box>
    )
  }


  _renderAddExistingPolicyDialogCard() {
    const policyDraftObject = PolicyStore.getDraftObject()

    return (
      <PlatfromPopUpCard
        isOpen={this.state.showAddPolicyPopUp}
        onClose={() => this.handleShowAddPolicyPopup(false)}
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
              width: screen.width > 600 ? 600 : '100%',
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
                  PolicyStore.getObjects() ? PolicyStore.getObjects() : []
                }
                inputValue={
                  PolicyStore.getSearchText()
                    ? PolicyStore.getSearchText()
                    : PolicyStore.getDraftObject()
                    ? PolicyStore.getDraftObject()['name']
                    : ''
                }
                loading={PolicyStore.getShowProcessCard()}
                onChange={async (event, option) => {
                  if (!option) {
                    return
                  }
                  let formFields = PolicyStore.getFormFields()
                  if (!formFields) {
                    formFields = {}
                  }
                  PolicyStore.setShowProcessCard(true)
                  const policy = await PolicyStore.objectQueryById(
                    option.id,
                    true
                  )
                  PolicyStore.setShowProcessCard(false)
                  PolicyStore.setDraftObject({
                    ...policyDraftObject,
                    id: policy.id,
                    name: policy.name,
                    revisions: policy.revisions
                  })
                }}
                onInputChange={async (e) => {
                  if (!e.target.value) {
                    PolicyStore.resetAllFields()
                    return
                  }
                  PolicyStore.setSearchText(e.target.value)
                  PolicyStore.setShowProcessCard(true)
                  const policies = await PolicyStore.objectQuery()
                  PolicyStore.setObjects(policies.data)
                  PolicyStore.setShowProcessCard(false)
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Seach Policy'
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {PolicyStore.getShowProcessCard() ? (
                            <CircularProgress color='inherit' size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      )
                    }}
                  />
                )}
              />
            </Box>
            {policyDraftObject ? (
              <React.Fragment>
                <Box style={{ marginTop: 20 }}>
                  <FormControl
                    fullWidth
                    variant='outlined'
                    size='small'
                  >
                    <InputLabel id='policy-revision-lable-id'>
                      Revision Name
                    </InputLabel>
                    <Select
                      ref={null}
                      labelId='policy-revision-lable-id'
                      label='Revision Name'
                      value={
                        policyDraftObject.selectedRevisionName
                          ? policyDraftObject.selectedRevisionName
                          : ''
                      }
                      renderValue={(value) => (value ? value : '')}
                      onChange={(event) => {
                        PolicyStore.setDraftObject({
                          ...policyDraftObject,
                          selectedRevisionId: event.target.value.id,
                          selectedRevisionName: event.target.value.name
                        })
                      }}
                    >
                      {policyDraftObject.revisions.map((revision) => (
                        <MenuItem key={revision.id} value={revision}>
                          {revision.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box style={{ marginTop: 20 }}>
                  <FormControl
                    fullWidth
                    variant='outlined'
                    size='small'
                  >
                    <InputLabel id='enforcement-lable-id'>
                      Enforcement Mode
                    </InputLabel>
                    <Select
                      ref={null}
                      labelId='enforcement-lable-id'
                      label='Enforcement Mode'
                      value={
                        policyDraftObject.enforcementMode
                          ? policyDraftObject.enforcementMode
                          : ''
                      }
                      onChange={(event) => {
                        PolicyStore.setDraftObject({
                          ...policyDraftObject,
                          enforcementMode: event.target.value
                        })
                      }}
                    >
                      <MenuItem value='ACTIVE'>Active</MenuItem>
                      <MenuItem value='PASSIVE'>
                        Passive
                      </MenuItem>
                      <MenuItem value='LEARNING'>
                        Learning
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box style={{ marginTop: 20, textAlign: 'center' }}>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={async () => {
                      const virtualService = VirtualServiceStore.getSelectedObject()
                      const draftPolicy = PolicyStore.getDraftObject()
                      VirtualServiceStore.setFormFields({
                        id: virtualService.id,
                        displayName: virtualService.displayName,
                        proximityUrl:
                          virtualService.currentRevision.virtualService
                            .proximityUrl,
                        targetUrl:
                          virtualService.currentRevision.virtualService
                            .targetUrl,
                        policiesMetadata: [
                          ...virtualService.currentRevision.virtualService
                            .policiesMetadata,
                          {
                            id: draftPolicy.id,
                            revisionId: draftPolicy.selectedRevisionId,
                            enforcementMode: draftPolicy.enforcementMode
                          }
                        ]
                      })
                      VirtualServiceStore.setShowProcessCard(true)
                      try {
                        const updatedVirtualService = await VirtualServiceStore.objectUpdate()
                        VirtualServiceStore.setSelectedObject(
                          updatedVirtualService
                        )
                        VirtualServiceStore.setShowProcessCard(false)
                        VirtualServiceStore.setShowSuccessCard(true)
                        await new Promise((res) => setTimeout(res, 2000))
                        VirtualServiceStore.setShowSuccessCard(false)
                      } catch (error) {
                        console.log('Error: Updating Virtual Service', error)
                      }
                      VirtualServiceStore.setShowProcessCard(false)
                      PolicyStore.resetAllFields()
                      await this.props.fetchPolicies()
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </React.Fragment>
            ) : null}
          </Box>
        </Box>
      </PlatfromPopUpCard>
    )
  }


  render() {
    const searchQuery = PolicyRecommendation.getSortQuery()
    const poilcyRecommendations = PolicyRecommendation.getObjects()
    const showAddPolicyDialog = VirtualServiceStore.getShowAddObjectDialog()
    if (!poilcyRecommendations || poilcyRecommendations.length === 0) {
      return (
        <Box style={{ textAlign: 'center' }}>No Content</Box>
      )
    }
    let searchQueryArray = []
    for (const field in searchQuery) {
      searchQueryArray.push({
        field: field,
        order: searchQuery[field]
      })
    }
    return (
      <Box>
        <DataTable
          className='p-datatable-striped p-datatable-hovered'
          value={poilcyRecommendations}
          selectionMode='single'
          dataKey={
            PolicyRecommendation.getSelectedObject()
              ? PolicyRecommendation.getSelectedObject().id
              : ''
          }
          onRowToggle={(e) => this.setState({ expandedRows: e.data })}
          rowExpansionTemplate={this._renderPolicyTemplate}
          totalRecords={PolicyRecommendation.getSearchResultsObjectCount()}
          loading={PolicyRecommendation.getShowProcessCard()}
          rows={PolicyRecommendation.getSearchPageObjectCount()}
          first={
            PolicyRecommendation.getSearchPageNum() *
            PolicyRecommendation.getSearchPageObjectCount()
          }
          sortMode='multiple'
          rowsPerPageOptions={[10, 20, 50, 1000]}
          onSelectionChange={(e) => {
            console.log(e)
            const policy = {
              name: e.value.name,
              displayName: e.value.name,
              type: e.value.type,
              rules: e.value.rules
            }
            PolicyStore.setSelectedObject(policy)
            PolicyStore.setFormFields(policy)
            PolicyStore.setShowObjectViewMode('CREATE')
            VirtualServiceStore.setShowAddObjectDialog(true)
          }}
          onPage={async (e) => {
            PolicyRecommendation.setSearchPageNum(e.page)
            PolicyRecommendation.setSearchPageObjectCount(e.rows)
            await this.props.fetchPolicyRecommendations()
          }}
          multiSortMeta={searchQueryArray}
          onSort={async (e) => {
            let sortQuery = PolicyRecommendation.getSortQuery()
            if (!sortQuery) {
              sortQuery = {}
            }

            e.multiSortMeta.forEach((sortMeta) => {
              sortQuery[sortMeta.field] = sortMeta.order
            })

            for (const field in sortQuery) {
              if (
                e.multiSortMeta.findIndex(
                  (msortMeta) => msortMeta.field === field
                ) === -1
              ) {
                delete sortQuery[field]
              }
            }
            PolicyRecommendation.setSortQuery(sortQuery)
            await this.props.fetchPolicyRecommendations()
          }}
          removableSort
          lazy
          paginator
        >
          <Column
            field='policyName'
            header='Policy'
            body={(poilcyRecommendation) => poilcyRecommendation.name}
          ></Column>
          <Column
            field='type'
            header='Type'
            body={(poilcyRecommendation) => poilcyRecommendation.type}
          ></Column>
          <Column
            field='tsCreate'
            header='Date'
            body={(poilcyRecommendation) =>
              moment(poilcyRecommendation.tsCreate).format(
                'MMM DD, YYYY hh:mm A'
              )
            }
            sortable
          ></Column>
        </DataTable>
        {this._renderAddExistingPolicyDialogCard()}
        {showAddPolicyDialog ? (
          <VirtualServiceAddPolicyDialog
            handleShowAddExistingPolicyPopup={this.handleShowAddPolicyPopup}
            fetchPolicies={this.props.fetchPolicies}
          />
        ) : null}
      </Box>
    )
  }
}


export default observer(VirtualServicePolicyRecommendationCard)
