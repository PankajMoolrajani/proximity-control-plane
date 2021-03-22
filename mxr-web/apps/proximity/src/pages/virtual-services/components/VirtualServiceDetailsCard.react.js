import { Fragment, useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import { v4 as uuid } from 'uuid'
import { useHistory, useParams } from 'react-router-dom'
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Button
} from '@material-ui/core'
import PlatformLoaderCard from '../../../components/platform/PlatformLoaderCard.react'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import stores from '../../../stores/proximity.store'
const { virtualServiceStore } = stores

const VirtualServiceDetailsCard = ({ virtualServiceId }) => {
  const [showSecret, setShowSecret] = useState(false)
  const { push } = useHistory()
  const formFields = virtualServiceStore.getFormFields()
  const virtualService = virtualServiceStore.getSelectedObject()
  const viewMode = virtualServiceId ? 'UPDATE' : 'CREATE'
  const showLoader = virtualServiceStore.getShowProcessCard()
  const fetchVirtualSeviceById = async () => {
    virtualServiceStore.setShowProcessCard(true)
    try {
      const virtualService = await virtualServiceStore.objectQueryById(
        virtualServiceId
      )
      if (virtualService) {
        virtualServiceStore.setSelectedObject(virtualService)
        virtualServiceStore.setFormFields({
          id: virtualService.id,
          name: virtualService.name,
          displayName: virtualService.displayName,
          proximityUrl: virtualService.proximityUrl,
          targetUrl: virtualService.targetUrl,
          authKey: virtualService.authKey
        })
      }
    } catch (error) {
      virtualServiceStore.setShowProcessCard(false)
      console.log(error)
    }
    virtualServiceStore.setShowProcessCard(false)
  }

  useEffect(() => {
    if (virtualServiceId) {
      fetchVirtualSeviceById()
    } else {
      virtualServiceStore.setFormFields({
        name: '',
        displayName: '',
        proximityUrl: '',
        targetUrl: '',
        authKey: ''
      })
      virtualServiceStore.setSelectedObject(null)
    }
  }, [virtualServiceId])

  if (showLoader && (virtualService || formFields)) {
    return (
      <Box style={{ margin: 50 }}>
        <PlatformLoaderCard />
      </Box>
    )
  }

  const _renderCreateButton = () => {
    return (
      <Button
        variant='contained'
        color='primary'
        style={{ marginTop: 20 }}
        onClick={async () => {
          virtualServiceStore.setShowProcessCard(true)
          try {
            await virtualServiceStore.objectCreate()
            virtualServiceStore.resetAllFields()
            push('/virtual-services')
          } catch (error) {
            virtualServiceStore.setShowProcessCard(false)
            console.log(error)
          }
          virtualServiceStore.setShowProcessCard(false)
        }}
      >
        Create
      </Button>
    )
  }

  const _renderUpdateButton = () => {
    return (
      <Button
        variant='contained'
        color='primary'
        style={{ marginTop: 20 }}
        onClick={async () => {
          virtualServiceStore.setShowProcessCard(true)
          try {
            const updatedVirtualService = await virtualServiceStore.objectUpdate()
            virtualServiceStore.setFormFields({
              id: updatedVirtualService.id,
              name: updatedVirtualService.name,
              displayName: updatedVirtualService.displayName,
              proximityUrl: updatedVirtualService.proximityUrl,
              targetUrl: updatedVirtualService.targetUrl,
              authKey: updatedVirtualService.authKey
            })
          } catch (error) {
            virtualServiceStore.setShowProcessCard(false)
            console.log(error)
          }
          virtualServiceStore.setShowProcessCard(false)
        }}
      >
        Update
      </Button>
    )
  }

  return (
    <Box style={{ maxWidth: 700, padding: 24 }}>
      <Box>
        <TextField
          fullWidth
          label='Name'
          variant='outlined'
          size='small'
          value={formFields ? formFields.name : ''}
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
      </Box>
      <Box style={{ marginTop: 20 }}>
        <TextField
          fullWidth
          label='Display Name'
          variant='outlined'
          size='small'
          value={formFields ? formFields.displayName : ''}
          onChange={(event) => {
            virtualServiceStore.setFormFields({
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
          value={formFields ? formFields.proximityUrl : ''}
          onChange={(event) => {
            virtualServiceStore.setFormFields({
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
          value={formFields ? formFields.targetUrl : ''}
          onChange={(event) => {
            virtualServiceStore.setFormFields({
              ...formFields,
              targetUrl: event.target.value
            })
          }}
        />
      </Box>
      <Box style={{ marginTop: 20 }}>
        <TextField
          fullWidth
          type={showSecret ? 'text' : 'password'}
          label='Auth Key'
          variant='outlined'
          size='small'
          value={formFields ? formFields.authKey : ''}
          InputProps={{
            endAdornment: (
              <InputAdornment>
                <IconButton
                  onClick={() => {
                    virtualServiceStore.setFormFields({
                      ...formFields,
                      authKey: uuid().replaceAll('-', '')
                    })
                  }}
                >
                  <VpnKeyIcon />
                </IconButton>
                <IconButton
                  onClick={() =>
                    setShowSecret((prevShowSecret) => !prevShowSecret)
                  }
                >
                  {showSecret ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>
      {viewMode === 'UPDATE' ? (
        <Fragment>
          <Box style={{ marginTop: 20 }}>
            <TextField
              fullWidth
              label='Service Id'
              variant='outlined'
              size='small'
              value={formFields ? formFields.id : ''}
            />
          </Box>
        </Fragment>
      ) : null}
      {viewMode === 'CREATE' ? _renderCreateButton() : _renderUpdateButton()}
    </Box>
  )
}

export default observer(VirtualServiceDetailsCard)
