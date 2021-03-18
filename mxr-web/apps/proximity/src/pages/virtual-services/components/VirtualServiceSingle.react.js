import { Fragment } from 'react'
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
import VirtualServicePoliciesCard from './VirtualServicePoliciesCard.react'

const VirtualServiceSingle = () => {
  const { path } = useRouteMatch()
  const { push } = useHistory()
  const { id: virtualServiceId } = useParams()
  const viewMode = virtualServiceId ? 'UPDATE' : 'CREATE'
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
          </Box>
          <Divider />
        </Fragment>
      ) : null}
      <Switch>
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
