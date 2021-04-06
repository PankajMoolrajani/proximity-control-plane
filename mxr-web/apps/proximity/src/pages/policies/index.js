import { useEffect } from 'react'
import { observer } from 'mobx-react'
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom'
import { Box, Button, Typography } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import PolicyIcon from '@material-ui/icons/Policy'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ListIcon from '@material-ui/icons/List'
import PageLayout from '/mxr-web/apps/proximity/src/components/PageLayout'
import PolicyListCard from '/mxr-web/apps/proximity/src/pages/policies/components/PolicyListCard.react'
import PolicySingle from '/mxr-web/apps/proximity/src/pages/policies/components/PolicySingle.react'
import PolicyDetailsCard from '/mxr-web/apps/proximity/src/pages/policies/components/PolicyDetailsCard.react'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const { policyStore, virtualServiceStore, logStore } = stores

const Policies = () => {
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
          <PolicyIcon />
        </Box>
        <Typography variant='h5'>Policies</Typography>
      </Box>
    )
  }

  const _renderSelectedObjectTitle = () => {
    const selectedObject = policyStore.getSelectedObject()
    let lastPolicyRevision
    if (selectedObject.PolicyRevisions) {
      const policyRevisions = JSON.parse(
        JSON.stringify(selectedObject.PolicyRevisions)
      )
      lastPolicyRevision = policyRevisions.reverse()[0]
    }
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
          <Box style={{ marginTop: 5, fontSize: 14 }}>
            <b>REVISION:</b> rev-
            {lastPolicyRevision
              ? lastPolicyRevision.id.split('-').reverse()[0]
              : ''}
          </Box>
        </Box>
      </Box>
    )
  }

  const _renderObjectHeader = () => {
    const selectedObject = policyStore.getSelectedObject()
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
        <Route path={`${path}/create`} component={PolicyDetailsCard} />
        <Route path={`${path}/:id`} component={PolicySingle} />
        <Route path={path} component={PolicyListCard} />
      </Switch>
    </PageLayout>
  )
}

export default observer(Policies)
