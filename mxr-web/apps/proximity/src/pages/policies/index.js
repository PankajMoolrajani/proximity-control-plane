import React, { Component } from 'react'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { observer } from 'mobx-react'
import PolicyPage from '/mxr-web/apps/proximity/src/pages/policies/PolicyPage.react'


export class Policies extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route
            path='/proximity/policies'
            component={PolicyPage}
          />
        </Switch>
      </Router>
    )
  }
}


export default observer(Policies)
