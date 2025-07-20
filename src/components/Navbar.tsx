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
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  Logout,
  Login,
  DirectionsRun,
  LightMode,
  DarkMode,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../App';
import AuthModal from './AuthModal';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useThemeContext();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { name: 'Upload Move', path: '/upload-move' },
    { name: 'Contact', path: '/contact' },
  ];

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
            
            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button color="inherit" onClick={() => navigate('/upload-move')} sx={{ mr: 1 }}>
                Upload Move
              </Button>
              <Button color="inherit" onClick={() => navigate('/contact')} sx={{ mr: 1 }}>
                Contact
              </Button>
            </Box>
            
            {/* Mobile Hamburger */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
              <IconButton
                color="inherit"
                aria-label="open menu"
                onClick={handleMobileMenuToggle}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            
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
      
      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Menu
          </Typography>
          <IconButton onClick={handleMobileMenuToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem
              key={item.path}
              onClick={() => {
                navigate(item.path);
                handleMobileMenuToggle();
              }}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
          
          {/* Theme Toggle in Mobile Menu */}
          <ListItem
            onClick={() => {
              toggleDarkMode();
            }}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemText
              primary={darkMode ? 'Light Mode' : 'Dark Mode'}
              secondary={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            />
          </ListItem>
          
          {/* Auth in Mobile Menu */}
          {!currentUser && (
            <ListItem
              onClick={() => {
                setAuthModalOpen(true);
                handleMobileMenuToggle();
              }}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemText primary="Login" />
            </ListItem>
          )}
          
          {currentUser && (
            <ListItem
              onClick={() => {
                handleLogout();
                handleMobileMenuToggle();
              }}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemText primary="Logout" />
            </ListItem>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;