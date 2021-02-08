import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { MaterialBox } from 'libs/material'
import AppBar from './AppBar.react'
import SideBar from './SideBar.react'


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2d9cdb'
    },
    secondary: {
      main: '#ff0000'
    },
    text: {
      primary: '#4f4f4f'
    }
  }
})


class AdminLayout extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <AppBar/>
        <SideBar/>
        <MaterialBox component='main'
           style={{
              paddingTop: 48, color:theme.palette.text.primary,
              backgroundColor: '#fafafa'
            }}
          >
          {this.props.children}
        </MaterialBox> 
      </ThemeProvider>
    )
  }
}

export default observer(AdminLayout)
