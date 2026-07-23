import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  Slider,
  Paper,
  Button,
  Chip,
  CircularProgress
} from '@mui/material';
import { FilterList, Refresh } from '@mui/icons-material';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

const subCategoryMap = {
  All: ['All Subcategories'],
  Makeup: ['All Makeup', 'Foundation', 'Concealer', 'Powder', 'Bronzer', 'Blush', 'Highlighter'],
  Skincare: ['All Skincare', 'Serums', 'Moisturizers', 'Cleansers', 'Eye Care', 'Face Masks', 'Sunscreen'],
  Lipstick: ['All Lipsticks', 'Velvet Matte', 'Liquid Lip', 'Gloss', 'Lip Balms', 'Lip Liners'],
  Eyes: ['All Eyes', 'Eyeshadow Palettes', 'Eyeliner', 'Mascara', 'Eyebrow Kits']
};

export default function ShopPage({ onOpenARTryOn, navigate }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [category, setCategory] = useState('All');
  const [subCategory, setSubCategory] = useState('All Subcategories');
  const [finish, setFinish] = useState('All');
  const [skinType, setSkinType] = useState('All');
  const [cleanBeauty, setCleanBeauty] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 250]);
  const [sort, setSort] = useState('newest');

  const fetchProducts = () => {
    setLoading(true);
    let url = `/products?category=${category}&finish=${finish}&skinType=${skinType}&cleanBeauty=${cleanBeauty}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&sort=${sort}`;

    API.get(url)
      .then(({ data }) => {
        let filtered = data;
        if (subCategory && !subCategory.startsWith('All')) {
          filtered = filtered.filter((p) => p.subCategory === subCategory);
        }
        setProducts(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [category, subCategory, finish, skinType, cleanBeauty, sort]);

  const handleCategoryChange = (val) => {
    setCategory(val);
    setSubCategory(subCategoryMap[val]?.[0] || 'All Subcategories');
  };

  const handleResetFilters = () => {
    setCategory('All');
    setSubCategory('All Subcategories');
    setFinish('All');
    setSkinType('All');
    setCleanBeauty(false);
    setPriceRange([0, 250]);
    setSort('newest');
  };

  return (
    <Box sx={{ bgcolor: '#0D0D0D', color: '#FFF', py: 6, minHeight: '85vh' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37', fontWeight: 700, mb: 1 }}>
            MAE' COUTURE CATALOG
          </Typography>
          <Typography variant="body1" sx={{ color: '#AAA', letterSpacing: '1px' }}>
            210+ Handcrafted luxury formulations across 21 subcategories with 24K Gold peptides and EWG clean safety.
          </Typography>
        </Box>

        {/* Subcategory Pill Chips */}
        <Box display="flex" gap={1} overflow="auto" pb={2} mb={4} flexWrap="nowrap" sx={{ borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}>
          {subCategoryMap[category]?.map((sub) => (
            <Chip
              key={sub}
              label={sub}
              onClick={() => setSubCategory(sub)}
              sx={{
                bgcolor: subCategory === sub ? '#D4AF37' : 'rgba(255,255,255,0.05)',
                color: subCategory === sub ? '#0D0D0D' : '#FFF',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            />
          ))}
        </Box>

        <Grid container spacing={4}>
          {/* Sidebar Filters */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FilterList fontSize="small" /> Deep Filters
                </Typography>
                <Button size="small" onClick={handleResetFilters} startIcon={<Refresh />} sx={{ color: '#888', fontSize: '0.75rem' }}>
                  Reset
                </Button>
              </Box>

              {/* Category */}
              <Box mb={3}>
                <Typography variant="caption" sx={{ color: '#AAA', textTransform: 'uppercase', letterSpacing: '1px', mb: 1, display: 'block' }}>
                  Main Line Category
                </Typography>
                <FormControl fullWidth size="small">
                  <Select value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
                    <MenuItem value="All">All Categories</MenuItem>
                    <MenuItem value="Makeup">Makeup</MenuItem>
                    <MenuItem value="Skincare">Skincare</MenuItem>
                    <MenuItem value="Lipstick">Lipsticks & Lip Care</MenuItem>
                    <MenuItem value="Eyes">Eyes</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Finish */}
              <Box mb={3}>
                <Typography variant="caption" sx={{ color: '#AAA', textTransform: 'uppercase', letterSpacing: '1px', mb: 1, display: 'block' }}>
                  Finish
                </Typography>
                <FormControl fullWidth size="small">
                  <Select value={finish} onChange={(e) => setFinish(e.target.value)}>
                    <MenuItem value="All">All Finishes</MenuItem>
                    <MenuItem value="Dewy">Glass Dewy</MenuItem>
                    <MenuItem value="Matte">Cashmere Matte</MenuItem>
                    <MenuItem value="Satin">Luminous Satin</MenuItem>
                    <MenuItem value="Radiant">Radiant Glow</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Skin Type */}
              <Box mb={3}>
                <Typography variant="caption" sx={{ color: '#AAA', textTransform: 'uppercase', letterSpacing: '1px', mb: 1, display: 'block' }}>
                  Skin Type
                </Typography>
                <FormControl fullWidth size="small">
                  <Select value={skinType} onChange={(e) => setSkinType(e.target.value)}>
                    <MenuItem value="All">All Skin Types</MenuItem>
                    <MenuItem value="Dry">Dry Skin</MenuItem>
                    <MenuItem value="Oily">Oily Skin</MenuItem>
                    <MenuItem value="Combination">Combination Skin</MenuItem>
                    <MenuItem value="Sensitive">Sensitive Skin</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* EWG Clean */}
              <Box mb={3}>
                <FormControlLabel
                  control={<Checkbox checked={cleanBeauty} onChange={(e) => setCleanBeauty(e.target.checked)} sx={{ color: '#D4AF37', '&.Mui-checked': { color: '#D4AF37' } }} />}
                  label={<Typography variant="body2" sx={{ color: '#FFF' }}>100% EWG Clean Certified</Typography>}
                />
              </Box>

              {/* Price Range */}
              <Box mb={2}>
                <Typography variant="caption" sx={{ color: '#AAA', textTransform: 'uppercase', letterSpacing: '1px', mb: 1, display: 'block' }}>
                  Price Range (${priceRange[0]} - ${priceRange[1]})
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={(e, val) => setPriceRange(val)}
                  onChangeCommitted={fetchProducts}
                  min={0}
                  max={250}
                  sx={{ color: '#D4AF37' }}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Product Grid */}
          <Grid item xs={12} md={9}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} p={2} sx={{ bgcolor: '#141414', borderRadius: 2, border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <Typography variant="body2" sx={{ color: '#AAA' }}>
                Showing <strong style={{ color: '#D4AF37' }}>{products.length}</strong> products for {subCategory}
              </Typography>

              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="caption" sx={{ color: '#AAA' }}>Sort By:</Typography>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <Select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <MenuItem value="newest">New Arrivals</MenuItem>
                    <MenuItem value="bestseller">Best Sellers</MenuItem>
                    <MenuItem value="price-low">Price: Low to High</MenuItem>
                    <MenuItem value="price-high">Price: High to Low</MenuItem>
                    <MenuItem value="rating">Customer Rating</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {loading ? (
              <Box textAlign="center" py={10}>
                <CircularProgress sx={{ color: '#D4AF37' }} />
              </Box>
            ) : products.length === 0 ? (
              <Box textAlign="center" py={10} p={4} sx={{ bgcolor: '#141414', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: '#AAA', mb: 1 }}>No Formulations Found</Typography>
                <Button variant="outlined" onClick={handleResetFilters}>Reset All Filters</Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id}>
                    <ProductCard product={product} onOpenARTryOn={onOpenARTryOn} navigate={navigate} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
