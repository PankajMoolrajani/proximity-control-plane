import Page from '../../layouts/page.react'
import {
  Switch,
  Route,
  useHistory,
  useRouteMatch,
  useParams
} from 'react-router-dom'
import List from './list/list.react'
import Create from './create/create.react'
import { ReactComponent as DatabaseIcon } from '../../assets/icons/database.svg'

const Collections = () => {
  let { path } = useRouteMatch()
  const { id } = useParams()
  const { push } = useHistory()
  path = path.replace(':id', id)
  return (
    <Page
      icon={<DatabaseIcon />}
      title='Collections'
      onCreate={() => push(`${path}/create`)}
      onShowAll={() => push(path)}
    >
      <Switch>
        <Route path={`${path}/create`}>
          <Create databaseId={id} />
        </Route>
        <Route path={path}>
          <List databaseId={id} />
        </Route>
      </Switch>
    </Page>
  )
}

export default Collections
