import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Avatar,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  ShoppingBag,
  CompareArrows,
  CameraAlt,
  Psychology,
  Chat,
  Search,
  Person,
  Menu as MenuIcon,
  Close,
  Dashboard,
  MenuBook,
  AutoAwesome,
  Security,
  LocalShipping,
  SupervisorAccount,
  AssignmentInd
} from '@mui/icons-material';

import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { CompareContext } from '../context/CompareContext';

export default function Navbar({
  onOpenAuth,
  onOpenLiveChat,
  onOpenCompare,
  navigate
}) {
  const { user, logout } = useContext(AuthContext);
  const { cartItems, setIsCartOpen } = useContext(CartContext);
  const { compareList } = useContext(CompareContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'rgba(13, 13, 13, 0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(212, 175, 55, 0.25)' }}>
      {/* Top Banner */}
      <Box sx={{ bgcolor: '#D4AF37', color: '#0D0D0D', textTransform: 'uppercase', py: 0.5, fontSize: '0.75rem', fontWeight: 700, textAlign: 'center', letterSpacing: '2px' }}>
        Complimentary Express Shipping & 24K Gold Sample on Orders over $75 | Mae' Loyalty Double Points Week
      </Box>

      <Toolbar sx={{ justifyContent: 'space-between', py: 1, px: { xs: 2, md: 6 } }}>
        {/* Brand */}
        <Box display="flex" alignItems="center" gap={1} sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', fontWeight: 700, color: '#D4AF37', letterSpacing: '3px' }}>
            MAE' BEAUTY
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: { xs: 'none', md: 'flex' }, width: '240px' }}>
          <TextField
            size="small"
            placeholder="Search luxury line..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#D4AF37' }} />
                </InputAdornment>
              ),
              sx: {
                bgcolor: 'rgba(255,255,255,0.05)',
                borderRadius: '20px',
                color: '#FFF',
                '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.3)' },
                '&:hover fieldset': { borderColor: '#D4AF37' }
              }
            }}
          />
        </Box>

        {/* Desktop Navigation Links */}
        <Box sx={{ display: { xs: 'none', xl: 'flex' }, gap: 0.5, alignItems: 'center' }}>
          <Button sx={{ color: '#FFF' }} onClick={() => navigate('/shop')}>Catalog</Button>
          <Button sx={{ color: '#D4AF37' }} startIcon={<Psychology />} onClick={() => navigate('/ai-ar-studio')}>AI & AR Studio</Button>
          <Button sx={{ color: '#FFF' }} startIcon={<MenuBook />} onClick={() => navigate('/guides')}>Beauty Journal</Button>
          <Button sx={{ color: '#FFF' }} startIcon={<Security />} onClick={() => navigate('/about')}>Brand Story</Button>

          {user?.role === 'expert' && (
            <Button sx={{ color: '#E8C76A' }} startIcon={<AssignmentInd />} onClick={() => navigate('/expert/dashboard')}>
              Expert Desk
            </Button>
          )}

          {user?.role === 'admin' && (
            <Button sx={{ color: '#D4AF37' }} startIcon={<SupervisorAccount />} onClick={() => navigate('/admin/analytics')}>
              Admin Portal
            </Button>
          )}
        </Box>

        {/* Right Actions */}
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton color="inherit" onClick={onOpenLiveChat} title="Live Beauty Artist Chat">
            <Badge color="secondary" variant="dot">
              <Chat sx={{ color: '#D4AF37' }} />
            </Badge>
          </IconButton>

          <IconButton color="inherit" onClick={onOpenCompare} title="Product Comparison Matrix">
            <Badge badgeContent={compareList.length} color="primary">
              <CompareArrows />
            </Badge>
          </IconButton>

          <IconButton color="inherit" onClick={() => setIsCartOpen(true)} title="Shopping Bag">
            <Badge badgeContent={totalCartCount} color="primary">
              <ShoppingBag sx={{ color: '#D4AF37' }} />
            </Badge>
          </IconButton>

          {user ? (
            <>
              <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 1, border: '1px solid #D4AF37' }}>
                <Avatar alt={user.name} src={user.avatar} sx={{ width: 34, height: 34, bgcolor: '#D4AF37', color: '#0D0D0D' }}>
                  {user.name.charAt(0)}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{ sx: { bgcolor: '#181818', border: '1px solid rgba(212, 175, 55, 0.3)', minWidth: 220 } }}
              >
                <Box px={2} py={1}>
                  <Typography variant="subtitle2" sx={{ color: '#D4AF37', fontWeight: 700 }}>{user.name}</Typography>
                  <Typography variant="caption" sx={{ color: '#AAA' }}>{user.email} ({user.role})</Typography>
                  <Typography variant="caption" display="block" sx={{ color: '#E8C76A', mt: 0.5 }}>
                    Points: {user.points || user.loyaltyPoints || 0}
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard'); }}>Personal Dashboard</MenuItem>
                {user.role === 'expert' && (
                  <>
                    <MenuItem onClick={() => { handleMenuClose(); navigate('/expert/dashboard'); }}>Expert Dashboard</MenuItem>
                    <MenuItem onClick={() => { handleMenuClose(); navigate('/expert/client-crm'); }}>Client CRM Desk</MenuItem>
                    <MenuItem onClick={() => { handleMenuClose(); navigate('/expert/routine-builder'); }}>Routine Builder</MenuItem>
                  </>
                )}
                {user.role === 'admin' && (
                  <>
                    <MenuItem onClick={() => { handleMenuClose(); navigate('/admin/analytics'); }} sx={{ color: '#D4AF37' }}>Analytics & Stats</MenuItem>
                    <MenuItem onClick={() => { handleMenuClose(); navigate('/admin/users'); }}>User Directory</MenuItem>
                    <MenuItem onClick={() => { handleMenuClose(); navigate('/admin/products'); }}>Product SKUs</MenuItem>
                    <MenuItem onClick={() => { handleMenuClose(); navigate('/admin/orders'); }}>Fulfillment Queue</MenuItem>
                  </>
                )}
                <MenuItem onClick={() => { handleMenuClose(); logout(); }}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Person />}
              onClick={onOpenAuth}
              sx={{ ml: 1, display: { xs: 'none', sm: 'flex' } }}
            >
              Sign In
            </Button>
          )}

          <IconButton color="inherit" onClick={() => setMobileMenuOpen(true)} sx={{ display: { xl: 'none' } }}>
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <Box sx={{ width: 280, bgcolor: '#0D0D0D', height: '100%', color: '#FFF', p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37' }}>MAE' BEAUTY</Typography>
            <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ color: '#FFF' }}><Close /></IconButton>
          </Box>
          <Divider sx={{ borderColor: 'rgba(212, 175, 55, 0.2)', mb: 2 }} />
          <List>
            <ListItem button onClick={() => { navigate('/shop'); setMobileMenuOpen(false); }}>
              <ListItemText primary="Shop Catalog" />
            </ListItem>
            <ListItem button onClick={() => { navigate('/ai-ar-studio'); setMobileMenuOpen(false); }}>
              <ListItemText primary="AI & AR Try-On Studio" sx={{ color: '#D4AF37' }} />
            </ListItem>
            <ListItem button onClick={() => { navigate('/guides'); setMobileMenuOpen(false); }}>
              <ListItemText primary="Beauty Journal" />
            </ListItem>
            {user?.role === 'expert' && (
              <ListItem button onClick={() => { navigate('/expert/dashboard'); setMobileMenuOpen(false); }}>
                <ListItemText primary="Expert Workspace" sx={{ color: '#E8C76A' }} />
              </ListItem>
            )}
            {user?.role === 'admin' && (
              <ListItem button onClick={() => { navigate('/admin/analytics'); setMobileMenuOpen(false); }}>
                <ListItemText primary="Executive Admin Portal" sx={{ color: '#D4AF37' }} />
              </ListItem>
            )}
            {user ? (
              <ListItem button onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}>
                <ListItemText primary="VIP Dashboard" />
              </ListItem>
            ) : (
              <ListItem button onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}>
                <ListItemText primary="Sign In / Register" sx={{ color: '#D4AF37' }} />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
