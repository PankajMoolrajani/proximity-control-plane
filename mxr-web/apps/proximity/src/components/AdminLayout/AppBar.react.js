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
import { observer } from 'mobx-react-lite'
import LayoutStore from '/mxr-web/apps/proximity/src/stores/Layout.store'

const drawerWidth = 240
const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    minHeight: 'auto'
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

const AppBarTop = () => {
  const classes = useStyles()
  const { user, logout } = useAuth0()
  const showMenu = LayoutStore.getShowMenu()
  return (
    <AppBar
      position='absolute'
      className={clsx(classes.appBar, showMenu && classes.appBarShift)}
    >
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge='start'
          color='inherit'
          aria-label='open drawer'
          onClick={() => LayoutStore.setShowMenu(true)}
          className={clsx(
            classes.menuButton,
            showMenu && classes.menuButtonHidden
          )}
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
          Proximity
        </Typography>

        <Avatar alt={user.name} src={user.picture} className={classes.avatar} />
        <Typography>Hi, {user.name}</Typography>
        <IconButton
          onClick={() =>
            logout({
              returnTo: `${window.location.origin}/proximity/`
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
