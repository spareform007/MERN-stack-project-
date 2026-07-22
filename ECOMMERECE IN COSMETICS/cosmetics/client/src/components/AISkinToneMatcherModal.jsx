import React, { useState, useContext } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Card,
  CardMedia,
  CardContent,
  CircularProgress
} from '@mui/material';
import { AutoAwesome, Close, CheckCircle, ShoppingBag } from '@mui/icons-material';
import API from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export default function AISkinToneMatcherModal({ open, onClose, navigate }) {
  const { addToCart } = useContext(CartContext);
  const { updateSkinProfile } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [skinTone, setSkinTone] = useState('Medium');
  const [undertone, setUndertone] = useState('Neutral');
  const [skinType, setSkinType] = useState('Combination');
  const [concerns, setConcerns] = useState(['Hyper-pigmentation']);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleConcernToggle = (c) => {
    if (concerns.includes(c)) {
      setConcerns(concerns.filter((item) => item !== c));
    } else {
      setConcerns([...concerns, c]);
    }
  };

  const handleRunAIAnalysis = async () => {
    setLoading(true);
    try {
      const { data } = await API.post('/ai/recommend', {
        skinType,
        skinTone,
        undertone,
        concerns
      });

      setResults(data);
      setStep(3);

      // Save to user profile if logged in
      updateSkinProfile({ skinType, undertone, skinTone, concerns });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: 4, bgcolor: '#141414', color: '#FFF' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <AutoAwesome sx={{ color: '#D4AF37' }} />
            <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37' }}>
              MAE' AI Skin Tone & Routine Matcher
            </Typography>
          </Box>
          <Button onClick={onClose} sx={{ color: '#888' }}><Close /></Button>
        </Box>

        {step === 1 && (
          <Box>
            <Typography variant="subtitle1" sx={{ color: '#FFF', mb: 3 }}>
              Step 1 of 2: Define your Skin Complexion & Undertone
            </Typography>

            <Typography variant="caption" sx={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', mb: 1 }}>
              Select Primary Skin Tone:
            </Typography>
            <Grid container spacing={2} mb={4}>
              {['Fair', 'Light', 'Medium', 'Tan', 'Deep'].map((t) => (
                <Grid item xs={6} sm={2.4} key={t}>
                  <Box
                    onClick={() => setSkinTone(t)}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      bgcolor: skinTone === t ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255,255,255,0.03)',
                      border: skinTone === t ? '2px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 2,
                      cursor: 'pointer'
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: skinTone === t ? '#D4AF37' : '#FFF' }}>{t}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Typography variant="caption" sx={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', mb: 1 }}>
              Select Undertone:
            </Typography>
            <Grid container spacing={2} mb={4}>
              {[
                { name: 'Cool', desc: 'Pink / Bluish veins' },
                { name: 'Warm', desc: 'Golden / Peachy veins' },
                { name: 'Neutral', desc: 'Mix of Cool & Warm' },
                { name: 'Olive', desc: 'Greenish / Earthy undertones' }
              ].map((u) => (
                <Grid item xs={6} sm={3} key={u.name}>
                  <Box
                    onClick={() => setUndertone(u.name)}
                    sx={{
                      p: 2,
                      bgcolor: undertone === u.name ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255,255,255,0.03)',
                      border: undertone === u.name ? '2px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 2,
                      cursor: 'pointer'
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: undertone === u.name ? '#D4AF37' : '#FFF' }}>{u.name}</Typography>
                    <Typography variant="caption" sx={{ color: '#888' }}>{u.desc}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box display="flex" justifyContent="flex-end">
              <Button variant="contained" onClick={() => setStep(2)}>Next: Skin Profile</Button>
            </Box>
          </Box>
        )}

        {step === 2 && (
          <Box>
            <Typography variant="subtitle1" sx={{ color: '#FFF', mb: 3 }}>
              Step 2 of 2: Skin Type & Concerns
            </Typography>

            <Typography variant="caption" sx={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', mb: 1 }}>
              Skin Type:
            </Typography>
            <Box display="flex" gap={1} mb={4} flexWrap="wrap">
              {['Dry', 'Oily', 'Combination', 'Normal', 'Sensitive'].map((st) => (
                <Chip
                  key={st}
                  label={st}
                  onClick={() => setSkinType(st)}
                  sx={{
                    bgcolor: skinType === st ? '#D4AF37' : 'rgba(255,255,255,0.05)',
                    color: skinType === st ? '#0D0D0D' : '#FFF',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                />
              ))}
            </Box>

            <Typography variant="caption" sx={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', mb: 1 }}>
              Target Skin Concerns:
            </Typography>
            <Box display="flex" gap={1} mb={4} flexWrap="wrap">
              {['Hyper-pigmentation', 'Dryness', 'Fine Lines & Aging', 'Enlarged Pores', 'Redness & Sensitivity', 'Uneven Texture', 'Acne Prone'].map((c) => {
                const selected = concerns.includes(c);
                return (
                  <Chip
                    key={c}
                    label={c}
                    icon={selected ? <CheckCircle style={{ color: '#0D0D0D' }} /> : undefined}
                    onClick={() => handleConcernToggle(c)}
                    sx={{
                      bgcolor: selected ? '#E8C76A' : 'rgba(255,255,255,0.05)',
                      color: selected ? '#0D0D0D' : '#FFF',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  />
                );
              })}
            </Box>

            <Box display="flex" justifyContent="space-between">
              <Button onClick={() => setStep(1)} sx={{ color: '#FFF' }}>Back</Button>
              <Button
                variant="contained"
                onClick={handleRunAIAnalysis}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} /> : <AutoAwesome />}
              >
                {loading ? 'Synthesizing AI Algorithm...' : 'Generate Couture Match'}
              </Button>
            </Box>
          </Box>
        )}

        {step === 3 && results && (
          <Box>
            <Box p={2.5} sx={{ bgcolor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 2, mb: 4 }}>
              <Typography variant="subtitle1" sx={{ color: '#D4AF37', fontWeight: 700, mb: 0.5 }}>
                {results.profileAnalysis.routineName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#EEE' }}>
                {results.profileAnalysis.summary}
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ fontFamily: 'Playfair Display', color: '#FFF', mb: 2 }}>
              Top AI Matched Products
            </Typography>

            <Grid container spacing={2} mb={3}>
              {results.topMatches.slice(0, 3).map((match, idx) => (
                <Grid item xs={12} sm={4} key={idx}>
                  <Card sx={{ bgcolor: '#0D0D0D', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <CardMedia component="img" height="140" image={match.product.heroImage} alt={match.product.name} />
                    <CardContent sx={{ p: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Chip label={`${match.matchScore}% Match`} size="small" sx={{ bgcolor: '#D4AF37', color: '#0D0D0D', fontWeight: 700, fontSize: '0.65rem' }} />
                        <Typography variant="subtitle2" sx={{ color: '#D4AF37', fontWeight: 700 }}>${match.product.price}</Typography>
                      </Box>
                      <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {match.product.name}
                      </Typography>
                      {match.recommendedShade && (
                        <Typography variant="caption" sx={{ color: '#AAA', display: 'block', mt: 0.5 }}>
                          Shade: {match.recommendedShade.shadeName}
                        </Typography>
                      )}
                      <Button
                        size="small"
                        fullWidth
                        variant="outlined"
                        startIcon={<ShoppingBag />}
                        onClick={() => {
                          addToCart(match.product, match.recommendedShade);
                          onClose();
                        }}
                        sx={{ mt: 1.5, fontSize: '0.7rem' }}
                      >
                        Add Shade
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box display="flex" justifyContent="space-between">
              <Button onClick={() => setStep(1)} sx={{ color: '#888' }}>Recalibrate Questionnaire</Button>
              <Button variant="contained" onClick={onClose}>Explore Full Collection</Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
