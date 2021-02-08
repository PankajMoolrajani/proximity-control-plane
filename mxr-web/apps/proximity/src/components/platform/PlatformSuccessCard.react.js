import React, { Component } from 'react'
import DoneIcon from '@material-ui/icons/Done'
import Box from '@material-ui/core/Box'

class PlatformSuccessCard extends Component {
  render() {
    return (
      <Box style={{ flex: 1, flexDirection: 'column', textAlign: 'center' }}>
        <Box>
          <DoneIcon style={{ fontSize: 100, color: this.props.iconColor }} />
        </Box>
        <Box
          style={{ marginTop: 20, fontWeight: 200, color: this.props.msgColor }}
        >
          {this.props.msg}
        </Box>
      </Box>
    )
  }
}

PlatformSuccessCard.displayName = 'PlatformSuccessCard'
export default PlatformSuccessCard
