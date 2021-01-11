import { useState, useEffect } from 'react'
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
import PageBuilder from './pages/page-builder'
import { useAuth0 } from '@auth0/auth0-react'
import userStore from './store/user.store'
import { observer } from 'mobx-react-lite'

const App = (props) => {
  const {
    isAuthenticated,
    loginWithRedirect,
    isLoading,
    error,
    getAccessTokenSilently
  } = useAuth0()
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect()
    }

    if (isAuthenticated && !isLoading) {
      getAccessTokenSilently().then((token) => userStore.setAccessToken(token))
    }
  }, [isAuthenticated, isLoading])

  if (isLoading || !isAuthenticated) {
    return <div>Loading..</div>
  }

  return (
    <Router basename='nocode'>
      <Main className='App'>
        <Switch>
          <Route path='/page-builder'>
            <PageBuilder />
          </Route>
          <Route path='/models'>
            <Models />
          </Route>
          <Route path='/data-sources'>
            <DataSources />
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
