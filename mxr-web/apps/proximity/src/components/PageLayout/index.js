import React, { Component } from 'react'
import { observer } from 'mobx-react'
import {
  Grid,
  Box,
  List,
  Divider,
  ListItem,
  Typography,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'

class PageLayout extends Component {
  render() {
    return (
      <Box style={{ flexGrow: 1, textAlign: 'left' }}>
        <Grid container>
          {this.props.sideMenuList && this.props.sideMenuList.length > 0 ? (
            <Grid item sm={2}>
              <Box
                style={{
                  height: '100vh',
                  overflowY: 'auto',
                  borderRight: '1.1px solid rgba(0,0,0,.12)'
                }}
              >
                <Box style={{ padding: 10 }}>
                  <Box>{this.props.pageIcon}</Box>
                  <Typography variant='h6'>{this.props.title}</Typography>
                </Box>
                <Divider />
                <Box>
                  <List style={{ width: 250 }}>
                    {this.props.sideMenuList.map((item) => (
                      <ListItem key={Math.random()} button dense>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.title} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            </Grid>
          ) : null}
          <Grid
            item
            sm={
              this.props.sideMenuList && this.props.sideMenuList.length > 0
                ? 10
                : 12
            }
          >
            <Box
              style={{
                display: 'flex',
                padding: '10px 24px',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              {this.props.title}
              {this.props.actionButtons}
            </Box>
            <Divider />
            <Box>{this.props.children}</Box>
          </Grid>
        </Grid>
      </Box>
    )
  }
}

export default observer(PageLayout)
