import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Tabs,
  Tab,
  Chip,
  Button,
  CardMedia,
  Divider,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import { AutoAwesome, LocalShipping, Favorite, Person, WorkspacePremium } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

export default function UserDashboardPage({ onOpenARTryOn, navigate }) {
  const { user } = useContext(AuthContext);

  const [tabIndex, setTabIndex] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (user) {
      API.get('/orders/myorders')
        .then(({ data }) => {
          setOrders(data);
          setLoadingOrders(false);
        })
        .catch(() => setLoadingOrders(false));
    }
  }, [user]);

  if (!user) {
    return (
      <Box textAlign="center" py={12} sx={{ bgcolor: '#0D0D0D', color: '#FFF' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Please Sign In to View Your Mae' VIP Dashboard</Typography>
        <Button variant="contained" onClick={() => navigate('/')}>Return to Homepage</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#0D0D0D', color: '#FFF', py: 6, minHeight: '85vh' }}>
      <Container maxWidth="lg">
        {/* User Banner Header */}
        <Paper sx={{ p: 4, mb: 4, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={8}>
              <Box display="flex" alignItems="center" gap={2}>
                <Box sx={{ width: 70, height: 70, borderRadius: '50%', bgcolor: '#D4AF37', color: '#0D0D0D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.8rem', fontFamily: 'Playfair Display' }}>
                  {user.name.charAt(0)}
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', color: '#FFF', fontWeight: 700 }}>
                    {user.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#AAA' }}>{user.email} • Role: {user.role.toUpperCase()}</Typography>
                  <Box display="flex" gap={1} mt={1}>
                    <Chip icon={<WorkspacePremium style={{ color: '#0D0D0D' }} />} label={`Mae' Tier: ${user.loyaltyTier || 'Gold VIP'}`} sx={{ bgcolor: '#D4AF37', color: '#0D0D0D', fontWeight: 700 }} />
                    <Chip label={`Skin Profile: ${user.skinProfile?.skinTone || 'Medium'} (${user.skinProfile?.undertone || 'Neutral'})`} sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#FFF' }} />
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box p={2.5} sx={{ bgcolor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                  Mae' Loyalty Points Balance
                </Typography>
                <Typography variant="h3" sx={{ color: '#FFF', fontFamily: 'Playfair Display', fontWeight: 700, my: 0.5 }}>
                  {user.loyaltyPoints || 250}
                </Typography>
                <Typography variant="caption" sx={{ color: '#AAA' }}>
                  Equal to ${((user.loyaltyPoints || 250) / 100).toFixed(2)} in luxury rewards
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Navigation Tabs */}
        <Tabs
          value={tabIndex}
          onChange={(e, val) => setTabIndex(val)}
          sx={{ mb: 4, '& .MuiTabs-indicator': { backgroundColor: '#D4AF37' }, '& .MuiTab-root': { color: '#888', fontWeight: 600, '&.Mui-selected': { color: '#D4AF37' } } }}
        >
          <Tab icon={<LocalShipping />} iconPosition="start" label="Order History & Tracking" />
          <Tab icon={<Favorite />} iconPosition="start" label={`My Wishlist (${user.wishlist?.length || 0})`} />
          <Tab icon={<Person />} iconPosition="start" label="Skin Profile & Preferences" />
        </Tabs>

        {/* Tab 0: Orders */}
        {tabIndex === 0 && (
          <Box>
            {loadingOrders ? (
              <CircularProgress sx={{ color: '#D4AF37' }} />
            ) : orders.length === 0 ? (
              <Paper sx={{ p: 6, textAlign: 'center', bgcolor: '#141414' }}>
                <Typography variant="h6" sx={{ color: '#AAA', mb: 2 }}>No Orders Placed Yet</Typography>
                <Button variant="contained" onClick={() => navigate('/shop')}>Start Shopping</Button>
              </Paper>
            ) : (
              orders.map((ord) => (
                <Paper key={ord._id} sx={{ p: 3, mb: 3, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: '#D4AF37', fontWeight: 700 }}>
                        Order #{ord.trackingNumber}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#888' }}>
                        Placed on: {new Date(ord.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Chip label={ord.status} size="small" sx={{ bgcolor: ord.status === 'Delivered' ? '#2e7d32' : '#D4AF37', color: ord.status === 'Delivered' ? '#FFF' : '#0D0D0D', fontWeight: 700, mb: 0.5 }} />
                      <Typography variant="subtitle1" sx={{ color: '#FFF', fontWeight: 700 }}>${ord.totalPrice}</Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 2 }} />

                  {/* Items */}
                  <Grid container spacing={2}>
                    {ord.orderItems?.map((item, idx) => (
                      <Grid item xs={12} sm={6} key={idx}>
                        <Box display="flex" gap={1.5} alignItems="center">
                          <CardMedia component="img" image={item.image} sx={{ width: 50, height: 50, borderRadius: 1.5, objectFit: 'cover' }} />
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: '#FFF' }}>{item.name}</Typography>
                            <Typography variant="caption" sx={{ color: '#AAA' }}>Qty: {item.qty} • ${item.price} each</Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              ))
            )}
          </Box>
        )}

        {/* Tab 1: Wishlist */}
        {tabIndex === 1 && (
          <Grid container spacing={3}>
            {user.wishlist?.length === 0 ? (
              <Grid item xs={12}>
                <Paper sx={{ p: 6, textAlign: 'center', bgcolor: '#141414' }}>
                  <Typography variant="h6" sx={{ color: '#AAA', mb: 2 }}>Your Wishlist is Empty</Typography>
                  <Button variant="contained" onClick={() => navigate('/shop')}>Discover Products</Button>
                </Paper>
              </Grid>
            ) : (
              user.wishlist?.map((prod) => (
                <Grid item xs={12} sm={6} md={3} key={typeof prod === 'string' ? prod : prod._id}>
                  <ProductCard product={prod} onOpenARTryOn={onOpenARTryOn} navigate={navigate} />
                </Grid>
              ))
            )}
          </Grid>
        )}

        {/* Tab 2: Skin Profile */}
        {tabIndex === 2 && (
          <Paper sx={{ p: 4, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 600, mb: 3 }}>Saved Skin Profile</Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" sx={{ color: '#AAA' }}>Skin Tone</Typography>
                <Typography variant="subtitle1" sx={{ color: '#FFF', fontWeight: 600 }}>{user.skinProfile?.skinTone || 'Medium'}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" sx={{ color: '#AAA' }}>Undertone</Typography>
                <Typography variant="subtitle1" sx={{ color: '#FFF', fontWeight: 600 }}>{user.skinProfile?.undertone || 'Neutral'}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" sx={{ color: '#AAA' }}>Skin Type</Typography>
                <Typography variant="subtitle1" sx={{ color: '#FFF', fontWeight: 600 }}>{user.skinProfile?.skinType || 'Combination'}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" sx={{ color: '#AAA' }}>Primary Concerns</Typography>
                <Typography variant="subtitle1" sx={{ color: '#FFF', fontWeight: 600 }}>{user.skinProfile?.concerns?.join(', ') || 'Hyper-pigmentation'}</Typography>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
