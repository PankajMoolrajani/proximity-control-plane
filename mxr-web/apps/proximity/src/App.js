import { useState, useEffect } from 'react'
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
import CreateOrg from '/mxr-web/apps/proximity/src/pages/create-org'
import 'primereact/resources/primereact.min.css'
import '/mxr-web/apps/proximity/src/assets/css/saga-theme.css'
import 'primeicons/primeicons.css'
import orgStore from '/mxr-web/apps/proximity/src/stores/org.store'

const App = () => {
  const userOrgs = orgStore.getUserOrgs()
  return (
    <Router basename='/proximity'>
      <AdminLayout>
        {userOrgs && userOrgs.Orgs.length > 0 ? (
          <Switch>
            <Route path='/virtual-services' component={VirtualServices} />
            <Route path='/policies' component={Policies} />
            <Route path='/' exact component={Home} />
          </Switch>
        ) : (
          <Switch>
            <Route path='/create-org' component={CreateOrg} />
          </Switch>
        )}
      </AdminLayout>
    </Router>
  )
}

export default observer(App)
