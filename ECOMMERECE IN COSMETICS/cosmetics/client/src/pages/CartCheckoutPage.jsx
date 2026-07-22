import React, { useState, useContext } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  LinearProgress,
  CardMedia
} from '@mui/material';
import { ShoppingBag, CheckCircle, LocalShipping, Payment, CardGiftcard } from '@mui/icons-material';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const SHIPPING_THRESHOLD = 75;

export default function CartCheckoutPage({ navigate }) {
  const { cartItems, subtotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [fullName, setFullName] = useState(user?.name || '');
  const [address, setAddress] = useState('740 Park Avenue, Suite 12B');
  const [city, setCity] = useState('New York');
  const [postalCode, setPostalCode] = useState('10021');
  const [country, setCountry] = useState('United States');
  const [phone, setPhone] = useState('+1 (212) 555-0198');

  const [includeGiftWrap, setIncludeGiftWrap] = useState(true);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [usePoints, setUsePoints] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const shippingDiff = Math.max(0, SHIPPING_THRESHOLD - subtotal);
  const shippingPct = Math.min(100, Math.round((subtotal / SHIPPING_THRESHOLD) * 100));

  const pointsValue = usePoints ? Math.min(subtotal, (user?.loyaltyPoints || 0) / 100) : 0;
  const giftWrapFee = includeGiftWrap ? 0 : 0; // Complimentary signature packaging
  const grandTotal = Math.max(0, subtotal - discount - pointsValue + giftWrapFee);

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === 'MAE10' || coupon.toUpperCase() === 'COUTURE' || coupon.toUpperCase() === 'LUXURY15') {
      const disc = subtotal * 0.15;
      setDiscount(disc);
      setCouponMsg('15% VIP Discount Applied!');
    } else {
      setCouponMsg('Invalid Promo Code');
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to complete your luxury order.');
      return;
    }
    setLoading(true);

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.product.name,
          qty: item.qty,
          image: item.selectedShade?.image || item.product.heroImage,
          price: item.product.price,
          selectedShade: item.selectedShade,
          product: item.product._id
        })),
        shippingAddress: { fullName, address, city, postalCode, country, phone },
        paymentMethod: 'Credit Card / Luxury Pay',
        itemsPrice: subtotal,
        taxPrice: subtotal * 0.08,
        shippingPrice: 0,
        discountAmount: discount,
        pointsRedeemed: usePoints ? Math.floor(pointsValue * 100) : 0,
        totalPrice: grandTotal
      };

      const { data } = await API.post('/orders', orderData);
      setOrderSuccess(data.createdOrder);
      clearCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Order processing failed.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <Box sx={{ bgcolor: '#0D0D0D', color: '#FFF', py: 12 }}>
        <Container maxWidth="sm">
          <Paper p={5} sx={{ p: 4, bgcolor: '#141414', border: '1px solid #D4AF37', borderRadius: 3, textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 70, color: '#D4AF37', mb: 2 }} />
            <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37', fontWeight: 700, mb: 1 }}>
              Order Confirmed & Placed!
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#FFF', mb: 2 }}>
              Tracking Number: <strong>{orderSuccess.trackingNumber}</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: '#AAA', mb: 4 }}>
              Your order has been assigned to our signature gift packaging vault. Express delivery details sent to your registered email.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/dashboard')} fullWidth>
              View Order Tracking in Personal Dashboard
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#0D0D0D', color: '#FFF', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37', fontWeight: 700, mb: 4 }}>
          Luxury Express Checkout
        </Typography>

        {/* Free Shipping Progress Bar */}
        <Paper sx={{ p: 3, mb: 4, bgcolor: 'rgba(212, 175, 55, 0.1)', border: '1px solid #D4AF37', borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle2" sx={{ color: '#D4AF37', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShipping fontSize="small" />
              {shippingDiff === 0 ? '🎉 You unlocked Complimentary Express Delivery & Signature Gift Wrapping!' : `Add $${shippingDiff.toFixed(2)} more to unlock Express Delivery!`}
            </Typography>
            <Typography variant="caption" sx={{ color: '#E8C76A', fontWeight: 700 }}>{shippingPct}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={shippingPct} sx={{ height: 8, borderRadius: 4, bgcolor: '#222', '& .MuiLinearProgress-bar': { bgcolor: '#D4AF37' } }} />
        </Paper>

        <form onSubmit={handleCheckoutSubmit}>
          <Grid container spacing={5}>
            {/* Left Column: Shipping & Payment */}
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 4, mb: 4, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalShipping /> Shipping Address
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Recipient Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Street Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="City" value={city} onChange={(e) => setCity(e.target.value)} required />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Country" value={country} onChange={(e) => setCountry(e.target.value)} required />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </Grid>
                </Grid>
              </Paper>

              <Paper sx={{ p: 4, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Payment /> Payment Method
                </Typography>

                <RadioGroup defaultValue="card">
                  <FormControlLabel value="card" control={<Radio sx={{ color: '#D4AF37', '&.Mui-checked': { color: '#D4AF37' } }} />} label="Mae' VIP Credit Card / Apple Pay / Google Pay" />
                  <FormControlLabel value="klarna" control={<Radio sx={{ color: '#D4AF37', '&.Mui-checked': { color: '#D4AF37' } }} />} label="Klarna 4 Interest-Free Luxury Installments" />
                </RadioGroup>
              </Paper>
            </Grid>

            {/* Right Column: Order Items & Summary */}
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 4, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: '#FFF', fontWeight: 600, mb: 3 }}>Order Summary ({cartItems.reduce((a, b) => a + b.qty, 0)})</Typography>

                <Box mb={3} sx={{ maxHeight: 240, overflowY: 'auto' }}>
                  {cartItems.map((item, idx) => (
                    <Box key={idx} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Box display="flex" gap={1.5} alignItems="center">
                        <CardMedia component="img" image={item.selectedShade?.image || item.product.heroImage} sx={{ width: 45, height: 45, borderRadius: 1.5, objectFit: 'cover' }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 600 }}>{item.product.name}</Typography>
                          <Typography variant="caption" sx={{ color: '#D4AF37' }}>Qty: {item.qty} {item.selectedShade ? `(${item.selectedShade.shadeName})` : ''}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 700 }}>${item.product.price * item.qty}</Typography>
                    </Box>
                  ))}
                </Box>

                {/* Luxury Gift Packaging Checkbox */}
                <Box mb={3} p={1.5} sx={{ bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: 1.5 }}>
                  <FormControlLabel
                    control={<Checkbox checked={includeGiftWrap} onChange={(e) => setIncludeGiftWrap(e.target.checked)} sx={{ color: '#D4AF37', '&.Mui-checked': { color: '#D4AF37' } }} />}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <CardGiftcard sx={{ color: '#D4AF37' }} />
                        <Typography variant="body2" sx={{ color: '#FFF' }}>Include Signature Gold Gift Box & Satin Ribbon (Free)</Typography>
                      </Box>
                    }
                  />
                </Box>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

                {/* Promo Code & Points */}
                <Box mb={3}>
                  <Box display="flex" gap={1} mb={1}>
                    <TextField size="small" placeholder="Promo code (Try LUXURY15)" fullWidth value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                    <Button variant="outlined" size="small" onClick={handleApplyCoupon}>Apply</Button>
                  </Box>
                  {couponMsg && <Typography variant="caption" sx={{ color: couponMsg.includes('VIP') ? '#00E676' : '#FF8A8A' }}>{couponMsg}</Typography>}
                </Box>

                {user?.loyaltyPoints > 0 && (
                  <Box mb={3} p={1.5} sx={{ bgcolor: 'rgba(212, 175, 55, 0.1)', borderRadius: 1.5 }}>
                    <FormControlLabel
                      control={<Radio checked={usePoints} onClick={() => setUsePoints(!usePoints)} sx={{ color: '#D4AF37', '&.Mui-checked': { color: '#D4AF37' } }} />}
                      label={<Typography variant="caption" sx={{ color: '#E8C76A', fontWeight: 600 }}>Redeem {user.loyaltyPoints} Mae' Points (-${((user.loyaltyPoints)/100).toFixed(2)})</Typography>}
                    />
                  </Box>
                )}

                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" sx={{ color: '#AAA' }}>Subtotal</Typography>
                  <Typography variant="body2" sx={{ color: '#FFF' }}>${subtotal.toFixed(2)}</Typography>
                </Box>
                {discount > 0 && (
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" sx={{ color: '#00E676' }}>VIP Discount</Typography>
                    <Typography variant="body2" sx={{ color: '#00E676' }}>-${discount.toFixed(2)}</Typography>
                  </Box>
                )}
                {pointsValue > 0 && (
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" sx={{ color: '#E8C76A' }}>Points Redeemed</Typography>
                    <Typography variant="body2" sx={{ color: '#E8C76A' }}>-${pointsValue.toFixed(2)}</Typography>
                  </Box>
                )}
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="body2" sx={{ color: '#AAA' }}>Signature Express Delivery</Typography>
                  <Typography variant="body2" sx={{ color: '#00E676', fontWeight: 600 }}>COMPLIMENTARY</Typography>
                </Box>

                <Divider sx={{ borderColor: 'rgba(212, 175, 55, 0.3)', mb: 3 }} />

                <Box display="flex" justifyContent="space-between" mb={3}>
                  <Typography variant="h6" sx={{ color: '#FFF', fontWeight: 700 }}>Total</Typography>
                  <Typography variant="h5" sx={{ color: '#D4AF37', fontWeight: 700 }}>${grandTotal.toFixed(2)}</Typography>
                </Box>

                <Button type="submit" variant="contained" size="large" fullWidth disabled={loading || cartItems.length === 0} sx={{ py: 1.8 }}>
                  {loading ? 'Authorizing Payment...' : `Complete Order ($${grandTotal.toFixed(2)})`}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Box>
  );
}
