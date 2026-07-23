import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Chip,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import { People, AutoAwesome, History, NoteAdd } from '@mui/icons-material';
import API from '../../services/api';

export default function ExpertClientCRMPage({ navigate }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    API.get('/expert/clients')
      .then(({ data }) => {
        setClients(data);
        if (data.length > 0) setSelectedClient(data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedClient) return;
    const updated = {
      ...selectedClient,
      consultationNotes: [newNote.trim(), ...(selectedClient.consultationNotes || [])]
    };
    setSelectedClient(updated);
    setNewNote('');
  };

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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37', fontWeight: 700 }}>
              Assigned Client CRM & Skin Profiles
            </Typography>
            <Typography variant="body2" sx={{ color: '#AAA' }}>Manage client shade profiles, order history, and artist notes.</Typography>
          </Box>

          <Button variant="contained" startIcon={<AutoAwesome />} onClick={() => navigate('/expert/routine-builder')}>
            Build Custom Routine
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column: Client List */}
          <Grid item xs={12} md={5}>
            <Typography variant="h6" sx={{ color: '#D4AF37', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <People /> Client Roster ({clients.length})
            </Typography>

            {clients.map((c) => (
              <Paper
                key={c._id}
                onClick={() => setSelectedClient(c)}
                sx={{
                  p: 2.5,
                  mb: 2,
                  bgcolor: selectedClient?._id === c._id ? 'rgba(212, 175, 55, 0.15)' : '#141414',
                  border: selectedClient?._id === c._id ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 2,
                  cursor: 'pointer'
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" sx={{ color: '#FFF', fontWeight: 700 }}>{c.name}</Typography>
                  <Chip label={c.loyaltyTier || 'Gold'} size="small" sx={{ bgcolor: '#D4AF37', color: '#0D0D0D', fontWeight: 700, fontSize: '0.65rem' }} />
                </Box>
                <Typography variant="caption" sx={{ color: '#AAA', display: 'block', mt: 0.5 }}>{c.email}</Typography>
                <Box display="flex" gap={1} mt={1}>
                  <Chip label={`Tone: ${c.skinProfile?.skinTone || 'Medium'}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#DDD', fontSize: '0.65rem' }} />
                  <Chip label={`Type: ${c.skinProfile?.skinType || 'Combination'}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#DDD', fontSize: '0.65rem' }} />
                </Box>
              </Paper>
            ))}
          </Grid>

          {/* Right Column: Client Detail & Consultation Notes */}
          <Grid item xs={12} md={7}>
            {selectedClient ? (
              <Paper sx={{ p: 4, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Box>
                    <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37', fontWeight: 700 }}>
                      {selectedClient.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#AAA' }}>Client ID: {selectedClient._id}</Typography>
                  </Box>
                  <Chip label={`${selectedClient.points || 250} VIP Points`} sx={{ bgcolor: 'rgba(212, 175, 55, 0.2)', color: '#E8C76A', border: '1px solid #D4AF37' }} />
                </Box>

                <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 600, mb: 1 }}>Diagnostic Skin Profile:</Typography>
                <Grid container spacing={2} mb={3}>
                  <Grid item xs={4}>
                    <Typography variant="caption" sx={{ color: '#AAA' }}>Skin Tone</Typography>
                    <Typography variant="body2" sx={{ color: '#E8C76A', fontWeight: 600 }}>{selectedClient.skinProfile?.skinTone || 'Medium'}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" sx={{ color: '#AAA' }}>Undertone</Typography>
                    <Typography variant="body2" sx={{ color: '#E8C76A', fontWeight: 600 }}>{selectedClient.skinProfile?.undertone || 'Neutral'}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" sx={{ color: '#AAA' }}>Skin Concerns</Typography>
                    <Typography variant="body2" sx={{ color: '#E8C76A', fontWeight: 600 }}>{selectedClient.skinProfile?.concerns?.join(', ') || 'Dryness'}</Typography>
                  </Grid>
                </Grid>

                {/* Consultation Notes Form */}
                <Typography variant="subtitle2" sx={{ color: '#D4AF37', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NoteAdd /> Artist Consultation Notes
                </Typography>

                <form onSubmit={handleAddNote}>
                  <Box display="flex" gap={1} mb={3}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Add artist note regarding formula preferences..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <Button type="submit" variant="contained" sx={{ whiteSpace: 'nowrap' }}>Add Note</Button>
                  </Box>
                </form>

                <Box mb={4}>
                  {selectedClient.consultationNotes?.map((note, idx) => (
                    <Paper key={idx} sx={{ p: 2, mb: 1, bgcolor: '#0D0D0D', border: '1px solid rgba(212, 175, 55, 0.15)' }}>
                      <Typography variant="body2" sx={{ color: '#DDD' }}>• {note}</Typography>
                    </Paper>
                  ))}
                </Box>

                {/* Order History */}
                <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <History /> Past Order History ({selectedClient.orderHistory?.length || 0})
                </Typography>

                {selectedClient.orderHistory?.map((ord) => (
                  <Box key={ord._id} p={2} mb={1} sx={{ bgcolor: '#0D0D0D', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#D4AF37' }}>Order #{ord.trackingNumber || ord._id.slice(-6)}</Typography>
                      <Typography variant="caption" sx={{ color: '#AAA' }}>{new Date(ord.createdAt).toLocaleDateString()}</Typography>
                    </Box>
                    <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 700 }}>${ord.totalPrice || ord.totalAmount}</Typography>
                  </Box>
                ))}
              </Paper>
            ) : (
              <Typography variant="body1">Select a client from the roster to view CRM profile.</Typography>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
