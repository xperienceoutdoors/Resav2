import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BookingDetailsProps {
  open: boolean;
  onClose: () => void;
  booking: any;
  onEdit?: () => void;
  onCancel?: () => void;
}

const statusColors: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
  pending: "warning",
  confirmed: "success",
  cancelled: "error",
  completed: "info"
};

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  cancelled: "Annulé",
  completed: "Terminé"
};

const BookingDetails: React.FC<BookingDetailsProps> = ({
  open,
  onClose,
  booking,
  onEdit,
  onCancel,
}) => {
  if (!booking) return null;

  const formatDate = (date: string) => {
    return format(new Date(date), 'PPP', { locale: fr });
  };

  const formatTime = (time: string) => {
    return format(new Date(`2000-01-01T${time}`), 'HH:mm');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Réservation #{booking.bookingNumber}
        <Box sx={{ mt: 1 }}>
          <Chip
            label={statusLabels[booking.status]}
            color={statusColors[booking.status]}
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Activité
            </Typography>
            <Typography variant="body1" gutterBottom>
              {booking.activity}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Date et heure
            </Typography>
            <Typography variant="body1" gutterBottom>
              {formatDate(booking.date)} à {formatTime(booking.startTime)}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Nombre de participants
            </Typography>
            <Typography variant="body1" gutterBottom>
              {booking.participants} personne(s)
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Client
            </Typography>
            <Typography variant="body1" gutterBottom>
              {booking.customerInfo.name}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Contact
            </Typography>
            <Typography variant="body1" gutterBottom>
              {booking.customerInfo.email}
              <br />
              {booking.customerInfo.phone}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Montant total
            </Typography>
            <Typography variant="body1" gutterBottom>
              {booking.totalPrice}€
            </Typography>
          </Grid>

          {booking.notes && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Notes
              </Typography>
              <Typography variant="body1" gutterBottom>
                {booking.notes}
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        {booking.status !== 'cancelled' && onCancel && (
          <Button onClick={onCancel} color="error">
            Annuler la réservation
          </Button>
        )}
        {booking.status !== 'cancelled' && onEdit && (
          <Button onClick={onEdit} color="primary">
            Modifier
          </Button>
        )}
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDetails;
