import { AppBar, Toolbar, Typography, Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

function Navbar({ variant }: { variant?: 'default' | 'jobsearch' }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const styles = {
    default: {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      color: 'white',
    },
    jobsearch: {
      backgroundColor: 'lightblue',
      color: 'black',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
  };

  return (
    <AppBar position="fixed" sx={{ ...styles[variant || 'default'] }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography component={Link} to="/home" variant="h6" color="inherit">
          ComfortZone
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {variant !== 'jobsearch' && (
            <Button component={Link} to="/home" color="inherit">
              Search For Jobs
            </Button>
          )}
          <Button color="inherit">Login/Signup</Button>
        </Box>
        <IconButton
          sx={{ display: { xs: 'block', md: 'none' } }}
          color="inherit"
          edge="start"
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {variant !== 'jobsearch' && (
            <MenuItem onClick={handleMenuClose} component={Link} to="/home">
              Search For Jobs
            </MenuItem>
          )}
          <MenuItem onClick={handleMenuClose}>Login/Signup</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;