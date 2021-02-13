import React, { Component } from 'react'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { observer } from 'mobx-react'
import VirtualServicesPage from '/mxr-web/apps/proximity/src/pages/virtual-services/VirtualServicesPage.react'

export class VirtualServices extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route
            path='/proximity/virtual-services'
            component={VirtualServicesPage}
          />
        </Switch>
      </Router>
    )
  }
}

export default observer(VirtualServices)
