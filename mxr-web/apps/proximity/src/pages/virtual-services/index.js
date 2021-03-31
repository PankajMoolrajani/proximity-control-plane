import { useEffect } from 'react'
import { observer } from 'mobx-react'
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom'
import { Box, Button, Typography } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import CodeIcon from '@material-ui/icons/Code'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ListIcon from '@material-ui/icons/List'
import PageLayout from '../../components/PageLayout'
import VirtualServiceListCard from '../virtual-services/components/VirtualServiceListCard.react'
import VirtualServiceSingle from '../virtual-services/components/VirtualServiceSingle.react'
import VirtualServiceDetailsCard from '../virtual-services/components/VirtualServiceDetailsCard.react'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const { policyStore, virtualServiceStore, logStore } = stores

const VirtualServices = () => {
  const { path } = useRouteMatch()
  const { push } = useHistory()
  useEffect(() => {
    return () => {
      virtualServiceStore.resetAllFields()
      policyStore.resetAllFields()
      logStore.resetAllFields()
    }
  }, [])

  const _renderTitle = () => {
    return (
      <Box
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Box style={{ marginRight: 25 }}>
          <CodeIcon />
        </Box>
        <Typography variant='h5'>Virtual Services</Typography>
      </Box>
    )
  }

  const _renderSelectedObjectTitle = () => {
    const selectedObject = virtualServiceStore.getSelectedObject()
    return (
      <Box
        style={{
          display: 'flex',
          alignItems: 'top'
        }}
      >
        <Box
          style={{
            color: 'green',
            marginRight: 20
          }}
        >
          <CheckCircleIcon color='inherit' />
        </Box>
        <Box>
          <Box style={{ fontSize: 20 }}>{selectedObject.name}</Box>
        </Box>
      </Box>
    )
  }

  const _renderObjectHeader = () => {
    const selectedObject = virtualServiceStore.getSelectedObject()
    const viewMode = selectedObject ? 'UPDATE' : 'CREAT'
    return (
      <Box>
        {viewMode === 'UPDATE' ? _renderSelectedObjectTitle() : _renderTitle()}
      </Box>
    )
  }

  const _renderButtons = () => {
    return (
      <Box>
        <Button
          color='primary'
          size='small'
          startIcon={<AddIcon />}
          style={{ fontWeight: 700 }}
          onClick={() => push(`${path}/create`)}
        >
          Create
        </Button>
        <Button
          color='primary'
          size='small'
          startIcon={<ListIcon />}
          style={{ fontWeight: 700 }}
          onClick={() => push(`${path}`)}
        >
          Show All
        </Button>
      </Box>
    )
  }

  return (
    <PageLayout title={_renderObjectHeader()} actionButtons={_renderButtons()}>
      <Switch>
        <Route path={`${path}/create`} component={VirtualServiceDetailsCard} />
        <Route path={`${path}/:id`} component={VirtualServiceSingle} />
        <Route path={path} component={VirtualServiceListCard} />
      </Switch>
    </PageLayout>
  )
}

export default observer(VirtualServices)
