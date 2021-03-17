import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom'
import List from './list/list.react'
import Create from './create/create.react'
import Collections from '../collections'
import Relations from '../relations'
import RestApiDoc from '../rest-apis/restApis.react'
import GraphqlDoc from '../graphql/graphql.react'

const DataSources = () => {
  const { path } = useRouteMatch()
  return (
    <Switch>
      <Route path={`${path}/:id/graphql`} component={GraphqlDoc} />
      <Route path={`${path}/:id/rest-api`} component={RestApiDoc} />
      <Route path={`${path}/:id/collections`} component={Collections} />
      <Route path={`${path}/:id/relations`} component={Relations} />
      <Route path={`${path}/create`} component={Create} />
      <Route path={path} component={List} />
    </Switch>
  )
}

export default DataSources
