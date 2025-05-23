import React from 'react'

import Box from '@mui/material/Box';

function BoardContent() {
  return (
    <Box sx={{
          display: 'flex',
          width: '100%',
          height:(theme) =>  `calc(100vh  - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
          backgroundColor: 'primary.main',
          alignItems: 'center',
        }}>
          Board Content
        </Box>
  )
}

export default BoardContent