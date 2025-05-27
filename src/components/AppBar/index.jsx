import React from 'react'
import Box from '@mui/material/Box';
import ModeSelect from '~/components/ModeSelect';
import AppsIcon from '@mui/icons-material/Apps';
import { ReactComponent as trelloLogo } from '~/assets/trello.svg';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import Workspace from '~/components/AppBar/Menu/Workspace';
import Recent from '~/components/AppBar/Menu/Recent';
import Starred from '~/components/AppBar/Menu/Starred';
import Templates from '~/components/AppBar/Menu/Templates';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Profile from './Menu/Profiles';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
function index() {
  return (
    <Box sx={{
      px:2,
      display: 'flex',
      alignItems: 'center',
      height: (theme) => theme.trello.appBarHeight,
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AppsIcon sx={{
          color: 'primary.main',
        }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SvgIcon component={trelloLogo} fontSize="small" inheritViewBox sx={{ color: 'primary.main' }} />
          <Typography variant='span' sx={{ fontWeight: "bold", color: 'primary.main', fontSize: "1.2rem" }}>Trello</Typography>
        </Box>

        <Box sx={{ display: {xs:'none', md:'flex' }, gap:1 }}>
          <Workspace />
          <Recent />
          <Starred />
          <Templates />
          <Button
           variant="outlined"
           startIcon={<LibraryAddIcon />}
           >
            Create
            </Button>
        </Box>

      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap:1}}>
        <TextField id="outlined-search" label="Search..." type="search" size='small' sx={{ minWidth:120 }} />
        <ModeSelect />

        <Tooltip title="Notifications">
          <Badge color="secondary" variant="dot" overlap="circular">
            <NotificationsNoneIcon  sx={{ color:'primary.light', cursor:'pointer' }}/>
          </Badge>
        </Tooltip>

        <Tooltip title="Help" >
            <HelpOutlineIcon sx={{ color:'primary.light', cursor:'pointer' }} />
        </Tooltip>
        
        <Profile/>
      </Box>
    </Box>
  )
}

export default index