import React, { useState } from 'react'
import Box from '@material-ui/core/Box'

const Progress = (props) => {
  const [style, setStyle] = useState({})

  setTimeout(() => {
    const newStyle = {
      opacity: 1,
      width: `${props.done}%`,
      background: '#E57372',
      borderRadius: '20px',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyontent: 'center',
      height: '100%',
      fontSize: '10px',
      paddingLeft: 10,
      transition: '1s ease 0.3s'
    }

    setStyle(newStyle)
  }, 200)
  const progress = {
    backgroundColor: '#d8d8d8',
    borderRadius: '20px',
    position: 'relative',
    margin: '15px 0',
    height: '15px',
    width: '100%'
  }

  return (
    <Box style={progress}>
      <Box style={style}>{` ${props.done}%`}</Box>
    </Box>
  )
}

export default Progress
