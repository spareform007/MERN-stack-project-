import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress
} from '@mui/material';
import { AttachMoney, ShoppingBag, People, TrendingUp, Calculate } from '@mui/icons-material';
import API from '../../services/api';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/stats')
      .then(({ data }) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" py={12} sx={{ bgcolor: '#0D0D0D' }}>
        <CircularProgress sx={{ color: '#D4AF37' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#0D0D0D', color: '#FFF', py: 6, minHeight: '85vh' }}>
      <Container maxWidth="lg">
        <Box mb={4}>
          <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37', fontWeight: 700 }}>
            Executive Sales Analytics & Growth Metrics
          </Typography>
          <Typography variant="body2" sx={{ color: '#AAA' }}>Calculated via Mongoose Aggregation Pipelines.</Typography>
        </Box>

        <Grid container spacing={3} mb={6}>
          <Grid item xs={12} sm={3}>
            <Paper sx={{ p: 3, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="caption" sx={{ color: '#AAA' }}>Total Platform Revenue</Typography>
                <AttachMoney sx={{ color: '#D4AF37' }} />
              </Box>
              <Typography variant="h4" sx={{ color: '#D4AF37', fontWeight: 700 }}>${stats?.totalRevenue}</Typography>
              <Typography variant="caption" sx={{ color: '#00E676', display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp fontSize="small" sx={{ mr: 0.5 }} /> +{stats?.monthlyGrowth}% Monthly Growth
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Paper sx={{ p: 3, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="caption" sx={{ color: '#AAA' }}>Average Order Value ($AOV)</Typography>
                <Calculate sx={{ color: '#D4AF37' }} />
              </Box>
              <Typography variant="h4" sx={{ color: '#FFF', fontWeight: 700 }}>${stats?.aov}</Typography>
              <Typography variant="caption" sx={{ color: '#E8C76A', display: 'block', mt: 1 }}>Aggregated Per Checkout</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Paper sx={{ p: 3, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="caption" sx={{ color: '#AAA' }}>Total Orders Count</Typography>
                <ShoppingBag sx={{ color: '#D4AF37' }} />
              </Box>
              <Typography variant="h4" sx={{ color: '#FFF', fontWeight: 700 }}>{stats?.totalOrders}</Typography>
              <Typography variant="caption" sx={{ color: '#AAA', display: 'block', mt: 1 }}>Processed Orders</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Paper sx={{ p: 3, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="caption" sx={{ color: '#AAA' }}>Conversion Rate</Typography>
                <TrendingUp sx={{ color: '#00E676' }} />
              </Box>
              <Typography variant="h4" sx={{ color: '#FFF', fontWeight: 700 }}>{stats?.conversionRate}%</Typography>
              <Typography variant="caption" sx={{ color: '#00E676', display: 'block', mt: 1 }}>High VIP Conversion</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
