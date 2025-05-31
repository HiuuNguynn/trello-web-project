import React from 'react'

import Box from '@mui/material/Box';

function BoardContent() {
  return (
    <Box sx={{
      display: 'flex',
      width: '100%',
      height: (theme) => `calc(100vh  - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
      alignItems: 'center',
      bgcolor: (theme) => theme.palette.mode === 'dark' ? '#34496e' : '#1976d2',
    }}>
      Board Content
    </Box>
  )
}

export default BoardContent