import React from 'react'
import moment from 'moment'
import { observer } from 'mobx-react-lite'
import { DiMongodb, DiMysql, DiPostgresql } from 'react-icons/di'
import { useHistory } from 'react-router-dom'
import { Paper, Typography, Button, Box } from '@material-ui/core'

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
const ListItem = ({ database }) => {
  const { push } = useHistory()
  return (
    <Paper
      style={{
        padding: '10px 20px',
        position: 'relative'
      }}
    >
      <Typography variant='h6'>{database.displayName}</Typography>
      <Typography variant='body1'>
        No. of collections: {database.collectionCount}
      </Typography>
      <Typography variant='body1'>Database Type: {database.dialect}</Typography>
      <Box my={2}>
        <Button
          variant='outlined'
          color='primary'
          style={{ marginRight: 20 }}
          onClick={() => {
            push(`/data-sources/${database.id}/rest-api`)
          }}
        >
          Rest API
        </Button>
        <Button
          variant='outlined'
          color='primary'
          onClick={() => {
            push(`/data-sources/${database.id}/graphql`)
          }}
        >
          Graphql
        </Button>
      </Box>
      <Box my={2}>
        <Button
          variant='contained'
          color='primary'
          size='medium'
          onClick={() => {
            push(`/data-sources/${database.id}/collections`)
          }}
        >
          Explore
        </Button>
      </Box>
      <Typography variant='body2' align='right'>
        Last Updated:{' '}
        {moment(new Date(database.updatedAt)).format(' Do MMM, YYYY')}
      </Typography>
    </Paper>
  )
}

export default observer(ListItem)
