import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Box } from '@mui/material';
import InvoiceForm from './components/InvoiceForm';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(26, 68, 160)',
    },
    secondary: {
      main: '#3498db',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            FR Cosmetics Ltd.
          </Typography>
          <Typography variant="h5" component="h2" color="text.secondary">
            Professional Invoice Generator
          </Typography>
        </Box>
        <InvoiceForm />
      </Container>
    </ThemeProvider>
  );
}

export default App;