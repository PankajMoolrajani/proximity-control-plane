import React, { Component } from 'react'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'

class PlatformLoaderCard extends Component {
  render() {
    return (
      <Box style={{ flex: 1, textAlign: 'center' }}>
        <CircularProgress style={{ color: this.props.color }} />
      </Box>
    )
  }
}

PlatformLoaderCard.displayName = 'PlatformLoaderCard'
export default PlatformLoaderCard
