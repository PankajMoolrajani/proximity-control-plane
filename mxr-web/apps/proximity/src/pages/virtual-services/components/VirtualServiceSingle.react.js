import { Fragment, useEffect } from 'react'
import { observer } from 'mobx-react'
import {
  Switch,
  Route,
  useRouteMatch,
  useParams,
  useHistory
} from 'react-router-dom'
import { Box, Button, Divider } from '@material-ui/core'
import VirtualServiceDetailsCard from './VirtualServiceDetailsCard.react'
import VirtualServiceDeploymentCard from './VirtualServiceDeploymentCard.react'
import VirtualServiceAccessLogsCard from './VirtualServiceAccessLogsCard.react'
import VirtualServiceDecisionLogsCard from './VirtualServiceDecisionLogs.react'
import VirtualServiceMonitorCard from './VirtualServiceMonitorCard.react'
import VirtualServicePoliciesCard from './VirtualServicePoliciesCard.react'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import stores from '../../../stores/proximity.store'
const { virtualServiceStore } = stores

const VirtualServiceSingle = () => {
  const { path } = useRouteMatch()
  const { push } = useHistory()
  const { id: virtualServiceId } = useParams()
  const viewMode = virtualServiceId ? 'UPDATE' : 'CREATE'

  useEffect(() => {
    return () => {
      virtualServiceStore.resetAllFields()
    }
  }, [])
  return (
    <Box>
      {viewMode === 'UPDATE' ? (
        <Fragment>
          <Box
            style={{
              display: 'flex',
              padding: '0 24px'
            }}
          >
            <Button
              onClick={() => push(`/virtual-services/${virtualServiceId}`)}
              style={{
                fontWeight: 400,
                marginRight: 10,
                paddingLeft: 0
              }}
            >
              Details
            </Button>
            <Button
              onClick={() =>
                push(`/virtual-services/${virtualServiceId}/deploy`)
              }
              style={{
                fontWeight: 400,
                marginRight: 10,
                paddingLeft: 0
              }}
            >
              Deploy
            </Button>
            <Button
              onClick={() =>
                push(`/virtual-services/${virtualServiceId}/policies`)
              }
              style={{
                fontWeight: 400,
                marginRight: 10,
                paddingLeft: 0
              }}
            >
              Policies
            </Button>
            <Button
              onClick={() =>
                push(`/virtual-services/${virtualServiceId}/access-logs`)
              }
              style={{
                fontWeight: 400,
                marginRight: 10,
                paddingLeft: 0
              }}
            >
              Access Logs
            </Button>
            <Button
              onClick={() =>
                push(`/virtual-services/${virtualServiceId}/decision-logs`)
              }
              style={{
                fontWeight: 400,
                marginRight: 10,
                paddingLeft: 0
              }}
            >
              Decision Logs
            </Button>
            <Button
              onClick={() =>
                push(`/virtual-services/${virtualServiceId}/health-monitor`)
              }
              style={{
                fontWeight: 400,
                marginRight: 10,
                paddingLeft: 0
              }}
            >
              Monitor
            </Button>
          </Box>
          <Divider />
        </Fragment>
      ) : null}
      <Switch>
        <Route path={`${path}/health-monitor`}>
          <VirtualServiceMonitorCard virtualServiceId={virtualServiceId} />
        </Route>
        <Route path={`${path}/decision-logs`}>
          <VirtualServiceDecisionLogsCard virtualServiceId={virtualServiceId} />
        </Route>
        <Route path={`${path}/access-logs`}>
          <VirtualServiceAccessLogsCard virtualServiceId={virtualServiceId} />
        </Route>
        <Route path={`${path}/deploy`}>
          <VirtualServiceDeploymentCard virtualServiceId={virtualServiceId} />
        </Route>
        <Route path={`${path}/policies`}>
          <VirtualServicePoliciesCard virtualServiceId={virtualServiceId} />
        </Route>
        <Route path={path}>
          <VirtualServiceDetailsCard virtualServiceId={virtualServiceId} />
        </Route>
      </Switch>
    </Box>
  )
}

export default observer(VirtualServiceSingle)
