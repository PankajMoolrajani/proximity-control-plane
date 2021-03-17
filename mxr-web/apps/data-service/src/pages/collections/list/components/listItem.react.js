import React from 'react'
import moment from 'moment'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'
import { Paper, Typography, Button, Box } from '@material-ui/core'

const ListItem = ({ collection }) => {
  const { push } = useHistory()
  return (
    <Paper
      style={{
        padding: '10px 20px',
        position: 'relative'
      }}
    >
      <Typography variant='h6'>{collection.displayName}</Typography>
      <Typography variant='body1'>{collection.description}</Typography>
      <Box my={2}>
        <Button variant='contained' color='primary'>
          Explore
        </Button>
      </Box>
      <Typography variant='body2' align='right'>
        Last Updated:{' '}
        {moment(new Date(collection.updatedAt)).format(' Do MMM, YYYY')}
      </Typography>
    </Paper>
  )
}

export default observer(ListItem)
