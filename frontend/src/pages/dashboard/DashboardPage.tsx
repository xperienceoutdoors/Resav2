import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import Statistics from '../../components/Dashboard/Statistics';

const DashboardPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h1" variant="h4" color="primary" gutterBottom>
              Tableau de bord
            </Typography>
            <Statistics />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
