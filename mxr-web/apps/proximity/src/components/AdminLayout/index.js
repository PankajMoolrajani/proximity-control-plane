import React, { Component, useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import Box from '@material-ui/core/Box'
import { getAxiosPdsInstance } from '/mxr-web/apps/proximity/src/libs/axios/axios.lib'
import AppBar from './AppBar.react'
import SideBar from './SideBar.react'
import orgStore from '/mxr-web/apps/proximity/src/stores/org.store'

const axiosPdsInstance = getAxiosPdsInstance()

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
      getAccessTokenSilently().then(async (token) => {
        console.log(token, user)
        //Check if user Exist
        const userSearchResponse = await axiosPdsInstance.post('/user/search', {
          query: {
            where: {
              auth0UserId: user.sub
            },
            include: [
              {
                model: 'Org'
              }
            ]
          }
        })
        const foundUserResult = userSearchResponse.data
        if (foundUserResult.count === 0) {
          // if no create user
          const userCreateResponse = await axiosPdsInstance.post('/user', {
            data: {
              auth0UserId: user.sub,
              firstName: user.given_name || '',
              lastName: user.family_name || '',
              email: user.email,
              avatar: user.picture || ''
            }
          })
          setIsAppLoading(false)
          push('/create-org')
        } else {
          const foundUser = foundUserResult.rows[0]
          orgStore.setUserOrgs(foundUser)
          //Check if user has orgs
          if (foundUser.Orgs.length === 0) {
            setIsAppLoading(false)
            push('/create-org')
          }
        }

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
