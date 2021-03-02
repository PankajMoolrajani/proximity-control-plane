import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { withRouter } from 'react-router'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
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
