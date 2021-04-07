import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { withRouter } from 'react-router'
import {
  Drawer,
  List,
  Divider,
  ListItem,
  Typography,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'
import PolicyIcon from '@material-ui/icons/Policy'
import CodeIcon from '@material-ui/icons/Code'
import LayoutStore from '/mxr-web/apps/proximity/src/stores/Layout.store'

class SideBar extends Component {
  render() {
    const showMenu = LayoutStore.getShowMenu()
    return (
      <Drawer open={showMenu} onClose={() => LayoutStore.setShowMenu(false)}>
        <Typography variant='h6' style={{ padding: 8 }} noWrap>
          Proximity
        </Typography>
        <Divider />
        <List style={{ width: 250 }}>
          <ListItem
            onClick={() => this.props.history.push('/proximity/')}
            button
            dense
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary='Home' />
          </ListItem>
          <ListItem
            onClick={() => this.props.history.push('/virtual-services')}
            button
            dense
          >
            <ListItemIcon>
              <CodeIcon />
            </ListItemIcon>
            <ListItemText primary='Virtual Services' />
          </ListItem>
          <ListItem
            onClick={() => this.props.history.push('/policies')}
            button
            dense
          >
            <ListItemIcon>
              <PolicyIcon />
            </ListItemIcon>
            <ListItemText primary='Policies' />
          </ListItem>
        </List>
      </Drawer>
    )
  }
}

export default withRouter(observer(SideBar))
