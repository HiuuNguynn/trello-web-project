import React from 'react'
import Box from '@mui/material/Box';
function BoardBar() {
  return (
   
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          height:(theme)  => theme.trello.boardBarHeight,
          backgroundColor: 'primary.dark',
        }}>
          BoardBar
        </Box>
  )
}

export default BoardBar