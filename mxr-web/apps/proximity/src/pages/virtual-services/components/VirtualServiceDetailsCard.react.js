import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import VirtualServiceStore from '/mxr-web/apps/proximity/src/stores/VirtualService.store'

export class VirtualServiceDetailsCard extends Component {
  state = {
    showSecret: false
  }

  render() {
    const formFields = VirtualServiceStore.getFormFields()
    const virtualService = VirtualServiceStore.getSelectedObject()
    const viewMode = VirtualServiceStore.getShowObjectViewMode()
    let virtualServiceName
    if (viewMode === 'CREATE') {
      virtualServiceName = formFields.name ? formFields.name : ''
    }

    if (viewMode === 'UPDATE') {
      virtualServiceName = virtualService.name ? virtualService.name : ''
    }
    return (
      <Box style={{ maxWidth: 700, padding: 24 }}>
        <Box>
          <TextField
            fullWidth
            label='Name'
            variant='outlined'
            size='small'
            value={virtualServiceName ? virtualServiceName : ''}
            onChange={(event) => {
              if (viewMode !== 'CREATE') {
                return
              }
              VirtualServiceStore.setFormFields({
                ...formFields,
                name: event.target.value
              })
            }}
          />
        </Box>
        <Box style={{ marginTop: 20 }}>
          <TextField
            fullWidth
            label='Display Name'
            variant='outlined'
            size='small'
            value={formFields.displayName ? formFields.displayName : ''}
            onChange={(event) => {
              VirtualServiceStore.setFormFields({
                ...formFields,
                displayName: event.target.value
              })
            }}
          />
        </Box>
        <Box style={{ marginTop: 20 }}>
          <TextField
            fullWidth
            label='Proximity Url'
            variant='outlined'
            size='small'
            value={formFields.proximityUrl ? formFields.proximityUrl : ''}
            onChange={(event) => {
              VirtualServiceStore.setFormFields({
                ...formFields,
                proximityUrl: event.target.value
              })
            }}
          />
        </Box>
        <Box style={{ marginTop: 20 }}>
          <TextField
            fullWidth
            label='Target Url'
            variant='outlined'
            size='small'
            value={formFields.targetUrl ? formFields.targetUrl : ''}
            onChange={(event) => {
              VirtualServiceStore.setFormFields({
                ...formFields,
                targetUrl: event.target.value
              })
            }}
          />
        </Box>
        {viewMode === 'UPDATE' ? (
          <React.Fragment>
            <Box style={{ marginTop: 20 }}>
              <TextField
                fullWidth
                label='Service Id'
                variant='outlined'
                size='small'
                value={formFields.id ? formFields.id : ''}
              />
            </Box>
            <Box style={{ marginTop: 20 }}>
              <TextField
                fullWidth
                type={this.state.showSecret ? 'text' : 'password'}
                label='Auth Key'
                variant='outlined'
                size='small'
                value={virtualService.authKey ? virtualService.authKey : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <IconButton
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
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          </React.Fragment>
        ) : null}
        {this.props.actionButtons}
      </Box>
    )
  }
}

export default observer(VirtualServiceDetailsCard)
