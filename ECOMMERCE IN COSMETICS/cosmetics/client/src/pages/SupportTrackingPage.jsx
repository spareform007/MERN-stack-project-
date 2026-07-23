import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert
} from '@mui/material';
import { Search, ExpandMore, SupportAgent, LocalShipping, HelpOutline, Chat } from '@mui/icons-material';
import API from '../services/api';

export default function SupportTrackingPage({ onOpenLiveChat }) {
  const [trackingId, setTrackingId] = useState('');
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setError('');
    setLoading(true);

    try {
      const { data } = await API.get(`/orders/myorders`);
      const matched = data.find((o) => o.trackingNumber?.toLowerCase() === trackingId.trim().toLowerCase());
      if (matched) {
        setOrderResult(matched);
      } else {
        setError('No order found with matching Tracking ID. Please verify ID format (e.g. MAE-849201).');
        setOrderResult(null);
      }
    } catch (err) {
      setError('Order lookup failed. Please try again or contact live support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#0D0D0D', color: '#FFF', py: 8, minHeight: '85vh' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37', fontWeight: 700, mb: 1 }}>
            CLIENT CONCIERGE & ORDER TRACKING
          </Typography>
          <Typography variant="body1" sx={{ color: '#AAA' }}>
            Instant order lookup, shipment tracking timeline, and 24/7 Virtual Artist Chat.
          </Typography>
        </Box>

        {/* Order Tracking Box */}
        <Paper sx={{ p: 4, mb: 8, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 3 }}>
          <Typography variant="h5" sx={{ color: '#FFF', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalShipping sx={{ color: '#D4AF37' }} /> Real-Time Order Lookup
          </Typography>

          <form onSubmit={handleTrackSubmit}>
            <Box display="flex" gap={1.5} mb={2}>
              <TextField
                fullWidth
                placeholder="Enter Tracking ID (e.g. MAE-849201)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                required
              />
              <Button type="submit" variant="contained" disabled={loading} startIcon={<Search />} sx={{ minWidth: 160 }}>
                {loading ? 'Searching...' : 'Track Package'}
              </Button>
            </Box>
          </form>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          {orderResult && (
            <Box mt={3} p={3} sx={{ bgcolor: '#0D0D0D', border: '1px solid #D4AF37', borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" sx={{ color: '#D4AF37', fontWeight: 700 }}>
                  Order #{orderResult.trackingNumber}
                </Typography>
                <Chip label={orderResult.status} sx={{ bgcolor: '#D4AF37', color: '#0D0D0D', fontWeight: 700 }} />
              </Box>
              <Typography variant="body2" sx={{ color: '#AAA' }}>
                Delivery Address: {orderResult.shippingAddress?.address}, {orderResult.shippingAddress?.city}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: '#FFF', mt: 1 }}>
                Total Order Value: ${orderResult.totalPrice}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* FAQ & Live Chat Trigger */}
        <Grid container spacing={5}>
          <Grid item xs={12} md={7}>
            <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <HelpOutline /> Frequently Asked Questions
            </Typography>

            {[
              { q: 'What is the shipping timeframe for luxury orders?', a: 'All domestic orders over $75 include complimentary Signature Express Delivery (2-3 business days).' },
              { q: 'How does the 100% EWG Clean guarantee work?', a: 'Every formulation is independently audited and rated 1-2 on the EWG hazard scale, ensuring zero toxic chemicals.' },
              { q: 'Can I redeem Mae\' VIP points on my order?', a: 'Yes! Every 100 points equals $1.00 off at checkout. Select "Redeem Points" during checkout.' },
              { q: 'What is your luxury return policy?', a: 'We offer a 30-day risk-free return guarantee on all unopened and lightly tested formulations.' }
            ].map((faq, idx) => (
              <Accordion key={idx} sx={{ bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.2)', color: '#FFF', mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#D4AF37' }} />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: '#0D0D0D' }}>
                  <Typography variant="body2" sx={{ color: '#AAA' }}>{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 4, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 3, textAlign: 'center' }}>
              <SupportAgent sx={{ fontSize: 50, color: '#D4AF37', mb: 2 }} />
              <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#FFF', mb: 1 }}>
                Live Concierge & Beauty Artist
              </Typography>
              <Typography variant="body2" sx={{ color: '#AAA', mb: 3 }}>
                Need personalized shade matching or immediate order changes? Connect live with a certified Beauty Consultant now.
              </Typography>
              <Button variant="contained" fullWidth startIcon={<Chat />} onClick={onOpenLiveChat} sx={{ py: 1.5 }}>
                Launch Live Artist Chat
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
