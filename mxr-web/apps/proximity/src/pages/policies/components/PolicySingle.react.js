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
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import PolicyDetailsCard from './PolicyDetailsCard.react'
import stores from '../../../stores/proximity.store'
const { policyStore } = stores

const PolicySingle = () => {
  const { path } = useRouteMatch()
  const { push } = useHistory()
  const { id: policyId } = useParams()
  const viewMode = policyId ? 'UPDATE' : 'CREATE'

  useEffect(() => {
    return () => {
      policyStore.resetAllFields()
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
              onClick={() => push(`/policies/${policyId}`)}
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
                push(`/policies/${policyId}/revisions`)
              }
              style={{
                fontWeight: 400,
                marginRight: 10,
                paddingLeft: 0
              }}
            >
              Revisions
            </Button>
            <Button
              onClick={() =>
                push(`/policies/${policyId}/decision-logs`)
              }
              style={{
                fontWeight: 400,
                marginRight: 10,
                paddingLeft: 0
              }}
            >
              Decision Logs
            </Button> 
          </Box>
          <Divider />
        </Fragment>
      ) : null}
      <Switch> 
        <Route path={path}>
          <PolicyDetailsCard policyId={policyId} />
        </Route>
      </Switch>
    </Box>
  )
}

export default observer(PolicySingle)
