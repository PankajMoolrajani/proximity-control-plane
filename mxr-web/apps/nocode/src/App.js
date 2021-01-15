import Main from './layouts/main.react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import Dashboard from './pages/dashboard'
import DataSources from './pages/data-sources'
import Models from './pages/models'
import Pages from './pages/page-builder'
import CreateOrg from './pages/createOrg'
import { observer } from 'mobx-react-lite'

const App = () => {
  return (
    <Router basename='nocode'>
      <Main className='App'>
        <Switch>
          <Route path='/pages'>
            <Pages />
          </Route>
          <Route path='/models'>
            <Models />
          </Route>
          <Route path='/data-sources'>
            <DataSources />
          </Route>
          <Route path='/create-org'>
            <CreateOrg />
          </Route>
          <Route path='/'>
            <Redirect to='/' />
            <Dashboard />
          </Route>
        </Switch>
      </Main>
    </Router>
  )
}

export default observer(App)
