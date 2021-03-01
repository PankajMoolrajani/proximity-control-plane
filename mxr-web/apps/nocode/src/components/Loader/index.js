import React from 'react'
import { Box, CircularProgress } from '@material-ui/core'

const Loader = () => {
  return (
    <Box p={10} display='flex' justifyContent='center' alignItems='center'>
      <CircularProgress />
    </Box>
  )
}

export default Loader
