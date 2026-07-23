import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Chip,
  CardMedia,
  Alert,
  CircularProgress
} from '@mui/material';
import { AutoAwesome, ShoppingBag, ContentCopy, CheckCircle } from '@mui/icons-material';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function ExpertRoutineBuilderPage() {
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [clientEmail, setClientEmail] = useState('');
  const [routineTitle, setRoutineTitle] = useState("Mae' VIP Radiance Routine");
  const [generatedPayload, setGeneratedPayload] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/products')
      .then(({ data }) => {
        setProducts(data);
        if (data.length > 0) {
          setSelectedProductIds([data[0]._id, data[2]?._id || data[0]._id]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleProductToggle = (id) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((pId) => pId !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const handleBuildRoutine = async () => {
    if (selectedProductIds.length === 0) return;
    try {
      const { data } = await API.post('/expert/build-cart', {
        productIds: selectedProductIds,
        clientEmail
      });

      setGeneratedPayload(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Routine generation failed.');
    }
  };

  const handleCopyLink = () => {
    if (!generatedPayload) return;
    const fullUrl = `${window.location.origin}${generatedPayload.shareableUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <Box textAlign="center" py={12} sx={{ bgcolor: '#0D0D0D' }}>
        <CircularProgress sx={{ color: '#D4AF37' }} />
      </Box>
    );
  }

  const selectedProducts = products.filter((p) => selectedProductIds.includes(p._id));
  const totalRoutinePrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <Box sx={{ bgcolor: '#0D0D0D', color: '#FFF', py: 6, minHeight: '85vh' }}>
      <Container maxWidth="lg">
        <Box mb={4}>
          <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37', fontWeight: 700 }}>
            Custom Routine Builder Desk
          </Typography>
          <Typography variant="body2" sx={{ color: '#AAA' }}>
            Select formulation SKUs to bundle into a bespoke regimen. Generates a pre-filled checkout link tracked to Expert ID: {user?._id}.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column: Product Selection Checklist */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 600, mb: 2 }}>
                Select Formulations for Routine ({selectedProductIds.length})
              </Typography>

              <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
                {products.map((prod) => {
                  const selected = selectedProductIds.includes(prod._id);
                  return (
                    <Box
                      key={prod._id}
                      onClick={() => handleProductToggle(prod._id)}
                      p={2}
                      mb={1.5}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        bgcolor: selected ? 'rgba(212, 175, 55, 0.15)' : '#0D0D0D',
                        border: selected ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 2,
                        cursor: 'pointer'
                      }}
                    >
                      <Box display="flex" gap={2} alignItems="center">
                        <Checkbox checked={selected} sx={{ color: '#D4AF37', '&.Mui-checked': { color: '#D4AF37' } }} />
                        <CardMedia component="img" image={prod.heroImage} sx={{ width: 45, height: 45, borderRadius: 1.5, objectFit: 'cover' }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 600 }}>{prod.name}</Typography>
                          <Typography variant="caption" sx={{ color: '#AAA' }}>{prod.category} • {prod.finish} Finish</Typography>
                        </Box>
                      </Box>
                      <Typography variant="subtitle2" sx={{ color: '#D4AF37', fontWeight: 700 }}>${prod.price}</Typography>
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Grid>

          {/* Right Column: Routine Preview & Link Generator */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 4, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 3 }}>
              <Typography variant="h6" sx={{ color: '#FFF', fontWeight: 600, mb: 2 }}>Routine Details</Typography>

              <TextField
                fullWidth
                label="Routine Title"
                size="small"
                value={routineTitle}
                onChange={(e) => setRoutineTitle(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Recipient Client Email (Optional)"
                size="small"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                sx={{ mb: 3 }}
              />

              <Typography variant="caption" sx={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', mb: 1 }}>
                Bundled Products ({selectedProducts.length}):
              </Typography>

              <Box mb={3}>
                {selectedProducts.map((p) => (
                  <Box key={p._id} display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" sx={{ color: '#FFF' }}>• {p.name}</Typography>
                    <Typography variant="body2" sx={{ color: '#E8C76A' }}>${p.price}</Typography>
                  </Box>
                ))}
              </Box>

              <Box display="flex" justifyContent="space-between" p={2} mb={3} sx={{ bgcolor: 'rgba(212, 175, 55, 0.1)', borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ color: '#FFF', fontWeight: 700 }}>Total Routine Price</Typography>
                <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 700 }}>${totalRoutinePrice}</Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<AutoAwesome />}
                onClick={handleBuildRoutine}
                disabled={selectedProductIds.length === 0}
                sx={{ py: 1.5, mb: 3 }}
              >
                Generate Pre-Filled Routine Link
              </Button>

              {generatedPayload && (
                <Box p={2} sx={{ bgcolor: '#0D0D0D', border: '1px solid #D4AF37', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: '#00E676', fontWeight: 700, display: 'block', mb: 1 }}>
                    ✓ Pre-Filled Link Generated!
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    readOnly
                    value={`${window.location.origin}${generatedPayload.shareableUrl}`}
                    sx={{ mb: 1, bgcolor: '#141414' }}
                  />
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={copied ? <CheckCircle style={{ color: '#00E676' }} /> : <ContentCopy />}
                    onClick={handleCopyLink}
                    sx={{ color: '#D4AF37', borderColor: '#D4AF37' }}
                  >
                    {copied ? 'Link Copied to Clipboard!' : 'Copy Shareable Link'}
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
