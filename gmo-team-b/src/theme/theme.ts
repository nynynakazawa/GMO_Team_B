import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#19b8d7',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#576062',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    },
    text: {
      primary: '#000000',
      secondary: '#576062'
    },
    grey: {
      300: '#d9d9d9',
      400: '#576062'
    }
  },
  typography: {
    fontFamily: '"Iceland", "Noto Sans", sans-serif',
    h6: {
      fontSize: '24px',
      fontWeight: 400,
      fontFamily: 'Iceland'
    },
    body1: {
      fontSize: '14px',
      fontWeight: 400,
      fontFamily: '"Noto Sans", sans-serif'
    },
    body2: {
      fontSize: '18px',
      fontWeight: 400,
      fontFamily: 'Iceland'
    }
  },
  shape: {
    borderRadius: 10
  }
});

export default theme;