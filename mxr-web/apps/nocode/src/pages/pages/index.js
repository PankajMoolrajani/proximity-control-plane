import Page from '../../layouts/page.react'
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom'
import List from './list'
import Builder from './builder'
import Create from './create'

const Pages = () => {
  const { path } = useRouteMatch()
  const { push } = useHistory()
  return (
    <Page
      title='Pages'
      onCreate={() => push(`${path}/create`)}
      onShowAll={() => push(path)}
    >
      <Switch>
        <Route path={`${path}/builder/:id`}>
          <Builder />
        </Route>
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

export default Pages
