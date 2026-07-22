import { createTheme } from '@mui/material/styles';

const luxuryTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D4AF37', // Gold
      light: '#E8C76A',
      dark: '#AA771C',
      contrastText: '#0D0D0D'
    },
    secondary: {
      main: '#FFFFFF',
      contrastText: '#0D0D0D'
    },
    background: {
      default: '#0D0D0D',
      paper: '#181818'
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3'
    },
    divider: 'rgba(212, 175, 55, 0.2)'
  },
  typography: {
    fontFamily: ['Poppins', 'Montserrat', 'sans-serif'].join(','),
    h1: { fontFamily: 'Playfair Display, serif', fontWeight: 700 },
    h2: { fontFamily: 'Playfair Display, serif', fontWeight: 700 },
    h3: { fontFamily: 'Playfair Display, serif', fontWeight: 600 },
    h4: { fontFamily: 'Playfair Display, serif', fontWeight: 600 },
    h5: { fontFamily: 'Playfair Display, serif', fontWeight: 500 },
    h6: { fontFamily: 'Playfair Display, serif', fontWeight: 500 }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          fontWeight: 600,
          padding: '10px 24px',
          transition: 'all 0.3s ease'
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #D4AF37 0%, #E8C76A 50%, #AA771C 100%)',
          color: '#0D0D0D',
          '&:hover': {
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
            background: 'linear-gradient(135deg, #E8C76A 0%, #FFF2B2 50%, #D4AF37 100%)'
          }
        },
        outlinedPrimary: {
          borderColor: '#D4AF37',
          color: '#D4AF37',
          '&:hover': {
            borderColor: '#E8C76A',
            backgroundColor: 'rgba(212, 175, 55, 0.08)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#141414',
          border: '1px solid rgba(212, 175, 55, 0.18)',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#141414',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          backgroundImage: 'none'
        }
      }
    }
  }
});

export default luxuryTheme;
