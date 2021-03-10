import Main from './layouts/main.react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import Dashboard from './pages/dashboard'
import DataSources from './pages/data-sources'
// import Pages from './pages/pages'
import View from './pages/pages/view'
import CreateOrg from './pages/createOrg'
import { observer } from 'mobx-react-lite'

const App = () => {
  return (
    <Router basename='nocode'>
      <Switch>
        <Route path='/view/:dbName/:id'>
          <View />
        </Route>
        <Main className='App'>
          {/* <Route path='/pages' component={Pages} /> */}
          <Route path='/data-sources' component={DataSources} />
          <Route path='/create-org' component={CreateOrg} />
          <Route exact path='/'>
            <Redirect to='/' />
            <Dashboard />
          </Route>
        </Main>
      </Switch>
    </Router>
  )
}

export default observer(App)
