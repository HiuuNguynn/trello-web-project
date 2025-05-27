import React from 'react'
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import BoltIcon from '@mui/icons-material/Bolt';
import FilterListIcon from '@mui/icons-material/FilterList';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';



const MENU_STYLE = {
  borderRadius: '4px',
  bgcolor: "white",
  color: "primary.main",
  border: 'none',
  paddingX: '5px',
  '&:hover': {
    bgcolor: "primary.50"
  },
  '& .MuiSvgIcon-root': {
    color: 'primary.main'
  }
}
function BoardBar() {
  return (
    <Box sx={{
      px: 2,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      height: (theme) => theme.trello.boardBarHeight,
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      borderTop: '1px solid #00b894',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Chip
          sx={MENU_STYLE}
          icon={<DashboardIcon />}
          label="Trung Hieu Dev MERN Stack Board"
          clickable
        />

        <Chip
          sx={MENU_STYLE}
          icon={<VpnLockIcon />}
          label="Public/Private Workspace"
          clickable
        />

        <Chip
          sx={MENU_STYLE}
          icon={<AddToDriveIcon />}
          label="Add to Goggle Drive"
          clickable
        />

        <Chip
          sx={MENU_STYLE}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />

        <Chip
          sx={MENU_STYLE}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          variant="outlined"
          startIcon = {<PersonAddIcon />}
        >
          Invite
        </Button>

        <AvatarGroup max={3} sx={{
          '& MuiAvatar-root': {
            width: 34,
            height: 34,
          }
        }}>
          <Tooltip title="TrungHieuDev">
            <Avatar
              alt="TrungHieuDev"
              src="https://yt3.ggpht.com/yti/ANjgQV-ikYwiwEratvxjBszrgTG4vQ2GekPgPtydrQgAdI_JVkA=s88-c-k-c0x00ffffff-no-rj"
            />
          </Tooltip>

          <Tooltip title="TrungHieuDev">
            <Avatar
              alt="TrungHieuDev"
              src="https://yt3.ggpht.com/yti/ANjgQV-ikYwiwEratvxjBszrgTG4vQ2GekPgPtydrQgAdI_JVkA=s88-c-k-c0x00ffffff-no-rj"
            />
          </Tooltip>

          <Tooltip title="TrungHieuDev">
            <Avatar
              alt="TrungHieuDev"
              src="https://yt3.ggpht.com/yti/ANjgQV-ikYwiwEratvxjBszrgTG4vQ2GekPgPtydrQgAdI_JVkA=s88-c-k-c0x00ffffff-no-rj"
            />
          </Tooltip>

          <Tooltip title="TrungHieuDev">
            <Avatar
              alt="TrungHieuDev"
              src="https://yt3.ggpht.com/yti/ANjgQV-ikYwiwEratvxjBszrgTG4vQ2GekPgPtydrQgAdI_JVkA=s88-c-k-c0x00ffffff-no-rj"
            />
          </Tooltip>
        </AvatarGroup>

      </Box>


    </Box>
  )
}

export default BoardBar