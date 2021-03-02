import Page from '../../layouts/page.react'
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom'
import List from './list/list.react'
import Create from './create/create.react'
import { ReactComponent as DatabaseIcon } from '../../assets/icons/database.svg'
import userStore from '../../store/user.store'

const DataSources = () => {
  const { path } = useRouteMatch()
  const { push } = useHistory()
  return (
    <Page
      icon={<DatabaseIcon />}
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
