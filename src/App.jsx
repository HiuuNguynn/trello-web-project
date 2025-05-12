
import React from 'react'
import Button from '@mui/material/Button'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import ThreeDRotation from '@mui/icons-material/ThreeDRotation';
import HomeIcon from '@mui/icons-material/Home';
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
        <Box sx={{ display: 'flex', alignItems:'center', gap: 1 }}>
        <LightModeIcon fontSize='small' /> Light
        </Box>
        </MenuItem>

        <MenuItem value="dark" >
        <Box sx={{ display: 'flex', alignItems:'center', gap: 1 }}>
         <DarkModeIcon fontSize='small'/>Dark
         </Box>
         </MenuItem>

        <MenuItem value="system" >
        <Box sx={{ display: 'flex', alignItems:'center', gap: 1 }}>
        <SettingsBrightnessIcon fontSize='small'/> System
        </Box>
        </MenuItem>

      </Select>
    </FormControl>
  );
}


function ModeToggle() {
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  // const prefersLightMode = useMediaQuery('(prefers-color-scheme: light)');
  // console.log('prefersDarkMode', prefersDarkMode);
  // console.log('prefersLightMode', prefersLightMode);
  const { mode, setMode } = useColorScheme();
  return (
    <Button
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light');
      }}
    >
      {mode === 'light' ? 'Turn dark' : 'Turn light'}
    </Button>
  );
}

function App() {

  return (
    <>
      <ModeSelect />
      <hr />
      <ModeToggle />
      <hr />
      <div>TrungHieuDev</div>
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <AccessAlarmIcon></AccessAlarmIcon>
      <ThreeDRotation></ThreeDRotation>

      <HomeIcon />
      <HomeIcon color="primary" />
      <HomeIcon color="secondary" />
      <HomeIcon color="success" />
      <HomeIcon color="action" />
      <HomeIcon color="disabled" />

    </>
  )
}

export default App
