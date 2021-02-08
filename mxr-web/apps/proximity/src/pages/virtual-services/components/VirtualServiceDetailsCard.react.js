import React, { Component } from 'react'
import { observer } from 'mobx-react'
import {
  MaterialBox,
  MaterialTextField,
  MaterialInputAdornment,
  MaterialIconButton
} from 'libs/material'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import { virtualServiceStore } from 'apps/proximity/stores/proximity.store'


export class VirtualServiceDetailsCard extends Component {
  state = {
    showSecret: false
  }


  render() {
    const formFields = virtualServiceStore.getFormFields()
    const virtualService = virtualServiceStore.getSelectedObject()
    const viewMode = virtualServiceStore.getShowObjectViewMode()
    let virtualServiceName
    if (viewMode === 'CREATE') {
      virtualServiceName = formFields.name ? formFields.name : ''
    }

    if (viewMode === 'UPDATE') {
      virtualServiceName = virtualService.name ? virtualService.name : ''
    }
    return (
      <MaterialBox style={{ maxWidth: 700, padding: 24 }}>
        <MaterialBox>
          <MaterialTextField
            fullWidth
            label='Name'
            variant='outlined'
            size='small'
            value={virtualServiceName ? virtualServiceName : ''}
            onChange={(event) => {
              if (viewMode !== 'CREATE') {
                return
              }
              virtualServiceStore.setFormFields({
                ...formFields,
                name: event.target.value
              })
            }}
          />
        </MaterialBox>
        <MaterialBox style={{ marginTop: 20 }}>
          <MaterialTextField
            fullWidth
            label='Display Name'
            variant='outlined'
            size='small'
            value={formFields.displayName ? formFields.displayName : ''}
            onChange={(event) => {
              virtualServiceStore.setFormFields({
                ...formFields,
                displayName: event.target.value
              })
            }}
          />
        </MaterialBox>
        <MaterialBox style={{ marginTop: 20 }}>
          <MaterialTextField
            fullWidth
            label='Proximity Url'
            variant='outlined'
            size='small'
            value={formFields.proximityUrl ? formFields.proximityUrl : ''}
            onChange={(event) => {
              virtualServiceStore.setFormFields({
                ...formFields,
                proximityUrl: event.target.value
              })
            }}
          />
        </MaterialBox>
        <MaterialBox style={{ marginTop: 20 }}>
          <MaterialTextField
            fullWidth
            label='Target Url'
            variant='outlined'
            size='small'
            value={formFields.targetUrl ? formFields.targetUrl : ''}
            onChange={(event) => {
              virtualServiceStore.setFormFields({
                ...formFields,
                targetUrl: event.target.value
              })
            }}
          />
        </MaterialBox>
        {viewMode === 'UPDATE' ? (
          <React.Fragment>
            <MaterialBox style={{ marginTop: 20 }}>
              <MaterialTextField
                fullWidth
                label='Service Id'
                variant='outlined'
                size='small'
                value={formFields.id ? formFields.id : ''}
              />
            </MaterialBox>
            <MaterialBox style={{ marginTop: 20 }}>
              <MaterialTextField
                fullWidth
                type={this.state.showSecret ? 'text' : 'password'}
                label='Auth Key'
                variant='outlined'
                size='small'
                value={virtualService.authKey ? virtualService.authKey : ''}
                InputProps={{
                  endAdornment: (
                    <MaterialInputAdornment>
                      <MaterialIconButton
                        onClick={() =>
                          this.setState((prevState) => ({
                            showSecret: !prevState.showSecret
                          }))
                        }
                      >
                        {this.state.showSecret ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </MaterialIconButton>
                    </MaterialInputAdornment>
                  )
                }}
              />
            </MaterialBox>
          </React.Fragment>
        ) : null}
        {this.props.actionButtons}
      </MaterialBox>
    )
  }
}


export default observer(VirtualServiceDetailsCard)
