import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import MenuIcon from '@material-ui/icons/Menu'
import IconButton from '@material-ui/core/IconButton'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { useAuth0 } from '@auth0/auth0-react'
import userStore from '../../store/user.store'
import { observer } from 'mobx-react-lite'

const drawerWidth = 240
const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: 'none'
  },
  title: {
    flexGrow: 1
  },
  avatar: {
    marginRight: 10
  }
}))

const AppBarTop = ({ handleDrawerOpen, open }) => {
  const classes = useStyles()
  const { user, logout } = useAuth0()
  const org = userStore.getCurOrg()
  return (
    <AppBar
      position='absolute'
      className={clsx(classes.appBar, open && classes.appBarShift)}
    >
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge='start'
          color='inherit'
          aria-label='open drawer'
          onClick={handleDrawerOpen}
          className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component='h1'
          variant='h6'
          color='inherit'
          noWrap
          className={classes.title}
        >
          Data API
        </Typography>
        {org ? (
          <Box
            style={{
              padding: 5,
              background: '#ffffff',
              marginRight: 10,
              borderRadius:5
            }}
          >
            <Typography color='primary'>{org.name}</Typography>
          </Box>
        ) : null}
        <Avatar alt={user.name} src={user.picture} className={classes.avatar} />
        <Typography>Hi, {user.name}</Typography>
        <IconButton
          onClick={() =>
            logout({
              returnTo: window.location.origin
            })
          }
          style={{
            color: '#ffffff'
          }}
        >
          <ExitToAppIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default observer(AppBarTop)
