import React, { Component, useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import Box from '@material-ui/core/Box'
import { axiosInstance } from '/mxr-web/apps/proximity/src/libs/axios/axios.lib'
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

const AdminLayout = ({ children }) => {
  const {
    isAuthenticated,
    loginWithRedirect,
    isLoading,
    error,
    getAccessTokenSilently,
    user
  } = useAuth0()

  const [isAppLoading, setIsAppLoading] = useState(false)
  const { push } = useHistory()
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect()
    }

    if (isAuthenticated && !isLoading) {
      setIsAppLoading(true)
      getAccessTokenSilently().then((token) => {
        console.log(token)
        setIsAppLoading(false)
      })
    }
  }, [isAuthenticated, isLoading])

  if (isLoading || !isAuthenticated || isAppLoading) {
    return <div>Loading..</div>
  }

  return (
    <ThemeProvider theme={theme}>
      <AppBar />
      <SideBar />
      <Box
        component='main'
        style={{
          paddingTop: 48,
          color: theme.palette.text.primary,
          backgroundColor: '#fafafa'
        }}
      >
        {children}
      </Box>
    </ThemeProvider>
  )
}

export default observer(AdminLayout)
