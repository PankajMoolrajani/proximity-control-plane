import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import AppBarTop from './components/AppBar.react'
import Sidebar from './components/Sidebar.react'
import axiosSecureInstance from '../libs/axios/axios'
import { useHistory } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import userStore from '../store/user.store'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight: {
    height: 240
  }
}))

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

const Main = ({ children }) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)

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
        userStore.setAccessToken(token)
        console.log(token)
        axiosSecureInstance
          .post('/auth/login', {
            user: user
          })
          .then(({ data }) => {
            const user = data
            console.log(user)
            if (user.Orgs && user.Orgs.length > 0) {
              user.Orgs.forEach((org) => {
                if (org.OrgUsers.isDefault) {
                  userStore.setCurOrg(org)
                }
              })
            } else {
              push('/create-org')
            }

            setIsAppLoading(false)
          })
      })
    }
  }, [isAuthenticated, isLoading])

  if (isLoading || !isAuthenticated || isAppLoading) {
    return <div>Loading..</div>
  }
  const userCurOrg = userStore.getCurOrg()

  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBarTop open={open} handleDrawerOpen={handleDrawerOpen} />
        <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth='lg' className={classes.container}>
            {children}
          </Container>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default Main
