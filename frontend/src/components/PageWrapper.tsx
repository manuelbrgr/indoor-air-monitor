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
import styled from '@emotion/styled';
import { Link } from 'gatsby';
import GitHubIcon from '@mui/icons-material/GitHub';

const drawerWidth = 240;
const navItems = [
  {
    title: 'Dashboard',
    url: '/',
  },
  { title: 'About', url: '/about', external: true },

  {
    icon: <GitHubIcon sx={{ pr: 0.5 }} />,
    title: 'GitHub',
    url: 'https://github.com/manuelbrgr/indoor-air-monitor',
    target: '_blank',
    external: true,
  },
];
const baseUrl = `https://iaq-data.brgr.rocks`;

function PageWrapper(props) {
  const { window, children } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const PageContainer = styled.div`
    a {
      text-decoration: none;
    }

    .app-bar a {
      color: inherit;
    }
  `;

  const drawer = (
    <PageContainer>
      <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ my: 2 }}>
          <Link to={'/'}>Airbase</Link>
        </Typography>
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }}>
                {item.external ? (
                  <a
                    href={item.url}
                    target={item.target || ''}
                    style={{ display: 'flex' }}
                  >
                    {item.icon} <ListItemText primary={item.title} />
                  </a>
                ) : (
                  <Link to={item.url}>
                    {item.icon} <ListItemText primary={item.title} />
                  </Link>
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </PageContainer>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <PageContainer>
      <Box sx={{ display: 'flex' }}>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={12} md={8}>
            <AppBar component="nav" className="app-bar">
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
                  <Link to={'/'}>Airbase</Link>
                </Typography>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  {navItems.map((item, i) => (
                    <>
                      {item.external ? (
                        <a href={item.url} key={i} target={item.target || ''}>
                          <Button key={item.title} sx={{ color: '#fff' }}>
                            {item.icon} {item.title}
                          </Button>
                        </a>
                      ) : (
                        <Link to={item.url} key={i}>
                          <Button key={item.title} sx={{ color: '#fff' }}>
                            {item.icon} {item.title}
                          </Button>
                        </Link>
                      )}
                    </>
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
            <Box sx={{ mt: 12 }}>{children}</Box>
            <Grid container sx={{ mt: 6 }}>
              <Grid item xs={12} sx={{ p: 2 }} textAlign="center">
                <Typography variant="caption">
                  Bachelor project work of{' '}
                  <a
                    href="https://www.linkedin.com/in/manuel-berger-71b70ab8/"
                    target="_blank"
                  >
                    Manuel Berger
                  </a>
                  ,{' '}
                  <a href="https://www.fernfh.ac.at/" target="_blank">
                    Ferdinand Porsche FernFH
                  </a>
                  , Supervised by{' '}
                  <a
                    href="https://www.linkedin.com/in/tom-gross-395155"
                    target="_blank"
                  >
                    Prof. Dr. Tom Gross
                  </a>{' '}
                  © 2022
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

PageWrapper.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default PageWrapper;
