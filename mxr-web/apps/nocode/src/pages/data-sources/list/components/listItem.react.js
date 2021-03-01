import React from 'react'
import moment from 'moment'
import { DiMongodb, DiMysql, DiPostgresql } from 'react-icons/di'
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
        <Button variant='contained' color='primary' size='medium'>
          Expolore
        </Button>
      </Box>
      <Typography variant='body2' align='right'>
        Last Updated:{' '}
        {moment(new Date(database.updatedAt)).format(' Do MMM, YYYY')}
      </Typography>
    </Paper>
  )
}

export default ListItem
