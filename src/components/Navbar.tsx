import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  Logout,
  Login,
  DirectionsRun,
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../App';
import AuthModal from './AuthModal';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useThemeContext();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <AppBar position="static" color="primary" sx={{ width: '100%' }}>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', px: 2 }}>
        <Box sx={{ width: '100%', maxWidth: 1400 }}>
          <Toolbar sx={{ px: 0 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 }
              }}
              onClick={handleLogoClick}
            >
              <DirectionsRun 
                sx={{ 
                  mr: 2, 
                  fontSize: 32,
                  filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.3))',
                  transform: 'rotate(-10deg)'
                }} 
              />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Shuffle Skill Tree
              </Typography>
            </Box>
            
            <Box sx={{ flexGrow: 1 }} />
            
            {/* Navigation */}
            <Button color="inherit" onClick={() => navigate('/upload-move')} sx={{ mr: 1 }}>
              Upload Move
            </Button>
            <Button color="inherit" onClick={() => navigate('/contact')} sx={{ mr: 1 }}>
              Contact
            </Button>
            
            {/* Theme Toggle */}
            <IconButton
              color="inherit"
              onClick={toggleDarkMode}
              sx={{ mr: 2 }}
            >
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
            
            {currentUser ? (
              <>
                <Button
                  color="inherit"
                  onClick={handleMenuOpen}
                  startIcon={
                    <Avatar
                      src={currentUser?.photoURL || undefined}
                      sx={{ width: 24, height: 24 }}
                    >
                      {currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U'}
                    </Avatar>
                  }
                >
                  {currentUser?.displayName || currentUser?.email || 'User'}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleLogout}>
                    <Logout fontSize="small" sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                color="inherit"
                onClick={() => setAuthModalOpen(true)}
                startIcon={<Login />}
              >
                Login
              </Button>
            )}
          </Toolbar>
        </Box>
      </Box>
      
      <AuthModal 
        open={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        initialMode="login"
      />
    </AppBar>
  );
};

export default Navbar;