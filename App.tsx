import React from 'react'
import { Container, AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import CountryList from './features/countries/CountryList'
import { useTheme } from './theme/ThemeContext'

export default function App() {
  const { mode, toggleTheme } = useTheme()

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Travel Explorer
            </Typography>
          </Box>
          
          <IconButton 
            onClick={toggleTheme} 
            color="inherit"
            aria-label="toggle theme"
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Container 
        sx={{ 
          mt: 4, 
          mb: 4,
          minHeight: 'calc(100vh - 64px)',
          bgcolor: 'background.default'
        }}
      >
        <CountryList />
      </Container>
    </Box>
  )
}
