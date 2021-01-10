import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import LayersIcon from '@material-ui/icons/Layers'
import AccountTreeIcon from '@material-ui/icons/AccountTree'
import DashboardIcon from '@material-ui/icons/Dashboard'
import BuildIcon from '@material-ui/icons/Build'
import { Server, Database, Shuffle } from 'react-feather'
import { useHistory } from 'react-router-dom'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(8)
    }
  }
}))

const Sidebar = ({ handleDrawerClose, open }) => {
  const classes = useStyles()
  const { push } = useHistory()
  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
      }}
      open={open}
    >
      <div className={classes.toolbarIcon}>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItem button onClick={() => push('/')}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => push('/data-sources')}>
          <ListItemIcon>
            <Server />
          </ListItemIcon>
          <ListItemText primary="Data Sources" />
        </ListItem>
        <ListItem button onClick={() => push('/models')}>
          <ListItemIcon>
            <Database />
          </ListItemIcon>
          <ListItemText primary="Models" />
        </ListItem>
        <ListItem button onClick={() => push('/')}>
          <ListItemIcon>
            <Shuffle />
          </ListItemIcon>
          <ListItemText primary="Relations" />
        </ListItem>
        <ListItem button onClick={() => push('/')}>
          <ListItemIcon>
            <AccountTreeIcon />
          </ListItemIcon>
          <ListItemText primary="Explore" />
        </ListItem>
        <ListItem button onClick={() => push('/page-builder')}>
          <ListItemIcon>
            <BuildIcon />
          </ListItemIcon>
          <ListItemText primary="Integrations" />
        </ListItem>
        <ListItem button onClick={() => push('/')}>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="Integrations" />
        </ListItem>
      </List>
      <Divider />
      <List></List>
    </Drawer>
  )
}

export default Sidebar
