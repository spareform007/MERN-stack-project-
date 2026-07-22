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
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  CircularProgress
} from '@mui/material';
import API from '../../services/api';

export default function AdminUsersPage() {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    API.get('/admin/users')
      .then(({ data }) => {
        setUsersList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Role change failed.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/admin/users/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'User deletion failed.');
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
        <Box mb={4}>
          <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37', fontWeight: 700 }}>
            User Directory & Access Control
          </Typography>
          <Typography variant="body2" sx={{ color: '#AAA' }}>Manage platform accounts, roles (`customer`, `expert`, `admin`), and account status.</Typography>
        </Box>

        <TableContainer sx={{ border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 2 }}>
          <Table sx={{ bgcolor: '#141414' }}>
            <TableHead sx={{ bgcolor: '#1C1C1C' }}>
              <TableRow>
                <TableCell sx={{ color: '#D4AF37' }}>User ID</TableCell>
                <TableCell sx={{ color: '#D4AF37' }}>Name & Email</TableCell>
                <TableCell sx={{ color: '#D4AF37' }}>Account Role</TableCell>
                <TableCell sx={{ color: '#D4AF37' }}>Points</TableCell>
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
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      sx={{ color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)' }}
                    >
                      <MenuItem value="customer">Customer</MenuItem>
                      <MenuItem value="expert">Certified Beauty Expert</MenuItem>
                      <MenuItem value="admin">Executive Admin</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>{u.points || 0} pts</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" onClick={() => setDeleteTarget(u)} sx={{ color: '#FF8A8A', borderColor: '#FF8A8A', fontSize: '0.7rem' }}>
                      Delete Account
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Delete User Modal */}
        <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
          <DialogContent sx={{ bgcolor: '#141414', color: '#FFF', textAlign: 'center', p: 4 }}>
            <Typography variant="h5" sx={{ color: '#FF8A8A', fontWeight: 700, mb: 2 }}>
              Confirm Account Removal
            </Typography>
            <Typography variant="body2" sx={{ color: '#CCC', mb: 3 }}>
              Are you sure you want to permanently remove user <strong>{deleteTarget?.name}</strong> ({deleteTarget?.email}) from the database?
            </Typography>
            <Box display="flex" gap={2}>
              <Button fullWidth onClick={() => setDeleteTarget(null)} sx={{ color: '#FFF' }}>Cancel</Button>
              <Button fullWidth variant="contained" color="error" onClick={handleConfirmDelete}>
                Permanent Delete
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}
