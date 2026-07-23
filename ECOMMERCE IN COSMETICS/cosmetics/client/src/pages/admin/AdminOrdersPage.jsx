import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import API from '../../services/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchOrders = () => {
    setLoading(true);
    API.get('/orders')
      .then(({ data }) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed.');
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={12} sx={{ bgcolor: '#0D0D0D' }}>
        <CircularProgress sx={{ color: '#D4AF37' }} />
      </Box>
    );
  }

  const filteredOrders = orders.filter((o) => statusFilter === 'All' || o.status === statusFilter);

  return (
    <Box sx={{ bgcolor: '#0D0D0D', color: '#FFF', py: 6, minHeight: '85vh' }}>
      <Container maxWidth="lg">
        <Box mb={4}>
          <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37', fontWeight: 700 }}>
            Order Fulfillment Management
          </Typography>
          <Typography variant="body2" sx={{ color: '#AAA' }}>Filter orders by status (`Pending`, `Processing`, `Shipped`, `Delivered`) and update `trackingId`.</Typography>
        </Box>

        <Box display="flex" gap={1} mb={3}>
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((st) => (
            <Chip
              key={st}
              label={st}
              onClick={() => setStatusFilter(st)}
              sx={{
                bgcolor: statusFilter === st ? '#D4AF37' : 'rgba(255,255,255,0.05)',
                color: statusFilter === st ? '#0D0D0D' : '#FFF',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            />
          ))}
        </Box>

        <TableContainer sx={{ border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 2 }}>
          <Table sx={{ bgcolor: '#141414' }}>
            <TableHead sx={{ bgcolor: '#1C1C1C' }}>
              <TableRow>
                <TableCell sx={{ color: '#D4AF37' }}>Tracking ID</TableCell>
                <TableCell sx={{ color: '#D4AF37' }}>Client Name</TableCell>
                <TableCell sx={{ color: '#D4AF37' }}>Items Count</TableCell>
                <TableCell sx={{ color: '#D4AF37' }}>Total Amount</TableCell>
                <TableCell sx={{ color: '#D4AF37' }}>Fulfillment Status</TableCell>
                <TableCell sx={{ color: '#D4AF37' }}>Update Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((ord) => (
                <TableRow key={ord._id}>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700, fontFamily: 'monospace' }}>{ord.trackingId || ord.trackingNumber || ord._id.slice(-8)}</TableCell>
                  <TableCell sx={{ color: '#FFF' }}>{ord.user?.name || 'Guest Client'}</TableCell>
                  <TableCell sx={{ color: '#AAA' }}>{ord.orderItems?.length || 1} items</TableCell>
                  <TableCell sx={{ color: '#FFF', fontWeight: 700 }}>${ord.totalAmount || ord.totalPrice}</TableCell>
                  <TableCell>
                    <Chip label={ord.status} size="small" sx={{ bgcolor: ord.status === 'Delivered' ? '#2e7d32' : '#D4AF37', color: '#FFF' }} />
                  </TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                      sx={{ color: '#FFF', border: '1px solid rgba(212, 175, 55, 0.3)' }}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Processing">Processing</MenuItem>
                      <MenuItem value="Shipped">Shipped</MenuItem>
                      <MenuItem value="Delivered">Delivered</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}
