import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogContent,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import { Add, Delete, Visibility, VisibilityOff } from '@mui/icons-material';
import API from '../../services/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Makeup');
  const [subCategory, setSubCategory] = useState('Foundation');
  const [stockCount, setStockCount] = useState(100);
  const [finish, setFinish] = useState('Dewy');
  const [description, setDescription] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    API.get('/products')
      .then(({ data }) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleIsHidden = async (prod) => {
    try {
      await API.put(`/products/${prod._id}`, { isHidden: !prod.isHidden });
      fetchProducts();
    } catch (err) {
      alert('Toggle failed.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete product SKU permanently?')) {
      try {
        await API.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert('Delete failed.');
      }
    }
  };

  const handleCreateSKU = async (e) => {
    e.preventDefault();
    try {
      await API.post('/products', {
        name,
        price: Number(price),
        category,
        subCategory,
        stockCount: Number(stockCount),
        finish,
        description,
        isEWGVerified: true,
        isHidden: false,
        shades: [{ shadeName: 'Universal Rose Gold', hexColor: '#D4AF37' }]
      });

      setOpenDialog(false);
      setName('');
      setPrice('');
      setDescription('');
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create product SKU.');
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={12} sx={{ bgcolor: '#0D0D0D' }}>
        <CircularProgress sx={{ color: '#D4AF37' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#0D0D0D', color: '#FFF', py: 6, minHeight: '85vh' }}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37', fontWeight: 700 }}>
              Product SKU Catalog Control
            </Typography>
            <Typography variant="body2" sx={{ color: '#AAA' }}>Toggle `isHidden` visibility, manage stock levels, and publish new SKUs.</Typography>
          </Box>

          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
            Add New SKU
          </Button>
        </Box>

        <TableContainer sx={{ border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 2 }}>
          <Table sx={{ bgcolor: '#141414' }}>
            <TableHead sx={{ bgcolor: '#1C1C1C' }}>
              <TableRow>
                <TableCell sx={{ color: '#D4AF37' }}>SKU Name</TableCell>
                <TableCell sx={{ color: '#D4AF37' }}>Category / Subcategory</TableCell>
                <TableCell sx={{ color: '#D4AF37' }}>Price</TableCell>
                <TableCell sx={{ color: '#D4AF37' }}>Stock Count</TableCell>
                <TableCell sx={{ color: '#D4AF37' }}>EWG Status</TableCell>
                <TableCell sx={{ color: '#D4AF37' }}>`isHidden` Visibility</TableCell>
                <TableCell sx={{ color: '#D4AF37' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((prod) => (
                <TableRow key={prod._id}>
                  <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>{prod.name}</TableCell>
                  <TableCell sx={{ color: '#AAA' }}>{prod.category} • {prod.subCategory}</TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>${prod.price}</TableCell>
                  <TableCell sx={{ color: '#FFF' }}>{prod.stockCount || prod.stock || 100} units</TableCell>
                  <TableCell sx={{ color: '#00E676' }}>{prod.isEWGVerified ? 'Verified' : 'Pending'}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleToggleIsHidden(prod)} sx={{ color: prod.isHidden ? '#FF8A8A' : '#00E676' }}>
                      {prod.isHidden ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleDeleteProduct(prod._id)} sx={{ color: '#FF8A8A' }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal to Create SKU */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogContent sx={{ bgcolor: '#141414', color: '#FFF', p: 4 }}>
            <Typography variant="h6" sx={{ color: '#D4AF37', mb: 2 }}>Create New Formulation SKU</Typography>
            <form onSubmit={handleCreateSKU}>
              <TextField fullWidth label="Product Name" value={name} onChange={(e) => setName(e.target.value)} required sx={{ mb: 2 }} />
              <TextField fullWidth label="Price ($)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required sx={{ mb: 2 }} />
              <TextField fullWidth label="Stock Count" type="number" value={stockCount} onChange={(e) => setStockCount(e.target.value)} required sx={{ mb: 2 }} />
              <Box display="flex" gap={2} mb={2}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <MenuItem value="Makeup">Makeup</MenuItem>
                    <MenuItem value="Lipstick">Lipstick</MenuItem>
                    <MenuItem value="Skincare">Skincare</MenuItem>
                    <MenuItem value="Eyes">Eyes</MenuItem>
                  </Select>
                </FormControl>
                <TextField fullWidth label="Subcategory" value={subCategory} onChange={(e) => setSubCategory(e.target.value)} required />
              </Box>
              <TextField fullWidth multiline rows={3} label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required sx={{ mb: 2 }} />
              <Button type="submit" variant="contained" fullWidth>Publish SKU</Button>
            </form>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}
