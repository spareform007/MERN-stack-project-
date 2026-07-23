import React, { useContext } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Lock } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [], navigate, onOpenAuth }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Box textAlign="center" py={10} sx={{ color: '#D4AF37' }}>Authorizing Privileges...</Box>;
  }

  if (!user) {
    return (
      <Box sx={{ bgcolor: '#0D0D0D', color: '#FFF', py: 12 }}>
        <Paper sx={{ p: 6, maxWidth: 500, mx: 'auto', textAlign: 'center', bgcolor: '#141414', border: '1px solid #D4AF37', borderRadius: 3 }}>
          <Lock sx={{ fontSize: 60, color: '#D4AF37', mb: 2 }} />
          <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37', mb: 1 }}>
            Authentication Required
          </Typography>
          <Typography variant="body2" sx={{ color: '#AAA', mb: 3 }}>
            Please sign in to access this private area of MAE' BEAUTY.
          </Typography>
          <Button variant="contained" fullWidth onClick={onOpenAuth} sx={{ py: 1.5 }}>
            Sign In / Register
          </Button>
        </Paper>
      </Box>
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <Box sx={{ bgcolor: '#0D0D0D', color: '#FFF', py: 12 }}>
        <Paper sx={{ p: 6, maxWidth: 500, mx: 'auto', textAlign: 'center', bgcolor: '#141414', border: '1px solid #FF8A8A', borderRadius: 3 }}>
          <Lock sx={{ fontSize: 60, color: '#FF8A8A', mb: 2 }} />
          <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', color: '#FF8A8A', mb: 1 }}>
            Access Restricted
          </Typography>
          <Typography variant="body2" sx={{ color: '#AAA', mb: 3 }}>
            Your account role (<strong>{user.role}</strong>) does not have authorization to view this page. Restricted to: [{allowedRoles.join(', ')}].
          </Typography>
          <Button variant="contained" fullWidth onClick={() => navigate('/dashboard')} sx={{ py: 1.5 }}>
            Return to Personal Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  return children;
}
