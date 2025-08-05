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
    h1: {
      fontSize: '40px',
      fontWeight: 400,
      fontFamily: '"Noto Sans", sans-serif'
    },
    h2: {
      fontSize: '36px',
      fontWeight: 400,
      fontFamily: 'Iceland',
      color: '#19b8d7',
      WebkitTextStroke: '1px #000000'
    },
    h6: {
      fontSize: '24px',
      fontWeight: 400,
      fontFamily: 'Iceland',
      color: '#19b8d7',
      WebkitTextStroke: '1px #000000'
    },
    body1: {
      fontSize: '24px',
      fontWeight: 400,
      fontFamily: '"Noto Sans", sans-serif'
    },
    body2: {
      fontSize: '16px',
      fontWeight: 400,
      fontFamily: '"Noto Sans", sans-serif'
    },
    button: {
      fontSize: '32px',
      fontWeight: 400,
      fontFamily: '"Noto Sans", sans-serif',
      textTransform: 'none'
    }
  },
  shape: {
    borderRadius: 10
  },
  shadows: [
    'none',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)'
  ]
});

export default theme;