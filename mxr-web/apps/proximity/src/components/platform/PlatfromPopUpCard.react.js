import React, { Component } from 'react'
import { Slide } from 'react-reveal'
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

class PlatformPopUpCard extends Component {
  render() {
    return (
      <Dialog
        open={this.props.isOpen ? this.props.isOpen : false}
        onClose={this.props.onClose}
        fullScreen
        style={{ margin: '5%' }}
      >
        <DialogTitle>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 5
            }}
          >
            <Box>{this.props.title}</Box>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <CloseIcon onClick={() => this.props.onClose()} />
            </Box>
          </Box>
        </DialogTitle>
        <Divider />
        <Slide up>
          <DialogContent style={{ padding: 0 }}>
            <Box style={{ display: 'flex' }}>{this.props.children}</Box>
          </DialogContent>
        </Slide>
      </Dialog>
    )
  }
}

export default PlatformPopUpCard
