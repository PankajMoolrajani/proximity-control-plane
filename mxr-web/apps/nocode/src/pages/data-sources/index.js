import Page from '../../layouts/page.react'
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom'
import List from './components/list.react'
import Create from './components/create.react'

const DataSources = () => {
  const { path } = useRouteMatch()
  const { push } = useHistory()
  return (
    <Page
      title='Data Sources'
      onCreate={() => push(`${path}/create`)}
      onShowAll={() => push(path)}
    >
      <Switch>
        <Route path={`${path}/create`}>
          <Create />
        </Route>
        <Route path={path}>
          <List />
        </Route>
      </Switch>
    </Page>
  )
}

export default DataSources
