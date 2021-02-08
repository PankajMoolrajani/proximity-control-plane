import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { withRouter } from 'react-router'
import {
  MaterialDrawer,
  MaterialList,
  MaterialDivider,
  MaterialListItem,
  MaterialTypography,
  MaterialListItemIcon,
  MaterialListItemText
} from 'libs/material'
import HomeIcon from '@material-ui/icons/Home'
import PolicyIcon from '@material-ui/icons/Policy'
import CodeIcon from '@material-ui/icons/Code'
import LayoutStore from 'apps/proximity/stores/Layout.store'


class SideBar extends Component {
  render() {
    const showMenu = LayoutStore.getShowMenu()
    return (
      <MaterialDrawer 
        open={showMenu} 
        onClose={() => LayoutStore.setShowMenu(false)}
      >
        <MaterialTypography variant='h6' style={{padding:8}} noWrap>
          Proximity
        </MaterialTypography>
        <MaterialDivider/>
        <MaterialList style={{ width: 250 }}>
          <MaterialListItem  
            onClick={() => this.props.history.push('/proximity/')}
            button 
            dense
          >
            <MaterialListItemIcon>
              <HomeIcon />
            </MaterialListItemIcon>
            <MaterialListItemText primary='Home' />
          </MaterialListItem>
          <MaterialListItem 
            onClick={() => this.props.history.push('/proximity/virtual-services')}
            button 
            dense
          >
            <MaterialListItemIcon>
              <CodeIcon />
            </MaterialListItemIcon>
            <MaterialListItemText primary='Virtual Services' />
          </MaterialListItem>
          <MaterialListItem 
           onClick={() => this.props.history.push('/proximity/policies')}
           button 
           dense
          >
            <MaterialListItemIcon>
              <PolicyIcon />
            </MaterialListItemIcon>
            <MaterialListItemText primary='Policies' />
          </MaterialListItem>
        </MaterialList>
      </MaterialDrawer>
    )
  }
}


export default withRouter(observer(SideBar))
