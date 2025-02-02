import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { FormTextField, FormDatePicker, FormSelect } from '../FormFields';

const validationSchema = Yup.object({
  name: Yup.string().required('Le nom est requis'),
  startDate: Yup.date().required('La date de début est requise'),
  endDate: Yup.date()
    .required('La date de fin est requise')
    .min(Yup.ref('startDate'), 'La date de fin doit être après la date de début'),
  weekDays: Yup.array().min(1, 'Sélectionnez au moins un jour'),
  startTime: Yup.string().required('L\'heure de début est requise'),
  endTime: Yup.string()
    .required('L\'heure de fin est requise')
    .test('is-after-start', 'L\'heure de fin doit être après l\'heure de début',
      function(value) {
        const { startTime } = this.parent;
        if (!startTime || !value) return true;
        return value > startTime;
      }),
});

const weekDays = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 0, label: 'Dimanche' },
];

interface OpeningPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  weekDays: number[];
  startTime: string;
  endTime: string;
}

const OpeningHours: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<OpeningPeriod | null>(null);

  // Exemple de données
  const periods: OpeningPeriod[] = [
    {
      id: '1',
      name: 'Haute saison',
      startDate: '2025-07-01',
      endDate: '2025-08-31',
      weekDays: [1, 2, 3, 4, 5, 6],
      startTime: '09:00',
      endTime: '19:00',
    },
    {
      id: '2',
      name: 'Basse saison',
      startDate: '2025-09-01',
      endDate: '2025-10-31',
      weekDays: [3, 4, 5, 6],
      startTime: '10:00',
      endTime: '17:00',
    },
  ];

  const handleOpenDialog = (period?: OpeningPeriod) => {
    setSelectedPeriod(period || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedPeriod(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = (values: any) => {
    console.log('Save period:', values);
    handleCloseDialog();
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Ajouter une période
        </Button>
      </Box>

      <Grid container spacing={3}>
        {periods.map((period) => (
          <Grid item xs={12} md={6} key={period.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">{period.name}</Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(period)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Du {formatDate(period.startDate)} au {formatDate(period.endDate)}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {period.startTime} - {period.endTime}
                </Typography>

                <Box sx={{ mt: 1 }}>
                  {period.weekDays.map((day) => (
                    <Chip
                      key={day}
                      label={weekDays.find(d => d.value === day)?.label}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedPeriod ? 'Modifier la période' : 'Nouvelle période'}
        </DialogTitle>
        <Formik
          initialValues={{
            name: selectedPeriod?.name || '',
            startDate: selectedPeriod?.startDate || '',
            endDate: selectedPeriod?.endDate || '',
            weekDays: selectedPeriod?.weekDays || [],
            startTime: selectedPeriod?.startTime || '',
            endTime: selectedPeriod?.endTime || '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormTextField
                    name="name"
                    label="Nom de la période"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormDatePicker
                    name="startDate"
                    label="Date de début"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormDatePicker
                    name="endDate"
                    label="Date de fin"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormSelect
                    name="weekDays"
                    label="Jours d'ouverture"
                    options={weekDays}
                    multiple
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormTextField
                    name="startTime"
                    label="Heure d'ouverture"
                    type="time"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormTextField
                    name="endTime"
                    label="Heure de fermeture"
                    type="time"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Annuler</Button>
              <Button type="submit" variant="contained">
                Enregistrer
              </Button>
            </DialogActions>
          </Form>
        </Formik>
      </Dialog>
    </Box>
  );
};

export default OpeningHours;
