import React, { useState, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { AutoAwesome, CameraAlt, Psychology } from '@mui/icons-material';
import AISkinToneMatcherModal from '../components/AISkinToneMatcherModal';
import VirtualTryOnModal from '../components/VirtualTryOnModal';

export default function AIARStudioPage({ navigate }) {
  const [isMatcherOpen, setIsMatcherOpen] = useState(false);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);

  return (
    <Box sx={{ bgcolor: '#0D0D0D', color: '#FFF', py: 8, minHeight: '85vh' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={8}>
          <Box display="inline-flex" alignItems="center" gap={1} p={1} px={2} sx={{ bgcolor: 'rgba(212, 175, 55, 0.15)', border: '1px solid #D4AF37', borderRadius: '20px', mb: 2 }}>
            <AutoAwesome sx={{ color: '#D4AF37' }} />
            <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              MAE' HAUTE TECH BEAUTY LAB
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ fontFamily: 'Playfair Display', color: '#FFF', fontWeight: 700, mb: 2 }}>
            AI Complexion Match & Virtual AR Studio
          </Typography>
          <Typography variant="body1" sx={{ color: '#AAA', maxWidth: 700, mx: 'auto', lineHeight: 1.7 }}>
            Powered by high-precision skin tone detection algorithms and real-time augmented reality canvas shaders. Find your exact shade or test lipsticks and eyeshadows instantly.
          </Typography>
        </Box>

        {/* Feature Cards */}
        <Grid container spacing={5} mb={8}>
          <Grid item xs={12} md={6}>
            <Paper
              className="glass-panel-hover"
              sx={{
                p: 5,
                bgcolor: '#141414',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
            >
              <Box mb={4}>
                <Psychology sx={{ fontSize: 50, color: '#D4AF37', mb: 2 }} />
                <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', color: '#FFF', fontWeight: 700, mb: 2 }}>
                  1. AI Skin Tone & Routine Matcher
                </Typography>
                <Typography variant="body1" sx={{ color: '#AAA', lineHeight: 1.7 }}>
                  Answer a 2-step diagnostic quiz covering your skin tone (Fair to Deep), undertone (Cool, Warm, Neutral, Olive), and target concerns (Dryness, Pores, Redness). Our AI synthesizes your personalized 24K Gold foundation shade and skincare regimen.
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                startIcon={<AutoAwesome />}
                onClick={() => setIsMatcherOpen(true)}
                sx={{ py: 1.8 }}
              >
                Launch AI Match Quiz
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              className="glass-panel-hover"
              sx={{
                p: 5,
                bgcolor: '#141414',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
            >
              <Box mb={4}>
                <CameraAlt sx={{ fontSize: 50, color: '#E8C76A', mb: 2 }} />
                <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', color: '#FFF', fontWeight: 700, mb: 2 }}>
                  2. Virtual AR Makeup Studio
                </Typography>
                <Typography variant="body1" sx={{ color: '#AAA', lineHeight: 1.7 }}>
                  Use your live camera or high-definition complexion models to preview Rouge Supreme Velvet Lipsticks, Liquid Silk Blushes, and Astral Eye Palettes with adjustable shade intensity and split-screen comparison mode.
                </Typography>
              </Box>

              <Button
                variant="outlined"
                size="large"
                startIcon={<CameraAlt />}
                onClick={() => setIsTryOnOpen(true)}
                sx={{ py: 1.8 }}
              >
                Open Virtual AR Studio
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Modals */}
        <AISkinToneMatcherModal open={isMatcherOpen} onClose={() => setIsMatcherOpen(false)} navigate={navigate} />
        <VirtualTryOnModal open={isTryOnOpen} onClose={() => setIsTryOnOpen(false)} />
      </Container>
    </Box>
  );
}
