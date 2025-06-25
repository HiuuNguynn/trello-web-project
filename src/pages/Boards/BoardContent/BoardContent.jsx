import React from 'react';
import Box from '@mui/material/Box';
import ListColumns from '~/pages/Boards/BoardContent/ListColumns/ListColumns';
function BoardContent() {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#34496e' : '#1976d2',
        padding: '10px 0',
      }}>
      <ListColumns />
    </Box>
  )
}

export default BoardContent