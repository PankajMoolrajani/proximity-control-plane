import { useState, useEffect } from 'react';
import Main from './layouts/main.react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import DataSources from './pages/data-sources'
import Models from './pages/models'
import PageBuilder from './pages/page-builder'
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const { isAuthenticated, loginWithRedirect } = useAuth0()
  // console.log(isAuthenticated);
  // useEffect(() => {
  //   if(!isAuthenticated) {
  //     loginWithRedirect()
  //   }
  // }, [isAuthenticated])

  return (
    <Router basename='nocode'>
      <Main className="App">
        <Switch>
          <Route path="/page-builder">
            <PageBuilder />
          </Route>
          <Route path="/models">
            <Models />
          </Route>
          <Route path="/data-sources">
            <DataSources />
          </Route>
          <Route path="/">
            <Redirect to='/'/>
            <Dashboard />
          </Route> 
        </Switch>
      </Main>
    </Router>
  )
}

export default App
