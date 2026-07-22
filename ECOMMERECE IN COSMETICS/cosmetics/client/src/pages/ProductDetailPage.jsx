import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  Chip,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Paper,
  Alert,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import {
  ExpandMore,
  CameraAlt,
  ShoppingBag,
  Favorite,
  FavoriteBorder,
  CompareArrows,
  Security,
  AutoAwesome,
  FlashOn,
  LocalShipping,
  Add,
  Remove
} from '@mui/icons-material';
import API from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { CompareContext } from '../context/CompareContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage({ onOpenARTryOn, navigate }) {
  const id = window.location.pathname.split('/product/')[1];
  const { addToCart } = useContext(CartContext);
  const { user, toggleWishlist } = useContext(AuthContext);
  const { toggleCompare } = useContext(CompareContext);

  const [productData, setProductData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [crossSellProducts, setCrossSellProducts] = useState([]);
  const [selectedShade, setSelectedShade] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [loading, setLoading] = useState(true);

  // Review form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  const fetchDetail = () => {
    setLoading(true);
    API.get(`/products/${id}`)
      .then(({ data }) => {
        setProductData(data.product);
        setReviews(data.reviews || []);
        if (data.product.shades?.length > 0) {
          setSelectedShade(data.product.shades[0]);
        }

        // Fetch cross-sell items from same category
        API.get(`/products?category=${data.product.category}`)
          .then((res) => {
            setCrossSellProducts(res.data.filter((p) => p._id !== data.product._id).slice(0, 3));
          });

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDetail();
    window.scrollTo(0, 0);
  }, [id]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setReviewError('Please sign in to submit a verified product review.');
      return;
    }
    setReviewError('');

    try {
      await API.post(`/products/${id}/reviews`, {
        rating: newRating,
        title: newTitle,
        comment: newComment,
        verifiedShade: selectedShade?.shadeName
      });

      setReviewSuccess('Thank you! Your verified review has been published.');
      setNewComment('');
      setNewTitle('');
      fetchDetail();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  const handleBuyNow = () => {
    addToCart(productData, selectedShade, quantity);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <Box textAlign="center" py={12} sx={{ bgcolor: '#0D0D0D' }}>
        <CircularProgress sx={{ color: '#D4AF37' }} />
      </Box>
    );
  }

  if (!productData) {
    return (
      <Box textAlign="center" py={12} sx={{ bgcolor: '#0D0D0D', color: '#FFF' }}>
        <Typography variant="h5">Product Not Found</Typography>
        <Button variant="contained" onClick={() => navigate('/shop')} sx={{ mt: 2 }}>Back to Shop</Button>
      </Box>
    );
  }

  const isWishlisted = user?.wishlist?.some(
    (item) => (typeof item === 'string' ? item : item._id) === productData._id
  );

  const activeImage = selectedShade?.image || productData.images?.[activeImageIndex] || productData.heroImage;

  // Star breakdown calculation
  const totalReviewsCount = Math.max(1, reviews.length);
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    return { star, count, pct: Math.round((count / totalReviewsCount) * 100) };
  });

  return (
    <Box sx={{ bgcolor: '#0D0D0D', color: '#FFF', py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Left: Dynamic Zoom Gallery */}
          <Grid item xs={12} md={6}>
            <Box
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              sx={{
                position: 'relative',
                bgcolor: '#141414',
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                mb: 2,
                cursor: 'zoom-in',
                height: 480
              }}
            >
              <Box
                component="img"
                src={activeImage}
                alt={productData.name}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZoomed ? 'scale(2)' : 'scale(1)',
                  transition: isZoomed ? 'none' : 'transform 0.3s ease'
                }}
              />

              {productData.shades?.length > 0 && (
                <Button
                  variant="contained"
                  startIcon={<CameraAlt />}
                  onClick={() => onOpenARTryOn(productData)}
                  sx={{ position: 'absolute', bottom: 16, right: 16, bgcolor: 'rgba(212, 175, 55, 0.95)', zIndex: 5 }}
                >
                  Try On in AR
                </Button>
              )}
            </Box>

            {/* Thumbnail Carousel */}
            {productData.images && productData.images.length > 1 && (
              <Box display="flex" gap={1.5}>
                {productData.images.map((imgUrl, idx) => (
                  <Box
                    key={idx}
                    component="img"
                    src={imgUrl}
                    alt="Thumbnail"
                    onClick={() => setActiveImageIndex(idx)}
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: 2,
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: activeImageIndex === idx ? '2px solid #D4AF37' : '1px solid #333'
                    }}
                  />
                ))}
              </Box>
            )}
          </Grid>

          {/* Right: Product Meta & Purchase Actions */}
          <Grid item xs={12} md={6}>
            <Box display="flex" gap={1} mb={1}>
              <Chip label={productData.brand} size="small" sx={{ bgcolor: '#D4AF37', color: '#0D0D0D', fontWeight: 700 }} />
              {productData.cleanBeauty && <Chip label="EWG Clean Verified" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#FFF' }} />}
            </Box>

            <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', color: '#FFF', fontWeight: 700, mb: 1 }}>
              {productData.name}
            </Typography>

            <Typography variant="subtitle1" sx={{ color: '#E8C76A', fontStyle: 'italic', mb: 2 }}>
              "{productData.tagline}"
            </Typography>

            {/* Rating */}
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Rating value={Number(productData.rating) || 4.8} precision={0.1} readOnly sx={{ color: '#D4AF37' }} />
              <Typography variant="body2" sx={{ color: '#AAA' }}>
                {productData.rating} ({reviews.length} Customer Reviews)
              </Typography>
            </Box>

            <Typography variant="h4" sx={{ color: '#D4AF37', fontWeight: 700, mb: 3 }}>
              ${productData.price}
            </Typography>

            {/* Shade Swatch Selector */}
            {productData.shades && productData.shades.length > 0 && (
              <Box mb={4}>
                <Typography variant="subtitle2" sx={{ color: '#D4AF37', fontWeight: 600, mb: 1 }}>
                  Selected Shade: {selectedShade?.shadeName}
                </Typography>
                <Box display="flex" gap={1.5} flexWrap="wrap">
                  {productData.shades.map((shade, idx) => (
                    <Box
                      key={idx}
                      onClick={() => setSelectedShade(shade)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        px: 1.5,
                        borderRadius: '20px',
                        bgcolor: selectedShade?.shadeName === shade.shadeName ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255,255,255,0.05)',
                        border: selectedShade?.shadeName === shade.shadeName ? '1px solid #D4AF37' : '1px solid transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: shade.colorHex }} />
                      <Typography variant="caption" sx={{ color: '#FFF', fontWeight: 500 }}>
                        {shade.shadeName}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Quantity Selector */}
            <Box display="flex" alignItems="center" gap={2} mb={4}>
              <Typography variant="subtitle2" sx={{ color: '#AAA' }}>Quantity:</Typography>
              <Box display="flex" alignItems="center" border="1px solid rgba(212, 175, 55, 0.3)" borderRadius={1.5} sx={{ bgcolor: '#141414' }}>
                <IconButton size="small" onClick={() => setQuantity(Math.max(1, quantity - 1))} sx={{ color: '#FFF' }}>
                  <Remove fontSize="small" />
                </IconButton>
                <Typography variant="body1" sx={{ px: 2, fontWeight: 700 }}>{quantity}</Typography>
                <IconButton size="small" onClick={() => setQuantity(quantity + 1)} sx={{ color: '#FFF' }}>
                  <Add fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* Actions */}
            <Grid container spacing={2} mb={4}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingBag />}
                  onClick={() => addToCart(productData, selectedShade, quantity)}
                  sx={{ py: 1.8 }}
                >
                  Add To Bag
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<FlashOn />}
                  onClick={handleBuyNow}
                  sx={{ py: 1.8, borderColor: '#D4AF37', color: '#D4AF37' }}
                >
                  Buy Now
                </Button>
              </Grid>
            </Grid>

            {/* 4 Expandable Accordions */}
            <Box>
              {/* Accordion 1: Description & Ingredients */}
              <Accordion sx={{ bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.2)', color: '#FFF', mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#D4AF37' }} />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Security sx={{ color: '#D4AF37' }} /> Description & EWG Key Ingredients
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: '#0D0D0D' }}>
                  <Typography variant="body2" sx={{ color: '#CCC', mb: 2 }}>{productData.description}</Typography>
                  <Typography variant="caption" sx={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', mb: 1 }}>
                    Key Active Ingredients:
                  </Typography>
                  {productData.keyIngredients?.map((ing, i) => (
                    <Box key={i} display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" sx={{ color: '#FFF' }}>• {ing.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#E8C76A' }}>{ing.purpose} (EWG {ing.ewgScore})</Typography>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>

              {/* Accordion 2: How to Apply & Tips */}
              <Accordion sx={{ bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.2)', color: '#FFF', mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#D4AF37' }} />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoAwesome sx={{ color: '#D4AF37' }} /> How to Apply & Artist Tips
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: '#0D0D0D' }}>
                  <Typography variant="body2" sx={{ color: '#CCC', mb: 2 }}>{productData.howToUse}</Typography>
                  {productData.proTips && (
                    <Typography variant="caption" sx={{ color: '#E8C76A', fontStyle: 'italic' }}>
                      Pro Artist Tip: {productData.proTips}
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>

              {/* Accordion 3: Customer Reviews Breakdown */}
              <Accordion sx={{ bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.2)', color: '#FFF', mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#D4AF37' }} />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    ★ Ratings Breakdown & Client Reviews ({reviews.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: '#0D0D0D' }}>
                  <Box mb={3}>
                    {ratingDistribution.map((item) => (
                      <Box key={item.star} display="flex" alignItems="center" gap={2} mb={0.5}>
                        <Typography variant="caption" sx={{ color: '#AAA', width: 40 }}>{item.star} Stars</Typography>
                        <Box flexGrow={1}>
                          <LinearProgress variant="determinate" value={item.pct} sx={{ bgcolor: '#222', '& .MuiLinearProgress-bar': { bgcolor: '#D4AF37' } }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#888', width: 35 }}>{item.pct}%</Typography>
                      </Box>
                    ))}
                  </Box>

                  {reviews.map((rev) => (
                    <Paper key={rev._id} sx={{ p: 2, mb: 1.5, bgcolor: '#141414', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" sx={{ color: '#FFF' }}>{rev.userName}</Typography>
                        <Rating value={rev.rating} precision={0.5} readOnly size="small" sx={{ color: '#D4AF37' }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#DDD', mt: 0.5 }}>{rev.comment}</Typography>
                    </Paper>
                  ))}
                </AccordionDetails>
              </Accordion>

              {/* Accordion 4: Shipping & Returns Policy */}
              <Accordion sx={{ bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.2)', color: '#FFF' }}>
                <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#D4AF37' }} />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalShipping sx={{ color: '#D4AF37' }} /> Complimentary Shipping & Returns Policy
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: '#0D0D0D' }}>
                  <Typography variant="body2" sx={{ color: '#CCC', mb: 1 }}>
                    All orders over $75 include Complimentary Express Delivery with signature luxury packaging.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#CCC' }}>
                    Enjoy our 30-Day Risk-Free Return Guarantee on all formulations.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Grid>
        </Grid>

        {/* FREQUENTLY BOUGHT TOGETHER CROSS-SELL */}
        {crossSellProducts.length > 0 && (
          <Box mt={10}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  Complete The Couture Routine
                </Typography>
                <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', color: '#FFF', fontWeight: 700 }}>
                  Frequently Bought Together
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<ShoppingBag />}
                onClick={() => {
                  crossSellProducts.forEach((prod) => addToCart(prod));
                  addToCart(productData, selectedShade, quantity);
                }}
              >
                Add Full Routine Bundle To Bag
              </Button>
            </Box>

            <Grid container spacing={3}>
              {crossSellProducts.map((prod) => (
                <Grid item xs={12} sm={4} key={prod._id}>
                  <ProductCard product={prod} onOpenARTryOn={onOpenARTryOn} navigate={navigate} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}
