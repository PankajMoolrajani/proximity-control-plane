import React, { Component } from 'react'
import { Slide } from 'react-reveal'
import CloseIcon from '@material-ui/icons/Close'
import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'


class PlatformPopUpCard extends Component {
  render() {
    return (
      <Dialog 
        open={this.props.isOpen ? this.props.isOpen : false} 
        onClose={this.props.onClose}
        fullScreen style={{margin: '5%'}}
      >
        <DialogTitle>
          <Box style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', paddingTop: 5,
          }}>
            <Box>
              {this.props.title}
            </Box>
            <Box style={{
              display: 'flex', alignItems: 'center', cursor: 'pointer'
            }}>
              <CloseIcon onClick={()=>this.props.onClose()}/>
            </Box>
          </Box>
        </DialogTitle>
        <Divider />
        <Slide up>
          <DialogContent style={{padding: 0}}>
            <Box style={{display: 'flex'}}>
              {this.props.children}
            </Box>
          </DialogContent>
        </Slide>
      </Dialog>
    )
  }
}

export default PlatformPopUpCard;
