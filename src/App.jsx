
import React from 'react'

// import TabIndicator from '@mui/material/Tabs/TabIndicator';
import { useColorScheme, } from '@mui/material/styles';
// import { useMediaQuery } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import theme from './theme';


function ModeSelect() {
  const { mode, setMode } = useColorScheme();


  const handleChange = (event) => {
    const mode = event.target.value;
    setMode(mode);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="select-dark-light-mode">Mode</InputLabel>
      <Select
        labelId="select-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
      >
        <MenuItem value="light" >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LightModeIcon fontSize='small' /> Light
          </Box>
        </MenuItem>

        <MenuItem value="dark" >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DarkModeIcon fontSize='small' />Dark
          </Box>
        </MenuItem>

        <MenuItem value="system" >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsBrightnessIcon fontSize='small' /> System
          </Box>
        </MenuItem>

      </Select>
    </FormControl>
  );
}



function App() {

  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          height: theme.trello.appBarHeight,
          backgroundColor: 'primary.light',
        }}>
          <ModeSelect />
        </Box>

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          height: theme.trello.boardBarHeight,
          backgroundColor: 'primary.dark',
        }}>
          BoarBar
        </Box>

        <Box sx={{
          display: 'flex',
          width: '100%',
          height: `calc(100vh  - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
          backgroundColor: 'primary.main',
          alignItems: 'center',
        }}>
          Board Content
        </Box>

      </Container>
    </>
  )
}

export default App
