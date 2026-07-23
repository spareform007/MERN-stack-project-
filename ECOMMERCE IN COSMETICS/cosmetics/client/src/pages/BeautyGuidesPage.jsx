import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Paper,
  Divider
} from '@mui/material';
import { AutoAwesome, MenuBook, ShoppingBag, ArrowForward } from '@mui/icons-material';
import API from '../services/api';
import { CartContext } from '../context/CartContext';

export default function BeautyGuidesPage({ navigate }) {
  const { addToCart } = useContext(CartContext);

  const [blogs, setBlogs] = useState([]);
  const [activeBlog, setActiveBlog] = useState(null);

  useEffect(() => {
    API.get('/blogs')
      .then(({ data }) => {
        setBlogs(data);
        if (data.length > 0) setActiveBlog(data[0]);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Box sx={{ bgcolor: '#0D0D0D', color: '#FFF', py: 6, minHeight: '85vh' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37', fontWeight: 700, mb: 1 }}>
            MAE' BEAUTY MASTERCLASSES & GUIDES
          </Typography>
          <Typography variant="body1" sx={{ color: '#AAA', letterSpacing: '1px' }}>
            Beginner-friendly step-by-step makeup tutorials & skin glow routines curated by our Chief Beauty Consultants.
          </Typography>
        </Box>

        <Grid container spacing={5}>
          {/* Left: Blog Article List */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ color: '#D4AF37', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <MenuBook /> Featured Masterclasses
            </Typography>

            {blogs.map((b) => (
              <Paper
                key={b._id}
                onClick={() => setActiveBlog(b)}
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: activeBlog?._id === b._id ? 'rgba(212, 175, 55, 0.15)' : '#141414',
                  border: activeBlog?._id === b._id ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <Chip label={b.category} size="small" sx={{ bgcolor: '#D4AF37', color: '#0D0D0D', fontWeight: 700, mb: 1, fontSize: '0.65rem' }} />
                <Typography variant="subtitle1" sx={{ color: '#FFF', fontWeight: 600, mb: 0.5 }}>{b.title}</Typography>
                <Typography variant="caption" sx={{ color: '#888' }}>{b.readTime} • By {b.author}</Typography>
              </Paper>
            ))}
          </Grid>

          {/* Right: Active Guide Detail */}
          <Grid item xs={12} md={8}>
            {activeBlog ? (
              <Paper sx={{ p: 4, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 3 }}>
                <Box
                  component="img"
                  src={activeBlog.heroImage}
                  alt={activeBlog.title}
                  sx={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 2, mb: 3, border: '1px solid rgba(212, 175, 55, 0.2)' }}
                />

                <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37', fontWeight: 700, mb: 1 }}>
                  {activeBlog.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#AAA', display: 'block', mb: 3 }}>
                  Written by {activeBlog.author} ({activeBlog.authorRole}) • {activeBlog.readTime}
                </Typography>

                <Typography variant="body1" sx={{ color: '#DDD', lineHeight: 1.8, mb: 4 }}>
                  {activeBlog.content}
                </Typography>

                {/* Step-by-Step Breakdown */}
                {activeBlog.tutorialSteps?.length > 0 && (
                  <Box mb={4}>
                    <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#FFF', mb: 3 }}>
                      Step-by-Step Routine Breakdown
                    </Typography>

                    {activeBlog.tutorialSteps.map((step, idx) => (
                      <Box key={idx} p={3} mb={2} sx={{ bgcolor: '#0D0D0D', borderRadius: 2, border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                        <Typography variant="subtitle1" sx={{ color: '#D4AF37', fontWeight: 700 }}>
                          Step {step.stepNumber}: {step.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#BBB', my: 1 }}>
                          {step.description}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Tagged Products Routine Bundle */}
                {activeBlog.taggedProducts?.length > 0 && (
                  <Box p={3} sx={{ bgcolor: 'rgba(212, 175, 55, 0.1)', border: '1px solid #D4AF37', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 700, mb: 1 }}>
                      Shop This Full Look & Routine Bundle
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#AAA', mb: 2 }}>
                      Add all recommended formulation steps directly to your shopping bag with one click.
                    </Typography>

                    <Button
                      variant="contained"
                      startIcon={<ShoppingBag />}
                      onClick={() => {
                        activeBlog.taggedProducts.forEach((p) => addToCart(p));
                      }}
                    >
                      Add Complete Look To Bag
                    </Button>
                  </Box>
                )}
              </Paper>
            ) : (
              <Typography variant="body1">Select a tutorial masterclass to view details.</Typography>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
