import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import LiveData from '@/components/LiveData';
import HistoricalData from '@/components/HistoricalData';

const drawerWidth = 240;
const navItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
  },
  { title: 'About', url: '/about' },

  {
    title: 'GitHub',
    url: 'https://github.com/manuelbrgr/indoor-air-monitor',
    target: '_blank',
  },
];
const baseUrl = `https://iaq-data.brgr.rocks`;

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Airbase
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <a href={item.url}>
                <ListItemText primary={item.title} />
              </a>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12} md={8}>
          <AppBar component="nav">
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
              >
                Airbase
              </Typography>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                {navItems.map((item, i) => (
                  <a href={item.url} key={i} target={item.target || ''}>
                    <Button key={item.title} sx={{ color: '#fff' }}>
                      {item.title}
                    </Button>
                  </a>
                ))}
              </Box>
            </Toolbar>
          </AppBar>
          <Box component="nav">
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: drawerWidth,
                },
              }}
            >
              {drawer}
            </Drawer>
          </Box>
          <Box component="main" sx={{ p: 3 }}>
            <Toolbar />
            <Box sx={{ my: 6 }}>
              <LiveData />
            </Box>
            <Box sx={{ my: 12 }}>
              <HistoricalData />
            </Box>
            <Grid container sx={{ mt: 10 }}>
              <Grid item xs={12} textAlign="center">
                <Typography variant="caption">
                  Bachelor project work of Manuel Berger,{' '}
                  <a href="https://www.fernfh.ac.at/">
                    Ferdinand Porsche FernFH
                  </a>
                  , Supervised by Prof. Dr. Tom Gross © 2022
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;
