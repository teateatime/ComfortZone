import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
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

  const logoLink = variant === 'jobsearch' ? '/home' : '/';

  return (
    <AppBar position="fixed" sx={{ ...styles[variant || 'default'] }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          component={Link}
          to={logoLink}
          variant="h6"
          color="inherit"
          sx={{ textDecoration: 'none' }}
        >
          ComfortZone
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          <Button component={Link} to="/home" color="inherit">
            Home
          </Button>
          <Button component={Link} to="/about" color="inherit">
            About
          </Button>
          <Button component={Link} to="/salary" color="inherit">
            Salary History
          </Button>
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
          <MenuItem onClick={handleMenuClose} component={Link} to="/home">
            Home
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={Link} to="/about">
            About
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={Link} to="/salary">
            Salary History
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>Login/Signup</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;