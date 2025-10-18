import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import InvoiceForm from './components/InvoiceForm';
import LetterForm from './components/LetterForm';

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
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            FR Cosmetics Ltd.
          </Typography>
          <Typography variant="h5" component="h2" color="text.secondary">
            Document Generator
          </Typography>
        </Box>

        {/* Navigation Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label="Invoice Generator" />
            <Tab label="Letter Generator" />
          </Tabs>
        </Box>

        {/* Content based on active tab */}
        {activeTab === 0 && <InvoiceForm />}
        {activeTab === 1 && <LetterForm />}
      </Container>
    </ThemeProvider>
  );
}

export default App;