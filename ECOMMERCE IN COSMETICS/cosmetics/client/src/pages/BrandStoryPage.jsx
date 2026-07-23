import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Divider,
  Button
} from '@mui/material';
import { Security, AutoAwesome, Public, LocalShipping } from '@mui/icons-material';

export default function BrandStoryPage({ navigate }) {
  return (
    <Box sx={{ bgcolor: '#0D0D0D', color: '#FFF', py: 8, minHeight: '85vh' }}>
      <Container maxWidth="lg">
        {/* Hero */}
        <Box textAlign="center" mb={8}>
          <Typography variant="caption" sx={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 700, mb: 1, display: 'block' }}>
            HAUTE FORMULATION PHILOSOPHY
          </Typography>
          <Typography variant="h2" sx={{ fontFamily: 'Playfair Display', color: '#FFF', fontWeight: 700, mb: 2 }}>
            Paris & New York Formulation Labs
          </Typography>
          <Typography variant="body1" sx={{ color: '#AAA', maxWidth: 750, mx: 'auto', lineHeight: 1.8 }}>
            MAE' BEAUTY was founded on a singular premise: uncompromising luxury for every skin tone. We bridge the gap between high-fashion couture pigments and clean, clinical-grade skin nutrition.
          </Typography>
        </Box>

        {/* 3 Pillars */}
        <Grid container spacing={4} mb={8}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 2, height: '100%' }}>
              <AutoAwesome sx={{ fontSize: 40, color: '#D4AF37', mb: 2 }} />
              <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#FFF', mb: 2 }}>
                24K Gold Peptides
              </Typography>
              <Typography variant="body2" sx={{ color: '#AAA', lineHeight: 1.7 }}>
                Pure 24-Karat colloidal gold micro-peptides stimulate natural cellular turnover, reflecting light to blur fine lines and impart an ethereal glass-skin radiance.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 2, height: '100%' }}>
              <Security sx={{ fontSize: 40, color: '#D4AF37', mb: 2 }} />
              <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#FFF', mb: 2 }}>
                100% EWG Clean Certified
              </Typography>
              <Typography variant="body2" sx={{ color: '#AAA', lineHeight: 1.7 }}>
                Formulated strictly without parabens, phthalates, synthetic fragrance, or toxic fillers. Rated 1-2 on the EWG safety scale for complete skin harmony.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 2, height: '100%' }}>
              <Public sx={{ fontSize: 40, color: '#D4AF37', mb: 2 }} />
              <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#FFF', mb: 2 }}>
                Cruelty-Free & Sustainable
              </Typography>
              <Typography variant="body2" sx={{ color: '#AAA', lineHeight: 1.7 }}>
                Zero animal testing, 100% vegan formulations, and refillable glass-flacon packaging handcrafted in France to reduce environmental impact.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box textAlign="center" p={6} sx={{ bgcolor: 'rgba(212, 175, 55, 0.1)', border: '1px solid #D4AF37', borderRadius: 3 }}>
          <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37', mb: 2 }}>
            Experience Couture Beauty
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate('/shop')}>
            Explore The Full Catalog
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
