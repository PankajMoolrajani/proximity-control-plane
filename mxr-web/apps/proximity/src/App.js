import React, { Component } from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import { observer } from 'mobx-react'
import AdminLayout from '/mxr-web/apps/proximity/src/components/AdminLayout'
import Home from '/mxr-web/apps/proximity/src/pages/Home/Home.react'
import VirtualServices from '/mxr-web/apps/proximity/src/pages/virtual-services'
import Policies from '/mxr-web/apps/proximity/src/pages/policies'

const App = () => {
  return (
    <Router>
      <AdminLayout>
        <Switch>
          {/* <Route
            path='/proximity/virtual-services'
            component={VirtualServices}
          />
          <Route path='/proximity/policies' component={Policies} /> */}
          <Route path='/' component={Home} />
        </Switch>
      </AdminLayout>
    </Router>
  )
}

export default observer(App)
