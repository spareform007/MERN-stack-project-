import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Slider,
  Grid,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import { Close, Videocam, PhotoCamera, Compare, AutoAwesome, ShoppingBag } from '@mui/icons-material';
import { CartContext } from '../context/CartContext';

const MODEL_PHOTOS = [
  { name: 'Fair Cool Model', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600' },
  { name: 'Medium Neutral Model', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600' },
  { name: 'Deep Warm Model', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=600' }
];

export default function VirtualTryOnModal({ open, onClose, initialProduct }) {
  const { addToCart } = useContext(CartContext);

  const [mode, setMode] = useState('model'); // 'webcam' or 'model'
  const [selectedModel, setSelectedModel] = useState(MODEL_PHOTOS[1].url);
  const [activeTab, setActiveTab] = useState(0); // 0: Lipstick, 1: Blush, 2: Foundation, 3: Eyeshadow

  const [colorHex, setColorHex] = useState(initialProduct?.shades?.[0]?.colorHex || '#800020');
  const [shadeName, setShadeName] = useState(initialProduct?.shades?.[0]?.shadeName || 'Velvet Red');
  const [opacity, setOpacity] = useState(0.55);
  const [isSplitView, setIsSplitView] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (initialProduct?.shades?.[0]) {
      setColorHex(initialProduct.shades[0].colorHex);
      setShadeName(initialProduct.shades[0].shadeName);
    }
  }, [initialProduct]);

  useEffect(() => {
    let stream = null;
    if (open && mode === 'webcam') {
      navigator.mediaDevices?.getUserMedia({ video: true })
        .then((s) => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch(() => {
          setMode('model');
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [open, mode]);

  useEffect(() => {
    if (!open) return;

    const renderCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw base image or webcam video
      if (mode === 'webcam' && videoRef.current && videoRef.current.readyState === 4) {
        ctx.drawImage(videoRef.current, 0, 0, width, height);
      } else {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = selectedModel;
        if (img.complete) {
          ctx.drawImage(img, 0, 0, width, height);
        } else {
          img.onload = () => ctx.drawImage(img, 0, 0, width, height);
        }
      }

      // Render Virtual AR Makeup Overlay Layer
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = colorHex;

      if (activeTab === 0) {
        // Lipstick Oval Overlay simulation around lower face
        ctx.beginPath();
        ctx.ellipse(width * 0.5, height * 0.72, width * 0.12, height * 0.04, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (activeTab === 1) {
        // Blush Cheeks
        ctx.beginPath();
        ctx.ellipse(width * 0.35, height * 0.55, width * 0.08, height * 0.05, 0, 0, Math.PI * 2);
        ctx.ellipse(width * 0.65, height * 0.55, width * 0.08, height * 0.05, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (activeTab === 2) {
        // Foundation face overlay
        ctx.beginPath();
        ctx.ellipse(width * 0.5, height * 0.5, width * 0.35, height * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (activeTab === 3) {
        // Eyeshadow
        ctx.beginPath();
        ctx.ellipse(width * 0.38, height * 0.42, width * 0.07, height * 0.03, 0, 0, Math.PI * 2);
        ctx.ellipse(width * 0.62, height * 0.42, width * 0.07, height * 0.03, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Split View line
      if (isSplitView) {
        ctx.beginPath();
        ctx.moveTo(width * 0.5, 0);
        ctx.lineTo(width * 0.5, height);
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#D4AF37';
        ctx.font = '14px Poppins';
        ctx.fillText('Original', width * 0.1, 30);
        ctx.fillText('MAE AR Try-On', width * 0.6, 30);
      }

      animationFrameRef.current = requestAnimationFrame(renderCanvas);
    };

    renderCanvas();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [open, mode, selectedModel, colorHex, opacity, activeTab, isSplitView]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: 0, bgcolor: '#0D0D0D', color: '#FFF', position: 'relative' }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2.5} borderBottom="1px solid rgba(212, 175, 55, 0.25)">
          <Box display="flex" alignItems="center" gap={1}>
            <AutoAwesome sx={{ color: '#D4AF37' }} />
            <Typography variant="h6" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37' }}>
              Virtual AR Studio | MAE' BEAUTY
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Button
              size="small"
              variant={mode === 'webcam' ? 'contained' : 'outlined'}
              startIcon={<Videocam />}
              onClick={() => setMode('webcam')}
            >
              Live Camera
            </Button>
            <Button
              size="small"
              variant={mode === 'model' ? 'contained' : 'outlined'}
              startIcon={<PhotoCamera />}
              onClick={() => setMode('model')}
            >
              Model
            </Button>
            <IconButton onClick={onClose} sx={{ color: '#FFF', ml: 1 }}><Close /></IconButton>
          </Box>
        </Box>

        <Grid container>
          {/* Main Visualizer Area */}
          <Grid item xs={12} md={7} sx={{ position: 'relative', bgcolor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 420 }}>
            {mode === 'webcam' && (
              <video ref={videoRef} autoPlay playsInline muted style={{ display: 'none' }} />
            )}
            <canvas ref={canvasRef} width={500} height={500} style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '4px' }} />

            <Box sx={{ position: 'absolute', bottom: 16, left: 16, zIndex: 3 }}>
              <Button
                size="small"
                variant="contained"
                startIcon={<Compare />}
                onClick={() => setIsSplitView(!isSplitView)}
                sx={{ bgcolor: 'rgba(20,20,20,0.85)', backdropFilter: 'blur(8px)', color: '#D4AF37' }}
              >
                {isSplitView ? 'Full View' : 'Split Comparison'}
              </Button>
            </Box>
          </Grid>

          {/* Controls Area */}
          <Grid item xs={12} md={5} sx={{ p: 3, bgcolor: '#141414', borderLeft: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <Tabs
              value={activeTab}
              onChange={(e, val) => setActiveTab(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 3, '& .MuiTabs-indicator': { backgroundColor: '#D4AF37' }, '& .MuiTab-root': { color: '#888', minWidth: 70 } }}
            >
              <Tab label="Lips" />
              <Tab label="Cheeks" />
              <Tab label="Skin" />
              <Tab label="Eyes" />
            </Tabs>

            {/* Model Selector if in model mode */}
            {mode === 'model' && (
              <Box mb={3}>
                <Typography variant="caption" sx={{ color: '#AAA', textTransform: 'uppercase', letterSpacing: '1px', mb: 1, display: 'block' }}>
                  Select Complexion Model:
                </Typography>
                <Box display="flex" gap={1}>
                  {MODEL_PHOTOS.map((m, idx) => (
                    <Box
                      key={idx}
                      component="img"
                      src={m.url}
                      alt={m.name}
                      onClick={() => setSelectedModel(m.url)}
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: selectedModel === m.url ? '2px solid #D4AF37' : '1px solid #333'
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Product Shade Palette */}
            {initialProduct?.shades && initialProduct.shades.length > 0 ? (
              <Box mb={3}>
                <Typography variant="subtitle2" sx={{ color: '#D4AF37', fontWeight: 600, mb: 1 }}>
                  Current Shade: {shadeName}
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {initialProduct.shades.map((shade, idx) => (
                    <Chip
                      key={idx}
                      label={shade.shadeName}
                      onClick={() => { setColorHex(shade.colorHex); setShadeName(shade.shadeName); }}
                      avatar={<Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: shade.colorHex }} />}
                      sx={{
                        bgcolor: colorHex === shade.colorHex ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255,255,255,0.05)',
                        border: colorHex === shade.colorHex ? '1px solid #D4AF37' : '1px solid transparent',
                        color: '#FFF',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </Box>
              </Box>
            ) : (
              <Box mb={3}>
                <Typography variant="caption" sx={{ color: '#AAA', textTransform: 'uppercase', mb: 1, display: 'block' }}>
                  Custom Shade Tint:
                </Typography>
                <Box display="flex" gap={1}>
                  {['#800020', '#C38270', '#D87093', '#E06D53', '#D4AF37', '#69432B'].map((hex, idx) => (
                    <Box
                      key={idx}
                      onClick={() => { setColorHex(hex); setShadeName(`Custom Tint ${idx+1}`); }}
                      sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: hex, cursor: 'pointer', border: colorHex === hex ? '2px solid #D4AF37' : 'none' }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Opacity Intensity */}
            <Box mb={4}>
              <Typography variant="caption" sx={{ color: '#AAA', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Finish Opacity / Coverage: {Math.round(opacity * 100)}%
              </Typography>
              <Slider
                value={opacity}
                min={0.1}
                max={0.9}
                step={0.05}
                onChange={(e, val) => setOpacity(val)}
                sx={{ color: '#D4AF37' }}
              />
            </Box>

            {initialProduct && (
              <Button
                fullWidth
                variant="contained"
                startIcon={<ShoppingBag />}
                onClick={() => {
                  addToCart(initialProduct, { shadeName, colorHex });
                  onClose();
                }}
                sx={{ py: 1.5 }}
              >
                Add Shade ({shadeName}) To Bag - ${initialProduct.price}
              </Button>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
