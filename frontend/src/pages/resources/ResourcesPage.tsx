import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { FormTextField, FormSelect } from '../../components/FormFields';

const validationSchema = Yup.object({
  name: Yup.string().required('Le nom est requis'),
  quantity: Yup.number()
    .required('La quantité est requise')
    .min(1, 'La quantité doit être supérieure à 0'),
  maxCapacity: Yup.number()
    .min(1, 'La capacité doit être supérieure à 0'),
  ageMin: Yup.number()
    .min(0, 'L\'âge minimum doit être positif'),
  ageMax: Yup.number()
    .min(0, 'L\'âge maximum doit être positif'),
});

const ResourcesPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);

  // Données de test
  const resources = [
    {
      id: '1',
      name: 'Kayak simple',
      quantity: 10,
      photo: 'https://example.com/kayak.jpg',
      maxCapacity: 1,
      description: 'Kayak pour une personne',
      ageRange: { min: 12, max: null },
    },
    {
      id: '2',
      name: 'Paddle',
      quantity: 8,
      photo: 'https://example.com/paddle.jpg',
      maxCapacity: 1,
      description: 'Planche de stand-up paddle',
      ageRange: { min: 10, max: null },
    },
  ];

  const handleOpenDialog = (resource?: any) => {
    setSelectedResource(resource || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedResource(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = (values: any) => {
    console.log('Save resource:', values);
    handleCloseDialog();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Ressources</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nouvelle ressource
        </Button>
      </Box>

      <Grid container spacing={3}>
        {resources.map((resource) => (
          <Grid item xs={12} sm={6} md={4} key={resource.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={resource.photo}
                alt={resource.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {resource.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantité disponible: {resource.quantity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Capacité max: {resource.maxCapacity} personne(s)
                </Typography>
                {resource.ageRange.min && (
                  <Typography variant="body2" color="text.secondary">
                    Âge minimum: {resource.ageRange.min} ans
                  </Typography>
                )}
                <Typography variant="body2">
                  {resource.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Tooltip title="Modifier">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(resource)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Supprimer">
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
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
          {selectedResource ? 'Modifier la ressource' : 'Nouvelle ressource'}
        </DialogTitle>
        <Formik
          initialValues={{
            name: selectedResource?.name || '',
            quantity: selectedResource?.quantity || 1,
            maxCapacity: selectedResource?.maxCapacity || 1,
            description: selectedResource?.description || '',
            ageMin: selectedResource?.ageRange?.min || '',
            ageMax: selectedResource?.ageRange?.max || '',
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
                    label="Nom de la ressource"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormTextField
                    name="quantity"
                    label="Quantité"
                    type="number"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormTextField
                    name="maxCapacity"
                    label="Capacité maximale"
                    type="number"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormTextField
                    name="ageMin"
                    label="Âge minimum"
                    type="number"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormTextField
                    name="ageMax"
                    label="Âge maximum"
                    type="number"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormTextField
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                    fullWidth
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

export default ResourcesPage;
