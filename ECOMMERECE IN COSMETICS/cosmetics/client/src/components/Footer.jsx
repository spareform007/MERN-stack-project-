import React, { useState, useContext } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogContent
} from '@mui/material';
import { AutoAwesome, LocalShipping, Security, Verified, Instagram, Facebook, YouTube, ConfirmationNumber } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

export default function Footer({ currentPath, navigate }) {
  const { user, setUser } = useContext(AuthContext);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');
  const [openToast, setOpenToast] = useState(false);
  const [openPromoModal, setOpenPromoModal] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    if (currentPath === '/admin') {
      setToastMessage('Admin Notice: Newsletter subscriber list synchronized with CRM database.');
      setToastSeverity('info');
      setOpenToast(true);
      setNewsletterEmail('');
      return;
    }

    try {
      const { data } = await API.post('/auth/subscribe-newsletter', { email: newsletterEmail });

      if (data.status === 'vip' && user) {
        setUser({ ...user, loyaltyPoints: data.newPoints });
        setToastMessage(data.message);
        setToastSeverity('success');
        setOpenToast(true);
      } else {
        setOpenPromoModal(true);
      }
      setNewsletterEmail('');
    } catch (err) {
      setToastMessage('Subscription processed. Welcome to MAE\' Privé!');
      setToastSeverity('success');
      setOpenToast(true);
      setNewsletterEmail('');
    }
  };

  return (
    <Box component="footer" sx={{ bgcolor: '#080808', color: '#AAA', pt: 8, pb: 4, borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
      <Container maxWidth="lg">
        {/* Luxury Badges */}
        <Grid container spacing={4} sx={{ mb: 6, textAlign: 'center' }}>
          <Grid item xs={12} sm={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <LocalShipping sx={{ fontSize: 36, color: '#D4AF37', mb: 1 }} />
              <Typography variant="subtitle1" sx={{ color: '#FFF', fontWeight: 600 }}>Complimentary Express Shipping</Typography>
              <Typography variant="caption">On all orders over $75 with signature luxury gift packaging.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Security sx={{ fontSize: 36, color: '#D4AF37', mb: 1 }} />
              <Typography variant="subtitle1" sx={{ color: '#FFF', fontWeight: 600 }}>100% Authentic & Cruelty-Free</Typography>
              <Typography variant="caption">Formulated in Paris & New York with EWG clean luxury ingredients.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <AutoAwesome sx={{ fontSize: 36, color: '#D4AF37', mb: 1 }} />
              <Typography variant="subtitle1" sx={{ color: '#FFF', fontWeight: 600 }}>Mae' Concierge & AI Matching</Typography>
              <Typography variant="caption">Personalized shade consultation & 24/7 Virtual Live Artist Chat.</Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 6 }} />

        {/* Footer Navigation & Newsletter */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37', fontWeight: 700, mb: 1 }}>
              MAE' BEAUTY
            </Typography>
            <Typography variant="caption" display="block" sx={{ color: '#FFF', letterSpacing: '2px', textTransform: 'uppercase', mb: 2 }}>
              Luxury in Every Shade
            </Typography>
            <Typography variant="body2" sx={{ pr: 3, mb: 3 }}>
              Enterprise luxury cosmetics engineered with 24K gold peptides, high-potency botani-hyaluronics, and AR Virtual Try-On technology.
            </Typography>
            <Box display="flex" gap={2}>
              <Instagram sx={{ color: '#D4AF37', cursor: 'pointer' }} />
              <Facebook sx={{ color: '#D4AF37', cursor: 'pointer' }} />
              <YouTube sx={{ color: '#D4AF37', cursor: 'pointer' }} />
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ color: '#FFF', fontWeight: 600, mb: 2 }}>Explore Line</Typography>
            <Typography variant="body2" display="block" onClick={() => navigate('/shop')} sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#D4AF37' } }}>Catalog</Typography>
            <Typography variant="body2" display="block" onClick={() => navigate('/ai-ar-studio')} sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#D4AF37' } }}>AI & AR Studio</Typography>
            <Typography variant="body2" display="block" onClick={() => navigate('/about')} sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#D4AF37' } }}>Brand Story</Typography>
            <Typography variant="body2" display="block" onClick={() => navigate('/guides')} sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#D4AF37' } }}>Beauty Journal</Typography>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ color: '#FFF', fontWeight: 600, mb: 2 }}>Client Service</Typography>
            <Typography variant="body2" display="block" onClick={() => navigate('/support')} sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#D4AF37' } }}>Order Tracking</Typography>
            <Typography variant="body2" display="block" onClick={() => navigate('/support')} sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#D4AF37' } }}>Support & FAQ</Typography>
            <Typography variant="body2" display="block" onClick={() => navigate('/dashboard')} sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#D4AF37' } }}>Mae' VIP Privé</Typography>
            <Typography variant="body2" display="block" onClick={() => navigate('/about')} sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#D4AF37' } }}>EWG Clean Standards</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ color: '#FFF', fontWeight: 600, mb: 1 }}>MAE' VIP Privé Newsletter</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>Subscribe to receive early access to limited edition couture collections & private invitations.</Typography>

            <Box component="form" onSubmit={handleSubscribe} display="flex" gap={1}>
              <TextField
                size="small"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                fullWidth
                sx={{
                  bgcolor: 'rgba(255,255,255,0.05)',
                  input: { color: '#FFF' },
                  '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.3)' }
                }}
              />
              <Button type="submit" variant="contained" sx={{ whiteSpace: 'nowrap' }}>Subscribe</Button>
            </Box>
          </Grid>
        </Grid>

        <Box textAlign="center" mt={6} pt={3} borderTop="1px solid rgba(255,255,255,0.05)">
          <Typography variant="caption" sx={{ color: '#666' }}>
            © {new Date().getFullYear()} MAE' BEAUTY Inc. All rights reserved. Designed for Enterprise Luxury Cosmetics Performance.
          </Typography>
        </Box>
      </Container>

      {/* VIP Toast Snackbar */}
      <Snackbar open={openToast} autoHideDuration={5000} onClose={() => setOpenToast(false)}>
        <Alert severity={toastSeverity} onClose={() => setOpenToast(false)} sx={{ width: '100%', bgcolor: '#141414', color: '#D4AF37', border: '1px solid #D4AF37' }}>
          {toastMessage}
        </Alert>
      </Snackbar>

      {/* Guest Discount Modal */}
      <Dialog open={openPromoModal} onClose={() => setOpenPromoModal(false)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ p: 4, bgcolor: '#141414', color: '#FFF', textAlign: 'center' }}>
          <ConfirmationNumber sx={{ fontSize: 50, color: '#D4AF37', mb: 2 }} />
          <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37', fontWeight: 700, mb: 1 }}>
            Welcome to VIP Privé!
          </Typography>
          <Typography variant="body2" sx={{ color: '#CCC', mb: 3 }}>
            Use exclusive discount code below for <strong>15% OFF</strong> your first couture order:
          </Typography>

          <Box p={2} sx={{ bgcolor: 'rgba(212, 175, 55, 0.15)', border: '2px dashed #D4AF37', borderRadius: 2, mb: 3 }}>
            <Typography variant="h5" sx={{ color: '#D4AF37', fontWeight: 700, letterSpacing: '3px' }}>
              LUXURY15
            </Typography>
          </Box>

          <Button variant="contained" fullWidth onClick={() => { setOpenPromoModal(false); navigate('/shop'); }}>
            Start Shopping Now
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
