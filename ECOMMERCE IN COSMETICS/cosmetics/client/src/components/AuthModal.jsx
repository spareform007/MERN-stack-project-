import React, { useState, useContext } from 'react';
import {
  Dialog,
  DialogContent,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import SparklesIcon from '@mui/icons-material/AutoAwesome';
import { Person, AssignmentInd, SupervisorAccount, CheckCircle } from '@mui/icons-material';

export default function AuthModal({ open, onClose }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tabIndex === 0) {
        await login(email, password);
      } else {
        await register(name, email, password, role);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setTabIndex(0);
    setError('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ p: 4, bgcolor: '#141414', color: '#FFF' }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" sx={{ color: '#D4AF37', fontFamily: 'Playfair Display', letterSpacing: '2px' }}>
            MAE' BEAUTY
          </Typography>
          <Typography variant="caption" sx={{ color: '#AAA', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Luxury In Every Shade
          </Typography>
        </Box>

        {/* 1-Click Demo Login Selector */}
        <Box mb={3} textAlign="center">
          <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 600, display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '1px' }}>
            1-Click Demo Quick Login
          </Typography>
          <Box display="flex" gap={1} justifyContent="center" flexWrap="wrap">
            <Chip
              icon={<Person style={{ color: '#FFF' }} />}
              label="User / Client"
              onClick={() => handleQuickLogin('user@maebeauty.com', 'userpassword123')}
              sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#FFF', cursor: 'pointer', '&:hover': { bgcolor: '#D4AF37', color: '#0D0D0D' } }}
            />
            <Chip
              icon={<AssignmentInd style={{ color: '#E8C76A' }} />}
              label="Faculty / Expert"
              onClick={() => handleQuickLogin('manager@maebeauty.com', 'managerpassword123')}
              sx={{ bgcolor: 'rgba(212, 175, 55, 0.15)', color: '#E8C76A', border: '1px solid rgba(212, 175, 55, 0.3)', cursor: 'pointer', '&:hover': { bgcolor: '#D4AF37', color: '#0D0D0D' } }}
            />
            <Chip
              icon={<SupervisorAccount style={{ color: '#D4AF37' }} />}
              label="Executive Admin"
              onClick={() => handleQuickLogin('admin@maebeauty.com', 'adminpassword123')}
              sx={{ bgcolor: 'rgba(212, 175, 55, 0.25)', color: '#D4AF37', border: '1px solid #D4AF37', cursor: 'pointer', '&:hover': { bgcolor: '#D4AF37', color: '#0D0D0D' } }}
            />
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

        <Tabs
          value={tabIndex}
          onChange={(e, val) => { setTabIndex(val); setError(''); }}
          variant="fullWidth"
          sx={{
            mb: 3,
            '& .MuiTabs-indicator': { backgroundColor: '#D4AF37' },
            '& .MuiTab-root': { color: '#888', fontWeight: 600, '&.Mui-selected': { color: '#D4AF37' } }
          }}
        >
          <Tab label="Sign In" />
          <Tab label="Register Account" />
        </Tabs>

        {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(211, 47, 47, 0.2)', color: '#FF8A8A' }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          {tabIndex === 1 && (
            <Box mb={2}>
              <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 600, display: 'block', mb: 1, textTransform: 'uppercase' }}>
                Select Registration Account Type:
              </Typography>
              <Grid container spacing={1} mb={2}>
                {[
                  { roleCode: 'customer', label: 'User / Client', icon: <Person fontSize="small" /> },
                  { roleCode: 'expert', label: 'Faculty / Expert', icon: <AssignmentInd fontSize="small" /> }
                ].map((item) => {
                  const isSelected = role === item.roleCode;
                  return (
                    <Grid item xs={6} key={item.roleCode}>
                      <Box
                        onClick={() => setRole(item.roleCode)}
                        sx={{
                          p: 1.5,
                          textAlign: 'center',
                          borderRadius: 2,
                          bgcolor: isSelected ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255,255,255,0.05)',
                          border: isSelected ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
                          cursor: 'pointer',
                          color: isSelected ? '#D4AF37' : '#AAA'
                        }}
                      >
                        <Box display="flex" justifyContent="center" mb={0.5}>{item.icon}</Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem', display: 'block' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>

              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                margin="dense"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                sx={{ mb: 1 }}
              />
            </Box>
          )}

          <TextField
            fullWidth
            label="Email Address"
            type="email"
            variant="outlined"
            margin="dense"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="dense"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            startIcon={<SparklesIcon />}
            sx={{ mt: 2, py: 1.5, fontSize: '0.9rem' }}
          >
            {loading ? 'Processing...' : tabIndex === 0 ? 'Access Account' : `Register as ${role === 'expert' ? 'Faculty / Expert' : role === 'admin' ? 'Executive Admin' : 'Client'}`}
          </Button>

          <Box mt={3} textAlign="center">
            <Typography variant="caption" sx={{ color: '#666' }}>
              By continuing, you agree to MAE' BEAUTY Terms of Concierge & Privacy Policy.
            </Typography>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
