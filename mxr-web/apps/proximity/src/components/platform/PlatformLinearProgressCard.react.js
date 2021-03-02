import React from 'react'
import Box from '@material-ui/core/Box'
import LinerProgress from '@material-ui/core/LinearProgress'

function PlatformLinearProgressCard(props) {
  let { totalCount, doneCount, message } = props
  let percentageDone = Math.round((doneCount * 100) / totalCount)
  if (isNaN(percentageDone)) {
    percentageDone = 0
  }
  return (
    <React.Fragment>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          marginRight: 50,
          ...props.style
        }}
      >
        <Box width='100%' mr={1}>
          <LinerProgress variant='determinate' value={percentageDone} />
        </Box>
        <Box minWidth={35}>{percentageDone}%</Box>
      </Box>
      <Box style={{ fontSize: 14 }}>{message}</Box>
    </React.Fragment>
  )
}

export default PlatformLinearProgressCard
