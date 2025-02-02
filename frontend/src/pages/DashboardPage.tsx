import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  CardHeader,
} from '@mui/material';
import {
  Event as EventIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const DashboardPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>

      <Grid container spacing={3}>
        {/* Réservations du jour */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardHeader
              action={
                <IconButton>
                  <RefreshIcon />
                </IconButton>
              }
              title="Réservations du jour"
            />
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <EventIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h4">12</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Clients actifs */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardHeader
              action={
                <IconButton>
                  <RefreshIcon />
                </IconButton>
              }
              title="Clients actifs"
            />
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <PeopleIcon sx={{ fontSize: 40, color: 'success.main' }} />
                <Typography variant="h4">45</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenus du mois */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardHeader
              action={
                <IconButton>
                  <RefreshIcon />
                </IconButton>
              }
              title="Revenus du mois"
            />
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <MoneyIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                <Typography variant="h4">2.5k€</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Activités disponibles */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardHeader
              action={
                <IconButton>
                  <RefreshIcon />
                </IconButton>
              }
              title="Activités disponibles"
            />
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <EventIcon sx={{ fontSize: 40, color: 'info.main' }} />
                <Typography variant="h4">8</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Graphiques et statistiques */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Réservations des 30 derniers jours" />
            <CardContent>
              {/* Ajouter un graphique ici */}
              <Box sx={{ height: 300 }}>
                <Typography color="text.secondary">
                  Graphique à implémenter
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Activités populaires */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Activités populaires" />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                1. Kayak - 45 réservations
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2. Paddle - 32 réservations
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3. Plongée - 28 réservations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
