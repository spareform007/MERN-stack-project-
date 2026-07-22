import React, { useState, useContext } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Chip,
  Rating,
  Tooltip
} from '@mui/material';
import { Favorite, FavoriteBorder, CameraAlt, CompareArrows, ShoppingBag } from '@mui/icons-material';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { CompareContext } from '../context/CompareContext';

export default function ProductCard({ product, onOpenARTryOn, navigate }) {
  const { addToCart } = useContext(CartContext);
  const { user, toggleWishlist } = useContext(AuthContext);
  const { toggleCompare, compareList } = useContext(CompareContext);

  const [selectedShade, setSelectedShade] = useState(product.shades?.[0] || null);

  const isWishlisted = user?.wishlist?.some(
    (item) => (typeof item === 'string' ? item : item._id) === product._id
  );

  const isCompared = compareList.some((p) => p._id === product._id);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    toggleCompare(product);
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <Card
      className="glass-panel-hover"
      onClick={handleCardClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        bgcolor: '#141414',
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer'
      }}
    >
      {/* Badges */}
      <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2, display: 'flex', gap: 0.5, flexDirection: 'column' }}>
        {product.isBestSeller && (
          <Chip label="Bestseller" size="small" sx={{ bgcolor: '#D4AF37', color: '#0D0D0D', fontWeight: 700, fontSize: '0.65rem' }} />
        )}
        {product.cleanBeauty && (
          <Chip label="EWG Clean" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#FFF', fontSize: '0.65rem', backdropFilter: 'blur(4px)' }} />
        )}
      </Box>

      {/* Action overlay buttons */}
      <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <IconButton
          size="small"
          onClick={handleWishlistClick}
          sx={{ bgcolor: 'rgba(13,13,13,0.6)', backdropFilter: 'blur(4px)', color: isWishlisted ? '#D4AF37' : '#FFF', '&:hover': { bgcolor: 'rgba(13,13,13,0.9)' } }}
        >
          {isWishlisted ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
        </IconButton>

        <IconButton
          size="small"
          onClick={handleCompareClick}
          sx={{ bgcolor: 'rgba(13,13,13,0.6)', backdropFilter: 'blur(4px)', color: isCompared ? '#D4AF37' : '#FFF', '&:hover': { bgcolor: 'rgba(13,13,13,0.9)' } }}
          title="Compare Product"
        >
          <CompareArrows fontSize="small" />
        </IconButton>

        {product.shades && product.shades.length > 0 && (
          <Tooltip title="Try On virtually with AR">
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onOpenARTryOn(product); }}
              sx={{ bgcolor: '#D4AF37', color: '#0D0D0D', '&:hover': { bgcolor: '#E8C76A' } }}
            >
              <CameraAlt fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Image */}
      <Box
        sx={{ position: 'relative', pt: '100%', overflow: 'hidden', bgcolor: '#000' }}
      >
        <CardMedia
          component="img"
          image={selectedShade?.image || product.heroImage || product.images?.[0]}
          alt={product.name}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            '&:hover': { transform: 'scale(1.05)' }
          }}
        />
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
        <Typography variant="caption" sx={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
          {product.brand} • {product.subCategory || product.category}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Playfair Display',
            color: '#FFF',
            fontWeight: 600,
            fontSize: '1.05rem',
            lineHeight: 1.3,
            my: 0.5,
            '&:hover': { color: '#D4AF37' }
          }}
        >
          {product.name}
        </Typography>

        {/* Shade Swatches */}
        {product.shades && product.shades.length > 0 && (
          <Box display="flex" gap={0.8} alignItems="center" my={1.5} flexWrap="wrap">
            {product.shades.map((shade, idx) => (
              <Box
                key={idx}
                onClick={(e) => { e.stopPropagation(); setSelectedShade(shade); }}
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  bgcolor: shade.colorHex,
                  border: selectedShade?.shadeName === shade.shadeName ? '2px solid #D4AF37' : '1px solid rgba(255,255,255,0.3)',
                  boxShadow: selectedShade?.shadeName === shade.shadeName ? '0 0 8px rgba(212, 175, 55, 0.8)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title={shade.shadeName}
              />
            ))}
          </Box>
        )}

        {/* Rating */}
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Rating value={product.rating || 4.8} precision={0.1} readOnly size="small" sx={{ color: '#D4AF37' }} />
          <Typography variant="caption" sx={{ color: '#888' }}>({product.numReviews})</Typography>
        </Box>

        {/* Price & Add to Cart */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto" pt={1}>
          <Box>
            <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 700 }}>
              ${product.price}
            </Typography>
            {product.originalPrice && (
              <Typography variant="caption" sx={{ color: '#666', textDecoration: 'line-through', ml: 0.5 }}>
                ${product.originalPrice}
              </Typography>
            )}
          </Box>

          <Button
            size="small"
            variant="contained"
            startIcon={<ShoppingBag sx={{ fontSize: 16 }} />}
            onClick={(e) => { e.stopPropagation(); addToCart(product, selectedShade); }}
            sx={{ fontSize: '0.75rem', py: 0.8, px: 1.8 }}
          >
            Add
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
