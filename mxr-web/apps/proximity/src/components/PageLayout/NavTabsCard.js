import React, { Component } from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'

export class NavTabsCard extends Component {
  render() {
    return (
      <Box
        style={{
          display: 'flex',
          padding: '0 24px'
        }}
      >
        {this.props.buttons.map((button) => (
          <Button
            key={button.title}
            onClick={button.click}
            style={{
              fontWeight: button.isActive ? 700 : 400,
              marginRight: 10,
              paddingLeft: 0
            }}
          >
            {button.title}
          </Button>
        ))}
      </Box>
    )
  }
}

export default NavTabsCard
