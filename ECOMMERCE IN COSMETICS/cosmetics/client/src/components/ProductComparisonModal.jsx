import React, { useContext } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Rating
} from '@mui/material';
import { Close, Delete, ShoppingBag } from '@mui/icons-material';
import { CompareContext } from '../context/CompareContext';
import { CartContext } from '../context/CartContext';

export default function ProductComparisonModal({ open, onClose }) {
  const { compareList, removeFromCompare, clearCompare } = useContext(CompareContext);
  const { addToCart } = useContext(CartContext);

  if (!compareList || compareList.length === 0) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogContent sx={{ p: 4, bgcolor: '#141414', color: '#FFF' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#D4AF37' }}>
            Side-by-Side Luxury Comparison Matrix
          </Typography>
          <Box display="flex" gap={1}>
            <Button size="small" onClick={clearCompare} sx={{ color: '#FF8A8A' }}>Clear All</Button>
            <IconButton onClick={onClose} sx={{ color: '#FFF' }}><Close /></IconButton>
          </Box>
        </Box>

        <TableContainer sx={{ border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 2 }}>
          <Table sx={{ minWidth: 650, bgcolor: '#0D0D0D' }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#1C1C1C' }}>
                <TableCell sx={{ color: '#D4AF37', fontWeight: 700, width: '20%' }}>Attribute</TableCell>
                {compareList.map((prod) => (
                  <TableCell key={prod._id} sx={{ color: '#FFF', width: `${80 / compareList.length}%`, textAlign: 'center' }}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <IconButton size="small" onClick={() => removeFromCompare(prod._id)} sx={{ color: '#888', alignSelf: 'flex-end' }}>
                        <Delete fontSize="small" />
                      </IconButton>
                      <Box component="img" src={prod.heroImage || prod.images?.[0]} alt={prod.name} sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 2, mb: 1 }} />
                      <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 600 }}>{prod.name}</Typography>
                      <Typography variant="subtitle1" sx={{ color: '#D4AF37', fontWeight: 700 }}>${prod.price}</Typography>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell sx={{ color: '#AAA', fontWeight: 600 }}>Finish & Coverage</TableCell>
                {compareList.map((prod) => (
                  <TableCell key={prod._id} align="center" sx={{ color: '#FFF' }}>
                    <Chip label={`${prod.finish || 'N/A'} Finish`} size="small" sx={{ bgcolor: '#D4AF37', color: '#0D0D0D', fontWeight: 700, mr: 0.5 }} />
                    <Chip label={`${prod.coverage || 'Buildable'}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#FFF' }} />
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell sx={{ color: '#AAA', fontWeight: 600 }}>Rating</TableCell>
                {compareList.map((prod) => (
                  <TableCell key={prod._id} align="center">
                    <Rating value={Number(prod.rating) || 4.8} precision={0.1} readOnly size="small" sx={{ color: '#D4AF37' }} />
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell sx={{ color: '#AAA', fontWeight: 600 }}>Key Active Ingredients</TableCell>
                {compareList.map((prod) => (
                  <TableCell key={prod._id} align="center" sx={{ color: '#FFF' }}>
                    {prod.keyIngredients?.length > 0 ? (
                      prod.keyIngredients.map((ing, i) => (
                        <Typography key={i} variant="caption" display="block" sx={{ color: '#E8C76A' }}>
                          • {ing.name} ({ing.purpose})
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="caption" sx={{ color: '#E8C76A' }}>• 24K Gold Peptides</Typography>
                    )}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell sx={{ color: '#AAA', fontWeight: 600 }}>Allergy & Clean Safety</TableCell>
                {compareList.map((prod) => (
                  <TableCell key={prod._id} align="center">
                    {prod.cleanBeauty && <Chip label="EWG Clean" size="small" sx={{ bgcolor: '#2e7d32', color: '#FFF', mr: 0.5 }} />}
                    {prod.vegan && <Chip label="100% Vegan" size="small" sx={{ bgcolor: '#0288d1', color: '#FFF' }} />}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell sx={{ color: '#AAA', fontWeight: 600 }}>Action</TableCell>
                {compareList.map((prod) => (
                  <TableCell key={prod._id} align="center">
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<ShoppingBag />}
                      onClick={() => {
                        addToCart(prod);
                        onClose();
                      }}
                    >
                      Add To Bag
                    </Button>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}
