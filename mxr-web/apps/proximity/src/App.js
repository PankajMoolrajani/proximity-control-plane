import React, { Component } from 'react'
import {
  Route,
  Switch,
  BrowserRouter as Router,
  Redirect
} from 'react-router-dom'
import { observer } from 'mobx-react'
import AdminLayout from '/mxr-web/apps/proximity/src/components/AdminLayout'
import Home from '/mxr-web/apps/proximity/src/pages/Home/Home.react'
import VirtualServices from '/mxr-web/apps/proximity/src/pages/virtual-services'
import Policies from '/mxr-web/apps/proximity/src/pages/policies'
import 'primereact/resources/primereact.min.css'
import '/mxr-web/apps/proximity/src/assets/css/saga-theme.css'
import 'primeicons/primeicons.css'

const App = () => {
  return (
    <Router basename='/proximity'>
      <AdminLayout>
        <Switch>
          <Route path='/virtual-services' component={VirtualServices} />
          <Route path='/policies' component={Policies} />
          <Route path='/' component={Home} />
          <Redirect to='/virtual-services' from='/' />
        </Switch>
      </AdminLayout>
    </Router>
  )
}

export default observer(App)
