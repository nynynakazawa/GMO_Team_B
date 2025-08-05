import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2BBBD8', // Turquoise blue from login/signup buttons
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#576062',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f5f5f5', // Light gray background
      paper: '#ffffff' // White for login form, #fafafa for signup form
    },
    text: {
      primary: '#000000',
      secondary: '#666666'
    },
    grey: {
      50: '#fafafa',
      100: '#fafafa', // Signup form background
      200: '#e0e0e0', // Input field borders
      300: '#bdbdbd',
      400: '#576062'
    }
  },
  typography: {
    fontFamily: "'Noto Sans', sans-serif",
    h4: {
      fontSize: '40px',
      fontWeight: 400,
      color: '#000000'
    },
    h6: {
      fontSize: '24px', 
      fontWeight: 400,
      color: '#000000'
    },
    body1: {
      fontSize: '20px',
      fontWeight: 400,
      color: '#000000'
    },
    body2: {
      fontSize: '16px',
      fontWeight: 400
    }
  },
  shape: {
    borderRadius: 10
  },
  shadows: [
    'none',
    '0px 4px 4px rgba(0, 0, 0, 0.25)', // Card shadow
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '0px 4px 4px rgba(0, 0, 0, 0.25)',
    ...Array(20).fill('none')
  ]
});

export default theme;