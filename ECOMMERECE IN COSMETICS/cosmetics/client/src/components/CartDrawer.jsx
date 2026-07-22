import React, { useContext } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  CardMedia
} from '@mui/material';
import { Close, Add, Remove, Delete, ShoppingBag } from '@mui/icons-material';
import { CartContext } from '../context/CartContext';

export default function CartDrawer({ navigate }) {
  const { cartItems, isCartOpen, setIsCartOpen, updateQty, removeFromCart, subtotal } = useContext(CartContext);

  const earnedPoints = Math.floor(subtotal * 10);

  return (
    <Drawer anchor="right" open={isCartOpen} onClose={() => setIsCartOpen(false)}>
      <Box sx={{ width: { xs: 320, sm: 400 }, height: '100%', bgcolor: '#0D0D0D', color: '#FFF', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box p={2.5} sx={{ bgcolor: '#141414', borderBottom: '1px solid rgba(212, 175, 55, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <ShoppingBag sx={{ color: '#D4AF37' }} />
            <Typography variant="h6" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37' }}>
              Your Mae' Shopping Bag ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
            </Typography>
          </Box>
          <IconButton onClick={() => setIsCartOpen(false)} sx={{ color: '#FFF' }}><Close /></IconButton>
        </Box>

        {/* Cart Item List */}
        <Box flexGrow={1} p={2.5} sx={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cartItems.length === 0 ? (
            <Box textAlign="center" py={8}>
              <ShoppingBag sx={{ fontSize: 60, color: '#333', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#888', mb: 1 }}>Your Bag is Empty</Typography>
              <Typography variant="body2" sx={{ color: '#555', mb: 3 }}>Discover couture formulations handcrafted with pure 24K gold.</Typography>
              <Button variant="contained" onClick={() => { setIsCartOpen(false); navigate('/shop'); }}>Explore Catalog</Button>
            </Box>
          ) : (
            cartItems.map((item, index) => (
              <Box key={index} display="flex" gap={2} p={2} sx={{ bgcolor: '#141414', borderRadius: 2, border: '1px solid rgba(212, 175, 55, 0.15)' }}>
                <CardMedia
                  component="img"
                  image={item.selectedShade?.image || item.product.heroImage}
                  alt={item.product.name}
                  sx={{ width: 70, height: 70, borderRadius: 1.5, objectFit: 'cover' }}
                />

                <Box flexGrow={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 600, pr: 1 }}>
                      {item.product.name}
                    </Typography>
                    <IconButton size="small" onClick={() => removeFromCart(index)} sx={{ color: '#666', p: 0 }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>

                  {item.selectedShade && (
                    <Typography variant="caption" display="block" sx={{ color: '#D4AF37', mt: 0.5 }}>
                      Shade: {item.selectedShade.shadeName}
                    </Typography>
                  )}

                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1.5}>
                    <Box display="flex" alignItems="center" border="1px solid #333" borderRadius={1}>
                      <IconButton size="small" onClick={() => updateQty(index, item.qty - 1)} sx={{ color: '#FFF', p: 0.3 }}>
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography variant="body2" sx={{ px: 1.5, fontWeight: 600 }}>{item.qty}</Typography>
                      <IconButton size="small" onClick={() => updateQty(index, item.qty + 1)} sx={{ color: '#FFF', p: 0.3 }}>
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>

                    <Typography variant="subtitle1" sx={{ color: '#D4AF37', fontWeight: 700 }}>
                      ${item.product.price * item.qty}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))
          )}
        </Box>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <Box p={2.5} sx={{ bgcolor: '#141414', borderTop: '1px solid rgba(212, 175, 55, 0.25)' }}>
            <Box p={1.5} mb={2} sx={{ bgcolor: 'rgba(212, 175, 55, 0.1)', border: '1px dashed #D4AF37', borderRadius: 1.5, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#E8C76A', fontWeight: 600 }}>
                ✨ You will earn +{earnedPoints} Mae' Club VIP Points with this purchase!
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" sx={{ color: '#AAA' }}>Subtotal</Typography>
              <Typography variant="subtitle1" sx={{ color: '#FFF', fontWeight: 700 }}>${subtotal.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="body2" sx={{ color: '#AAA' }}>Express Shipping</Typography>
              <Typography variant="body2" sx={{ color: '#00E676', fontWeight: 600 }}>COMPLIMENTARY</Typography>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => {
                setIsCartOpen(false);
                navigate('/checkout');
              }}
              sx={{ py: 1.5 }}
            >
              Proceed to Luxury Checkout (${subtotal.toFixed(2)})
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
