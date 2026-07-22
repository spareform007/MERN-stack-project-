import React, { useContext } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Chip
} from '@mui/material';
import { SupportAgent, People, AutoAwesome, Chat, ArrowForward } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';

export default function ExpertDashboardPage({ navigate }) {
  const { user } = useContext(AuthContext);

  return (
    <Box sx={{ bgcolor: '#0D0D0D', color: '#FFF', py: 6, minHeight: '85vh' }}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37', fontWeight: 700 }}>
              Certified Beauty Expert Workspace
            </Typography>
            <Typography variant="body2" sx={{ color: '#AAA' }}>Welcome back, {user?.name || 'Artist'}. Client Consultations & Routine Desk.</Typography>
          </Box>

          <Box display="flex" gap={1}>
            <Button variant="outlined" startIcon={<People />} onClick={() => navigate('/expert/client-crm')}>Client CRM</Button>
            <Button variant="contained" startIcon={<AutoAwesome />} onClick={() => navigate('/expert/routine-builder')}>Routine Builder</Button>
          </Box>
        </Box>

        {/* Overview Stats */}
        <Grid container spacing={3} mb={6}>
          <Grid item xs={12} sm={3}>
            <Paper sx={{ p: 3, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ color: '#AAA' }}>Today's Scheduled Consultations</Typography>
              <Typography variant="h4" sx={{ color: '#D4AF37', fontWeight: 700, my: 0.5 }}>6 Active</Typography>
              <Typography variant="caption" sx={{ color: '#00E676' }}>1-on-1 Virtual Sessions</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper sx={{ p: 3, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ color: '#AAA' }}>Assigned Clients</Typography>
              <Typography variant="h4" sx={{ color: '#FFF', fontWeight: 700, my: 0.5 }}>28 Clients</Typography>
              <Typography variant="caption" sx={{ color: '#AAA' }}>Active Profiles</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper sx={{ p: 3, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ color: '#AAA' }}>Routines Prescribed</Typography>
              <Typography variant="h4" sx={{ color: '#FFF', fontWeight: 700, my: 0.5 }}>42 Routines</Typography>
              <Typography variant="caption" sx={{ color: '#E8C76A' }}>Shareable Links Sent</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper sx={{ p: 3, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ color: '#AAA' }}>Expert Commission Earned</Typography>
              <Typography variant="h4" sx={{ color: '#D4AF37', fontWeight: 700, my: 0.5 }}>$1,840.00</Typography>
              <Typography variant="caption" sx={{ color: '#00E676' }}>+12% Artist Bonus</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Today's Schedule */}
        <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37', mb: 3 }}>
          Today's Virtual Consultation Queue
        </Typography>

        <Grid container spacing={3}>
          {[
            { client: 'Sophia Laurent', time: '10:30 AM', topic: 'Shade Match & 24K Gold Routine', status: 'Completed' },
            { client: 'Camille Dubois', time: '02:00 PM', topic: 'Sensitive Skin Hydration & EWG Actives', status: 'In 30 Mins' },
            { client: 'Elena Rostova', time: '04:15 PM', topic: 'Bridal Eye Palette Consultation', status: 'Upcoming' }
          ].map((item, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Paper sx={{ p: 3, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Chip label={item.time} size="small" sx={{ bgcolor: 'rgba(212, 175, 55, 0.15)', color: '#D4AF37', fontWeight: 700 }} />
                  <Chip label={item.status} size="small" sx={{ bgcolor: item.status === 'Completed' ? '#2e7d32' : '#D4AF37', color: '#FFF' }} />
                </Box>
                <Typography variant="h6" sx={{ color: '#FFF', fontWeight: 600, mt: 1 }}>{item.client}</Typography>
                <Typography variant="body2" sx={{ color: '#AAA', mb: 2 }}>{item.topic}</Typography>
                <Button size="small" variant="outlined" endIcon={<ArrowForward />} onClick={() => navigate('/expert/routine-builder')}>
                  Open Routine Desk
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
