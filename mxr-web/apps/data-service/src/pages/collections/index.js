import { useEffect } from 'react'
import Page from '../../layouts/page.react'
import {
  Switch,
  Route,
  useHistory,
  useRouteMatch,
  useParams
} from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { axiosMasterDataserviceInstance } from '../../libs/axios/axios'
import List from './list/list.react'
import Create from './create/create.react'
import { ReactComponent as DatabaseIcon } from '../../assets/icons/database.svg'
import databaseStore from '../../store/database.store'
import collectionStore from '../../store/collection.store'

const Collections = () => {
  let { path } = useRouteMatch()
  const { id } = useParams()
  const { push } = useHistory()
  path = path.replace(':id', id)
  const database = databaseStore.getDatabase()

  const fetchDatabase = async () => {
    const response = await axiosMasterDataserviceInstance.get(`/database/${id}`)
    const database = response.data
    databaseStore.setDatabase(database)
  }

  useEffect(() => {
    fetchDatabase()

    return () => {
      databaseStore.resetAllFields()
      collectionStore.resetAllFields()
    }
  }, [])

  return (
    <Page
      icon={<DatabaseIcon />}
      title='Collections'
      subtitle={database ? database.displayName : ''}
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

export default observer(Collections)
