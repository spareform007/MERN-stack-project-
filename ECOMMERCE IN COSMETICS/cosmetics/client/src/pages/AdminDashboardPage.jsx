import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Tabs,
  Tab,
  Switch
} from '@mui/material';
import {
  Add,
  Delete,
  Visibility,
  VisibilityOff,
  Inventory,
  ShoppingBag,
  People,
  AttachMoney,
  TrendingUp,
  Calculate,
  Assessment
} from '@mui/icons-material';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboardPage({ navigate }) {
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState('All');

  // New product dialog
  const [openNewProdDialog, setOpenNewProdDialog] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodTagline, setProdTagline] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('Makeup');
  const [prodSubCategory, setProdSubCategory] = useState('Foundation');
  const [prodDescription, setProdDescription] = useState('');
  const [prodHeroImage, setProdHeroImage] = useState('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800');

  // Deletion Modal state
  const [deleteUserTarget, setDeleteUserTarget] = useState(null);

  const fetchAdminData = () => {
    setLoading(true);
    Promise.all([
      API.get('/admin/stats'),
      API.get('/products'),
      API.get('/orders'),
      API.get('/admin/users')
    ])
      .then(([statsRes, prodRes, ordRes, usersRes]) => {
        setStats(statsRes.data);
        setProducts(prodRes.data);
        setOrders(ordRes.data);
        setUsersList(usersRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await API.post('/products', {
        name: prodName,
        tagline: prodTagline,
        price: Number(prodPrice),
        category: prodCategory,
        subCategory: prodSubCategory,
        description: prodDescription,
        heroImage: prodHeroImage,
        images: [prodHeroImage],
        shades: [{ shadeName: 'Universal Rose Gold', colorHex: '#D4AF37' }]
      });
      setOpenNewProdDialog(false);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create product.');
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (window.confirm('Delete product permanently from luxury database?')) {
      try {
        await API.delete(`/products/${prodId}`);
        fetchAdminData();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed.');
      }
    }
  };

  const handleToggleVisibility = async (prod) => {
    try {
      await API.put(`/products/${prod._id}`, { isVisible: !prod.isVisible });
      fetchAdminData();
    } catch (err) {
      alert('Toggle failed.');
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchAdminData();
    } catch (err) {
      alert('Role update failed.');
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (!deleteUserTarget) return;
    try {
      await API.delete(`/admin/users/${deleteUserTarget._id}`);
      setDeleteUserTarget(null);
      fetchAdminData();
    } catch (err) {
      alert('User deletion failed.');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchAdminData();
    } catch (err) {
      alert('Status update failed.');
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'expert')) {
    return (
      <Box textAlign="center" py={12} sx={{ bgcolor: '#0D0D0D', color: '#FFF' }}>
        <Typography variant="h5">Access Restricted: Executive Admin Role Required</Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>Home</Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box textAlign="center" py={12} sx={{ bgcolor: '#0D0D0D' }}>
        <CircularProgress sx={{ color: '#D4AF37' }} />
      </Box>
    );
  }

  const filteredOrders = orders.filter((o) => orderFilter === 'All' || o.status === orderFilter);

  return (
    <Box sx={{ bgcolor: '#0D0D0D', color: '#FFF', py: 6, minHeight: '85vh' }}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37', fontWeight: 700 }}>
              Executive Admin Workspace
            </Typography>
            <Typography variant="body2" sx={{ color: '#AAA' }}>MAE' BEAUTY Global Sales, User Access Control & Catalog Portal</Typography>
          </Box>

          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenNewProdDialog(true)}>
            Add New Product
          </Button>
        </Box>

        {/* 5 Growth Analytics Cards */}
        <Grid container spacing={3} mb={6}>
          <Grid item xs={12} sm={2.4}>
            <Paper sx={{ p: 2.5, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ color: '#AAA' }}>Total Revenue</Typography>
              <Typography variant="h5" sx={{ color: '#D4AF37', fontWeight: 700, my: 0.5 }}>${stats?.totalRevenue}</Typography>
              <Typography variant="caption" sx={{ color: '#00E676', display: 'flex', alignItems: 'center' }}>
                <TrendingUp fontSize="small" sx={{ mr: 0.5 }} /> +{stats?.monthlyGrowth}% M-o-M
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={2.4}>
            <Paper sx={{ p: 2.5, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ color: '#AAA' }}>Avg Order Value (AOV)</Typography>
              <Typography variant="h5" sx={{ color: '#FFF', fontWeight: 700, my: 0.5 }}>${stats?.aov}</Typography>
              <Typography variant="caption" sx={{ color: '#E8C76A' }}>Per Client Checkout</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={2.4}>
            <Paper sx={{ p: 2.5, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ color: '#AAA' }}>Conversion Rate</Typography>
              <Typography variant="h5" sx={{ color: '#FFF', fontWeight: 700, my: 0.5 }}>{stats?.conversionRate}%</Typography>
              <Typography variant="caption" sx={{ color: '#00E676' }}>High VIP Benchmark</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={2.4}>
            <Paper sx={{ p: 2.5, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ color: '#AAA' }}>Total Orders</Typography>
              <Typography variant="h5" sx={{ color: '#FFF', fontWeight: 700, my: 0.5 }}>{stats?.totalOrders}</Typography>
              <Typography variant="caption" sx={{ color: '#AAA' }}>Processed Vault</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={2.4}>
            <Paper sx={{ p: 2.5, bgcolor: '#141414', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ color: '#AAA' }}>Active VIP Directory</Typography>
              <Typography variant="h5" sx={{ color: '#FFF', fontWeight: 700, my: 0.5 }}>{stats?.totalUsers}</Typography>
              <Typography variant="caption" sx={{ color: '#D4AF37' }}>Registered Clients</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Workspace Section Tabs */}
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          sx={{ mb: 4, '& .MuiTabs-indicator': { backgroundColor: '#D4AF37' }, '& .MuiTab-root': { color: '#888', fontWeight: 600, '&.Mui-selected': { color: '#D4AF37' } } }}
        >
          <Tab icon={<Inventory />} iconPosition="start" label={`Catalog Control (${products.length})`} />
          <Tab icon={<People />} iconPosition="start" label={`User Directory & Access Control (${usersList.length})`} />
          <Tab icon={<ShoppingBag />} iconPosition="start" label={`Order Fulfillment Desk (${orders.length})`} />
        </Tabs>

        {/* Tab 0: Inventory Control */}
        {activeTab === 0 && (
          <TableContainer sx={{ border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: 2 }}>
            <Table sx={{ bgcolor: '#141414' }}>
              <TableHead sx={{ bgcolor: '#1C1C1C' }}>
                <TableRow>
                  <TableCell sx={{ color: '#D4AF37' }}>Product Name</TableCell>
                  <TableCell sx={{ color: '#D4AF37' }}>Category / Subcategory</TableCell>
                  <TableCell sx={{ color: '#D4AF37' }}>Price</TableCell>
                  <TableCell sx={{ color: '#D4AF37' }}>Stock</TableCell>
                  <TableCell sx={{ color: '#D4AF37' }}>Visibility</TableCell>
                  <TableCell sx={{ color: '#D4AF37' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((prod) => (
                  <TableRow key={prod._id}>
                    <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>{prod.name}</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>{prod.category} • {prod.subCategory}</TableCell>
                    <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>${prod.price}</TableCell>
                    <TableCell sx={{ color: '#FFF' }}>{prod.stock || 50} units</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleToggleVisibility(prod)} sx={{ color: prod.isVisible ? '#00E676' : '#FF8A8A' }}>
                        {prod.isVisible ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
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
        )}

        {/* Tab 1: User Access Control Table */}
        {activeTab === 1 && (
          <TableContainer sx={{ border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: 2 }}>
            <Table sx={{ bgcolor: '#141414' }}>
              <TableHead sx={{ bgcolor: '#1C1C1C' }}>
                <TableRow>
                  <TableCell sx={{ color: '#D4AF37' }}>User ID</TableCell>
                  <TableCell sx={{ color: '#D4AF37' }}>Client Name & Email</TableCell>
                  <TableCell sx={{ color: '#D4AF37' }}>Role</TableCell>
                  <TableCell sx={{ color: '#D4AF37' }}>Loyalty Points</TableCell>
                  <TableCell sx={{ color: '#D4AF37' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersList.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell sx={{ color: '#AAA', fontFamily: 'monospace', fontSize: '0.75rem' }}>{u._id}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 600 }}>{u.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#AAA' }}>{u.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={u.role}
                        onChange={(e) => handleUserRoleChange(u._id, e.target.value)}
                        sx={{ color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)' }}
                      >
                        <MenuItem value="customer">Client (Customer)</MenuItem>
                        <MenuItem value="expert">Beauty Expert</MenuItem>
                        <MenuItem value="admin">Executive Admin</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>{u.loyaltyPoints || 0} pts ({u.loyaltyTier || 'Gold'})</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" onClick={() => setDeleteUserTarget(u)} sx={{ color: '#FF8A8A', borderColor: '#FF8A8A', fontSize: '0.7rem' }}>
                        Delete User ID
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Tab 2: Order Fulfillment Desk */}
        {activeTab === 2 && (
          <Box>
            <Box display="flex" gap={1} mb={3}>
              {['All', 'Order Placed', 'Processing', 'Shipped', 'Delivered'].map((st) => (
                <Chip
                  key={st}
                  label={st}
                  onClick={() => setOrderFilter(st)}
                  sx={{
                    bgcolor: orderFilter === st ? '#D4AF37' : 'rgba(255,255,255,0.05)',
                    color: orderFilter === st ? '#0D0D0D' : '#FFF',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                />
              ))}
            </Box>

            <TableContainer sx={{ border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: 2 }}>
              <Table sx={{ bgcolor: '#141414' }}>
                <TableHead sx={{ bgcolor: '#1C1C1C' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#D4AF37' }}>Tracking ID</TableCell>
                    <TableCell sx={{ color: '#D4AF37' }}>Client</TableCell>
                    <TableCell sx={{ color: '#D4AF37' }}>Total Value</TableCell>
                    <TableCell sx={{ color: '#D4AF37' }}>Status</TableCell>
                    <TableCell sx={{ color: '#D4AF37' }}>Update Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((ord) => (
                    <TableRow key={ord._id}>
                      <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>{ord.trackingNumber}</TableCell>
                      <TableCell sx={{ color: '#FFF' }}>{ord.user?.name || 'Guest Client'}</TableCell>
                      <TableCell sx={{ color: '#FFF', fontWeight: 700 }}>${ord.totalPrice}</TableCell>
                      <TableCell>
                        <Chip label={ord.status} size="small" sx={{ bgcolor: ord.status === 'Delivered' ? '#2e7d32' : '#D4AF37', color: '#FFF' }} />
                      </TableCell>
                      <TableCell>
                        <Select
                          size="small"
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                          sx={{ color: '#FFF', border: '1px solid rgba(212, 175, 55, 0.3)' }}
                        >
                          <MenuItem value="Order Placed">Order Placed</MenuItem>
                          <MenuItem value="Processing">Processing Vault</MenuItem>
                          <MenuItem value="Shipped">Shipped Express</MenuItem>
                          <MenuItem value="Delivered">Delivered</MenuItem>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Delete User Modal */}
        <Dialog open={Boolean(deleteUserTarget)} onClose={() => setDeleteUserTarget(null)} maxWidth="xs" fullWidth>
          <DialogContent sx={{ bgcolor: '#141414', color: '#FFF', textAlign: 'center', p: 4 }}>
            <Typography variant="h5" sx={{ color: '#FF8A8A', fontWeight: 700, mb: 2 }}>
              Confirm Account Removal
            </Typography>
            <Typography variant="body2" sx={{ color: '#CCC', mb: 3 }}>
              Are you sure you want to permanently remove user <strong>{deleteUserTarget?.name}</strong> ({deleteUserTarget?.email}) from the database?
            </Typography>
            <Box display="flex" gap={2}>
              <Button fullWidth onClick={() => setDeleteUserTarget(null)} sx={{ color: '#FFF' }}>Cancel</Button>
              <Button fullWidth variant="contained" color="error" onClick={handleConfirmDeleteUser}>
                Permanent Delete
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Add Product Dialog */}
        <Dialog open={openNewProdDialog} onClose={() => setOpenNewProdDialog(false)} maxWidth="sm" fullWidth>
          <DialogContent sx={{ bgcolor: '#141414', color: '#FFF' }}>
            <Typography variant="h6" sx={{ color: '#D4AF37', mb: 2 }}>Create New Luxury Product</Typography>
            <form onSubmit={handleCreateProduct}>
              <TextField fullWidth label="Product Name" value={prodName} onChange={(e) => setProdName(e.target.value)} required sx={{ mb: 2 }} />
              <TextField fullWidth label="Tagline" value={prodTagline} onChange={(e) => setProdTagline(e.target.value)} sx={{ mb: 2 }} />
              <TextField fullWidth label="Price ($)" type="number" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} required sx={{ mb: 2 }} />
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}>
                      <MenuItem value="Makeup">Makeup</MenuItem>
                      <MenuItem value="Lipstick">Lipstick</MenuItem>
                      <MenuItem value="Skincare">Skincare</MenuItem>
                      <MenuItem value="Eyes">Eyes</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Subcategory" value={prodSubCategory} onChange={(e) => setProdSubCategory(e.target.value)} required />
                </Grid>
              </Grid>
              <TextField fullWidth multiline rows={3} label="Description" value={prodDescription} onChange={(e) => setProdDescription(e.target.value)} required sx={{ mb: 2 }} />
              <Button type="submit" variant="contained" fullWidth>Publish Product</Button>
            </form>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}
