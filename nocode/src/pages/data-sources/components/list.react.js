import { useState, Fragment } from 'react'
import faker from 'faker'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { DiMongodb, DiMysql, DiPostgresql } from 'react-icons/di'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'

const data = []
const dbTypes = [
  {
    name: 'mongodb',
    icon: <DiMongodb size={30} />
  },
  {
    name: 'mysql',
    icon: <DiMysql size={30} />
  },
  {
    name: 'postgresql',
    icon: <DiPostgresql size={30} />
  }
]
Array.from({ length: 50 }).forEach(() => {
  data.push({
    database: faker.lorem.slug(),
    type: dbTypes[Math.floor(Math.random() * dbTypes.length)],
    createdAt: faker.date.past()
  })
})

const List = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const theme = useTheme()
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Grid container spacing={3}>
      {data.map((d) => (
        <Grid item xs={4}>
          <Card>
            <CardHeader
              avatar={
                <Avatar style={{ background: theme.palette.primary.dark }}>
                  {d.type.icon}
                </Avatar>
              }
              title={<Typography variant="h6">{d.database}</Typography>}
              action={
                <Fragment>
                  <IconButton
                    aria-label="settings"
                    onClick={handleClick}
                    color="primary"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Fragment>
              }
            />
            <CardContent>
              <Typography component="p" style={{ fontSize: 20 }}>
                {d.type.name}
              </Typography>
              <Typography component="span">
                <b>Created At:</b> {d.createdAt.toGMTString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Export</MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
    </Grid>
  )
}

export default List
