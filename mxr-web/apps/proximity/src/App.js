import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { observer } from 'mobx-react'
import AdminLayout from '/mxr-web/apps/proximity/src/components/AdminLayout'
import Home from '/mxr-web/apps/proximity/src/pages/Home/Home.react'
import VirtualServices from '/mxr-web/apps/proximity/src/pages/virtual-services'
import Policies from '/mxr-web/apps/proximity/src/pages/policies'

const SRS = () => {
  return (
    <AdminLayout>
      <Switch>
        {/* <Route
            path='/proximity/virtual-services'
            component={VirtualServices}
          />
          <Route path='/proximity/policies' component={Policies} /> */}
        <Route path='/proximity' component={Home} />
      </Switch>
    </AdminLayout>
  )
}

export default observer(SRS)
