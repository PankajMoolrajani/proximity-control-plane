import React, { Component } from 'react'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'

class PlatformLoaderCard extends Component {
  render() {
    return (
      <MaterialBox style={{flex: 1, textAlign: 'center'}}>
        <MaterialCircularProgress style = {{color: this.props.color}}/>
      </MaterialBox>
    )
  }
}


PlatformLoaderCard.displayName='PlatformLoaderCard';
export default PlatformLoaderCard;
