import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface Activity {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  duration: number;
}

const ActivitiesPage: React.FC = () => {
  const [activities] = useState<Activity[]>([]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" color="primary">
            Activités
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {/* Implement add activity logic */}}
          >
            Ajouter une activité
          </Button>
        </Grid>
        {activities.map((activity) => (
          <Grid item key={activity.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={activity.imageUrl}
                alt={activity.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {activity.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {activity.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  {activity.price}€
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Durée: {activity.duration} minutes
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => {/* Implement edit logic */}}>
                  Modifier
                </Button>
                <Button size="small" color="error" onClick={() => {/* Implement delete logic */}}>
                  Supprimer
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ActivitiesPage;
