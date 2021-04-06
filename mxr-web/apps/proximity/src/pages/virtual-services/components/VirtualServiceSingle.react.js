import { Fragment, useEffect } from 'react'
import { observer } from 'mobx-react'
import {
  Switch,
  Route,
  useRouteMatch,
  useParams,
  useHistory,
  useLocation
} from 'react-router-dom'
import { Box, Button, Divider } from '@material-ui/core'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import VirtualServiceDetailsCard from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServiceDetailsCard.react'
import VirtualServiceDeploymentCard from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServiceDeploymentCard.react'
import VirtualServiceAccessLogsCard from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServiceAccessLogsCard.react'
import VirtualServiceDecisionLogsCard from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServiceDecisionLogs.react'
import VirtualServiceMonitorCard from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServiceMonitorCard.react'
import VirtualServicePoliciesCard from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServicePoliciesCard.react'
import VirtualServicePolicyRecommendationCard from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServicePolicyRecommendationCard.react'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const { virtualServiceStore } = stores

const VirtualServiceSingle = () => {
  const { path } = useRouteMatch()
  const { push } = useHistory()
  const { id: virtualServiceId } = useParams()
  const { pathname } = useLocation()
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
                fontWeight:
                  path.replace(':id', virtualServiceId) === pathname
                    ? 600
                    : 400,
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
                fontWeight: pathname.includes('deploy') ? 600 : 400,
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
                fontWeight: pathname.includes('policies') ? 600 : 400,
                marginRight: 10,
                paddingLeft: 0
              }}
            >
              Policies
            </Button>
            <Button
              onClick={() =>
                push(
                  `/virtual-services/${virtualServiceId}/policy-recommendations`
                )
              }
              style={{
                fontWeight: pathname.includes('policy-recommendations')
                  ? 600
                  : 400,
                marginRight: 10,
                paddingLeft: 0
              }}
            >
              Policy Recommendations
            </Button>
            <Button
              onClick={() =>
                push(`/virtual-services/${virtualServiceId}/access-logs`)
              }
              style={{
                fontWeight: pathname.includes('access-logs') ? 600 : 400,
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
                fontWeight: pathname.includes('decision-logs') ? 600 : 400,
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
                fontWeight: pathname.includes('health-monitor') ? 600 : 400,
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
        <Route path={`${path}/policy-recommendations`}>
          <VirtualServicePolicyRecommendationCard
            virtualServiceId={virtualServiceId}
          />
        </Route>
        <Route path={path}>
          <VirtualServiceDetailsCard virtualServiceId={virtualServiceId} />
        </Route>
      </Switch>
    </Box>
  )
}

export default observer(VirtualServiceSingle)
