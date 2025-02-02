import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import BookingCalendar from '../components/Calendar/BookingCalendar';

interface Booking {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const BookingsPage: React.FC = () => {
  const [bookings] = useState<Booking[]>([]);

  const handleEventClick = (bookingId: string) => {
    console.log('Booking clicked:', bookingId);
  };

  const handleDateSelect = (start: Date, end: Date) => {
    console.log('Date range selected:', { start, end });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" color="primary">
            Réservations
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {/* Implement add booking logic */}}
          >
            Nouvelle réservation
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }}>
            <Box sx={{ flexGrow: 1 }}>
              <BookingCalendar
                events={bookings.map(booking => ({
                  id: booking.id,
                  title: booking.title,
                  start: booking.start,
                  end: booking.end,
                  color: booking.status === 'confirmed' ? '#4caf50' : 
                         booking.status === 'cancelled' ? '#f44336' : '#ff9800'
                }))}
                onEventClick={handleEventClick}
                onDateSelect={handleDateSelect}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookingsPage;
