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
import AddIcon from '@material-ui/icons/Add'
import policyIcon from 'assets/icons/policyIcon.png'
import PlatfromPopUpCard from 'apps/platform/components/PlatfromPopUpCard.react'
import VirtualServiceAddPolicyDialog from 'apps/proximity/virtual-services/components/VirtualServiceAddPolicyDialog.react'
import {
  virtualServiceStore,
  policyStore
} from 'apps/proximity/stores/proximity.store'


export class VirtualServicePoliciesCard extends Component {
  state = {
    showAddPolicyPopUp: false
  }


  handleShowAddPolicyPopup = (showAddPolicyPopUp) => {
    this.setState({
      showAddPolicyPopUp: showAddPolicyPopUp
    })
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


  _renderPoliciesListCard() {
    const virtualService = virtualServiceStore.getSelectedObject()
    const policiesAll = virtualServiceStore.getRelatedObjects()
    const policiesMetadata =
      virtualService.currentRevision.virtualService.policiesMetadata
    if (!policiesAll || !policiesMetadata || policiesMetadata.length === 0) {
      return (
        <MaterialBox style={{ textAlign: 'center' }}>No Content</MaterialBox>
      )
    }
    const filtredPolicies = []
    policiesMetadata.forEach((policyMetadata) => {
      const filtredPolicy = policiesAll.find(
        (policy) => policyMetadata.id === policy.id
      )
      if (filtredPolicy) {
        const filtredPolicyByRevision = filtredPolicy.revisions.find(
          (revision) => policyMetadata.revisionId === revision.id
        )
        if (filtredPolicyByRevision) {
          filtredPolicies.push({
            policyId: filtredPolicy.id,
            policyRevisonId: filtredPolicyByRevision.id,
            name: filtredPolicy.name,
            displayName: filtredPolicy.displayName,
            enforcementMode: policyMetadata.enforcementMode,
            revisionName: filtredPolicyByRevision.name,
            createdAt: filtredPolicy.tsCreate,
            updatedAt: filtredPolicy.tsUpdate,
            rules: filtredPolicyByRevision.policy.rules,
            type: filtredPolicyByRevision.policy.type
          })
        }
      }
    })
    return (
      <DataTable
        className='p-datatable-striped p-datatable-hovered'
        value={filtredPolicies}
        selectionMode='single'
        rows={10}
        sortMode='multiple'
        rowsPerPageOptions={[10, 20, 50, 1000]}
        onSelectionChange={(e) => {
          const policy = {
            id: e.value.policyId,
            name: e.value.name,
            displayName: e.value.displayName,
            type: e.value.type,
            rules: e.value.rules
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
          body={(filtredPolicy) => filtredPolicy.name}
          sortable
        ></Column>
        <Column
          field='enforcementMode'
          header='Enforcement Mode'
          body={(filtredPolicy) => filtredPolicy.enforcementMode}
          sortable
        ></Column>
        <Column
          field='revision'
          header='Revision'
          body={(filtredPolicy) => filtredPolicy.revisionName}
          sortable
        ></Column>
        <Column
          field='tsCreate'
          header='Date Created'
          body={(filtredPolicy) =>
            moment(filtredPolicy.createdAt).format('MMM DD, YYYY')
          }
          sortable
        ></Column>
        <Column
          field='tsUpdate'
          header='Date Modified'
          body={(filtredPolicy) =>
            moment(filtredPolicy.updatedAt).format('MMM DD, YYYY')
          }
          sortable
        ></Column>
      </DataTable>
    )
  }


  render() {
    const showAddPolicyDialog = virtualServiceStore.getShowAddObjectDialog()
    return (
      <MaterialBox>
        <MaterialBox
          style={{
            display: 'flex',
            padding: '10px 24px',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <MaterialBox
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <MaterialBox style={{ marginRight: 20 }}>
              <img src={policyIcon} width='40' />
            </MaterialBox>
            <MaterialTypography variant='h5'>Policies</MaterialTypography>
          </MaterialBox>
          <MaterialBox
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <MaterialButton
              color='primary'
              size='small'
              startIcon={<AddIcon />}
              style={{ marginRight: 10, fontWeight: 700 }}
              onClick={() => {
                policyStore.resetAllFields()
                this.handleShowAddPolicyPopup(true)
              }}
            >
              Add existing policy
            </MaterialButton>
            <MaterialButton
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
            </MaterialButton>
          </MaterialBox>
        </MaterialBox>
        <MaterialDivider />
        {this._renderPoliciesListCard()}
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


export default observer(VirtualServicePoliciesCard)
