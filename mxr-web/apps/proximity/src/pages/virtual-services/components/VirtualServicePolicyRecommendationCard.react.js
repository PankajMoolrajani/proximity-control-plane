import React, { Component } from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import {
  MaterialBox,
  MaterialButton,
  MaterialDivider,
  MaterialTypography,
  MaterialTextField,
  MaterialFormControl,
  MaterialInputLabel,
  MaterialSelect,
  MaterialMenuItem
} from 'libs/material'
import { Autocomplete } from '@material-ui/lab'
import CircularProgress from '@material-ui/core/CircularProgress'
import PlatfromPopUpCard from 'apps/platform/components/PlatfromPopUpCard.react'
import VirtualServiceAddPolicyDialog from 'apps/proximity/virtual-services/components/VirtualServiceAddPolicyDialog.react'
import {
  policyRecommendationStore,
  virtualServiceStore,
  policyStore
} from 'apps/proximity/stores/proximity.store'


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
      <MaterialBox>
        <pre>{poilcyRecommendation.rules}</pre>
      </MaterialBox>
    )
  }


  _renderAddExistingPolicyDialogCard() {
    const policyDraftObject = policyStore.getDraftObject()

    return (
      <PlatfromPopUpCard
        isOpen={this.state.showAddPolicyPopUp}
        onClose={() => this.handleShowAddPolicyPopup(false)}
        title='Add Existing Policy'
      >
        <MaterialBox
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <MaterialBox
            style={{
              width: screen.width > 600 ? 600 : '100%',
              marginTop: 20
            }}
          >
            <MaterialBox>
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
                    : policyStore.getDraftObject()
                    ? policyStore.getDraftObject()['name']
                    : ''
                }
                loading={policyStore.getShowProcessCard()}
                onChange={async (event, option) => {
                  if (!option) {
                    return
                  }
                  let formFields = policyStore.getFormFields()
                  if (!formFields) {
                    formFields = {}
                  }
                  policyStore.setShowProcessCard(true)
                  const policy = await policyStore.objectQueryById(
                    option.id,
                    true
                  )
                  policyStore.setShowProcessCard(false)
                  policyStore.setDraftObject({
                    ...policyDraftObject,
                    id: policy.id,
                    name: policy.name,
                    revisions: policy.revisions
                  })
                }}
                onInputChange={async (e) => {
                  if (!e.target.value) {
                    policyStore.resetAllFields()
                    return
                  }
                  policyStore.setSearchText(e.target.value)
                  policyStore.setShowProcessCard(true)
                  const policies = await policyStore.objectQuery()
                  policyStore.setObjects(policies.data)
                  policyStore.setShowProcessCard(false)
                }}
                renderInput={(params) => (
                  <MaterialTextField
                    {...params}
                    variant='outlined'
                    label='Seach Policy'
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {policyStore.getShowProcessCard() ? (
                            <CircularProgress color='inherit' size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      )
                    }}
                  />
                )}
              />
            </MaterialBox>
            {policyDraftObject ? (
              <React.Fragment>
                <MaterialBox style={{ marginTop: 20 }}>
                  <MaterialFormControl
                    fullWidth
                    variant='outlined'
                    size='small'
                  >
                    <MaterialInputLabel id='policy-revision-lable-id'>
                      Revision Name
                    </MaterialInputLabel>
                    <MaterialSelect
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
                        policyStore.setDraftObject({
                          ...policyDraftObject,
                          selectedRevisionId: event.target.value.id,
                          selectedRevisionName: event.target.value.name
                        })
                      }}
                    >
                      {policyDraftObject.revisions.map((revision) => (
                        <MaterialMenuItem key={revision.id} value={revision}>
                          {revision.name}
                        </MaterialMenuItem>
                      ))}
                    </MaterialSelect>
                  </MaterialFormControl>
                </MaterialBox>
                <MaterialBox style={{ marginTop: 20 }}>
                  <MaterialFormControl
                    fullWidth
                    variant='outlined'
                    size='small'
                  >
                    <MaterialInputLabel id='enforcement-lable-id'>
                      Enforcement Mode
                    </MaterialInputLabel>
                    <MaterialSelect
                      ref={null}
                      labelId='enforcement-lable-id'
                      label='Enforcement Mode'
                      value={
                        policyDraftObject.enforcementMode
                          ? policyDraftObject.enforcementMode
                          : ''
                      }
                      onChange={(event) => {
                        policyStore.setDraftObject({
                          ...policyDraftObject,
                          enforcementMode: event.target.value
                        })
                      }}
                    >
                      <MaterialMenuItem value='ACTIVE'>Active</MaterialMenuItem>
                      <MaterialMenuItem value='PASSIVE'>
                        Passive
                      </MaterialMenuItem>
                      <MaterialMenuItem value='LEARNING'>
                        Learning
                      </MaterialMenuItem>
                    </MaterialSelect>
                  </MaterialFormControl>
                </MaterialBox>
                <MaterialBox style={{ marginTop: 20, textAlign: 'center' }}>
                  <MaterialButton
                    variant='contained'
                    color='primary'
                    onClick={async () => {
                      const virtualService = virtualServiceStore.getSelectedObject()
                      const draftPolicy = policyStore.getDraftObject()
                      virtualServiceStore.setFormFields({
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
                      virtualServiceStore.setShowProcessCard(true)
                      try {
                        const updatedVirtualService = await virtualServiceStore.objectUpdate()
                        virtualServiceStore.setSelectedObject(
                          updatedVirtualService
                        )
                        virtualServiceStore.setShowProcessCard(false)
                        virtualServiceStore.setShowSuccessCard(true)
                        await new Promise((res) => setTimeout(res, 2000))
                        virtualServiceStore.setShowSuccessCard(false)
                      } catch (error) {
                        console.log('Error: Updating Virtual Service', error)
                      }
                      virtualServiceStore.setShowProcessCard(false)
                      policyStore.resetAllFields()
                      await this.props.fetchPolicies()
                    }}
                  >
                    Add
                  </MaterialButton>
                </MaterialBox>
              </React.Fragment>
            ) : null}
          </MaterialBox>
        </MaterialBox>
      </PlatfromPopUpCard>
    )
  }


  render() {
    const searchQuery = policyRecommendationStore.getSortQuery()
    const poilcyRecommendations = policyRecommendationStore.getObjects()
    const showAddPolicyDialog = virtualServiceStore.getShowAddObjectDialog()
    if (!poilcyRecommendations || poilcyRecommendations.length === 0) {
      return (
        <MaterialBox style={{ textAlign: 'center' }}>No Content</MaterialBox>
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
      <MaterialBox>
        <DataTable
          className='p-datatable-striped p-datatable-hovered'
          value={poilcyRecommendations}
          selectionMode='single'
          dataKey={
            policyRecommendationStore.getSelectedObject()
              ? policyRecommendationStore.getSelectedObject().id
              : ''
          }
          onRowToggle={(e) => this.setState({ expandedRows: e.data })}
          rowExpansionTemplate={this._renderPolicyTemplate}
          totalRecords={policyRecommendationStore.getSearchResultsObjectCount()}
          loading={policyRecommendationStore.getShowProcessCard()}
          rows={policyRecommendationStore.getSearchPageObjectCount()}
          first={
            policyRecommendationStore.getSearchPageNum() *
            policyRecommendationStore.getSearchPageObjectCount()
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
            policyStore.setSelectedObject(policy)
            policyStore.setFormFields(policy)
            policyStore.setShowObjectViewMode('CREATE')
            virtualServiceStore.setShowAddObjectDialog(true)
          }}
          onPage={async (e) => {
            policyRecommendationStore.setSearchPageNum(e.page)
            policyRecommendationStore.setSearchPageObjectCount(e.rows)
            await this.props.fetchPolicyRecommendations()
          }}
          multiSortMeta={searchQueryArray}
          onSort={async (e) => {
            let sortQuery = policyRecommendationStore.getSortQuery()
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
            policyRecommendationStore.setSortQuery(sortQuery)
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
      </MaterialBox>
    )
  }
}


export default observer(VirtualServicePolicyRecommendationCard)
