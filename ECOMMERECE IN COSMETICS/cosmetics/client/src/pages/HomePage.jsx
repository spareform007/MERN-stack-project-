import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Rating
} from '@mui/material';
import { AutoAwesome, CameraAlt, LocalShipping, Security, ChevronRight } from '@mui/icons-material';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

export default function HomePage({ onOpenARTryOn, onOpenAIMatcher, navigate }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/products')
      .then(({ data }) => {
        setFeaturedProducts(data.filter((p) => p.isFeatured || p.isBestSeller).slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ bgcolor: '#0D0D0D', color: '#FFF' }}>
      {/* HERO SECTION */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(180deg, rgba(13,13,13,0.3) 0%, rgba(13,13,13,0.95) 100%), url("https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1920")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          px: { xs: 2, md: 8 }
        }}
      >
        <Container maxWidth="lg">
          <Box maxWidth="650px">
            <Chip
              icon={<AutoAwesome style={{ color: '#D4AF37' }} />}
              label="MAE' HAUTE COUTURE 2026 COLLECTION"
              sx={{ bgcolor: 'rgba(212, 175, 55, 0.15)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.4)', mb: 3, fontWeight: 700, letterSpacing: '1px' }}
            />

            <Typography
              variant="h1"
              sx={{
                fontFamily: 'Playfair Display',
                fontSize: { xs: '2.8rem', md: '4.5rem' },
                fontWeight: 700,
                lineHeight: 1.1,
                mb: 2,
                color: '#FFF'
              }}
            >
              LUXURY IN <br />
              <span className="text-gold-gradient">EVERY SHADE.</span>
            </Typography>

            <Typography variant="h6" sx={{ color: '#DDD', fontWeight: 300, mb: 4, lineHeight: 1.6 }}>
              Crafted with pure 24K gold micro-peptides and rare botanical oils. Experience hyper-pigmented perfection engineered for all skin complexions.
            </Typography>

            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/shop')}
                sx={{ py: 1.8, px: 4 }}
              >
                Shop Collection
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<CameraAlt />}
                onClick={() => onOpenARTryOn(null)}
                sx={{ py: 1.8, px: 3 }}
              >
                Virtual AR Studio
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* AI SHADE & SKIN MATCHER SPOTLIGHT BANNER */}
      <Container maxWidth="lg" sx={{ my: -6, position: 'relative', zIndex: 10 }}>
        <Box
          className="glass-panel"
          p={{ xs: 3, md: 5 }}
          borderRadius={3}
          sx={{
            background: 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(35,28,12,0.95) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <AutoAwesome sx={{ color: '#D4AF37' }} />
                <Typography variant="subtitle2" sx={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>
                  Intelligent Complexion Algorithm
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', color: '#FFF', mb: 2, fontWeight: 700 }}>
                Find Your Exact 24K Shade & Skincare Routine
              </Typography>
              <Typography variant="body1" sx={{ color: '#BBB', mb: 3 }}>
                Our proprietary AI evaluates your undertones, skin type, and concerns to instantly prescribe your bespoke foundation shade and lipstick color palette.
              </Typography>
              <Button variant="contained" startIcon={<AutoAwesome />} onClick={onOpenAIMatcher}>
                Start AI Shade Quiz
              </Button>
            </Grid>
            <Grid item xs={12} md={5} textAlign="center">
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=500"
                alt="AI Skin Match"
                sx={{ width: '100%', maxHeight: 260, objectFit: 'cover', borderRadius: 2, border: '1px solid rgba(212, 175, 55, 0.3)' }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* FEATURED BESTSELLERS */}
      <Container maxWidth="lg" sx={{ pt: 16, pb: 10 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={6}>
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Handcrafted Formulations
            </Typography>
            <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', color: '#FFF', fontWeight: 700 }}>
              Couture Best Sellers
            </Typography>
          </Box>
          <Button endIcon={<ChevronRight />} onClick={() => navigate('/shop')} sx={{ color: '#D4AF37' }}>
            View Full Line
          </Button>
        </Box>

        <Grid container spacing={3}>
          {featuredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product._id}>
              <ProductCard product={product} onOpenARTryOn={onOpenARTryOn} navigate={navigate} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* AR VIRTUAL TRY-ON BANNER */}
      <Box sx={{ bgcolor: '#121212', py: 10, borderY: '1px solid rgba(212, 175, 55, 0.2)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box component="img" src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800" alt="AR Studio" sx={{ width: '100%', borderRadius: 3, border: '1px solid #D4AF37' }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '2px' }}>
                Instant Makeup Simulation
              </Typography>
              <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', color: '#FFF', fontWeight: 700, mb: 3 }}>
                Experience Real-Time Virtual Try-On (AR)
              </Typography>
              <Typography variant="body1" sx={{ color: '#AAA', mb: 4, lineHeight: 1.7 }}>
                See how Rouge Supreme Lipsticks, 24K Foundations, and Astral Eyeshadows look on your face before ordering. Use live webcam or high-definition complexion models with split-screen before/after view.
              </Typography>
              <Button variant="contained" size="large" startIcon={<CameraAlt />} onClick={() => onOpenARTryOn(null)}>
                Launch Virtual AR Studio
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
