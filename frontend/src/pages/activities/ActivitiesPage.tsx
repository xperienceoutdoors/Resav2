import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import DataTable from '../../components/DataTable';
import { FormTextField, FormSelect } from '../../components/FormFields';
import { activitiesApi } from '../../services/activities';

const validationSchema = Yup.object({
  name: Yup.string().required('Le nom est requis'),
  description: Yup.string().required('La description est requise'),
  categoryId: Yup.string().required('La catégorie est requise'),
});

const ActivitiesPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const { data: activities = [] } = activitiesApi.useGetActivitiesQuery();
  const [createActivity] = activitiesApi.useCreateActivityMutation();
  const [updateActivity] = activitiesApi.useUpdateActivityMutation();
  const [deleteActivity] = activitiesApi.useDeleteActivityMutation();

  const handleOpenDialog = (id?: string) => {
    setSelectedActivity(id || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedActivity(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (selectedActivity) {
        await updateActivity({ id: selectedActivity, body: values }).unwrap();
      } else {
        await createActivity(values).unwrap();
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save activity:', error);
    }
  };

  const columns = [
    { id: 'name', label: 'Nom', minWidth: 170 },
    { id: 'description', label: 'Description', minWidth: 200 },
    {
      id: 'status',
      label: 'Statut',
      minWidth: 100,
      format: (value: string) =>
        value === 'online' ? 'En ligne' : 'Hors ligne',
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Activités</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nouvelle activité
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={activities}
        onEdit={(id) => handleOpenDialog(id)}
        onDelete={(id) => deleteActivity(id)}
      />

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedActivity ? 'Modifier l\'activité' : 'Nouvelle activité'}
        </DialogTitle>
        <Formik
          initialValues={{
            name: '',
            description: '',
            categoryId: '',
            status: 'offline',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <DialogContent>
              <FormTextField
                name="name"
                label="Nom de l'activité"
                fullWidth
              />
              <FormTextField
                name="description"
                label="Description"
                multiline
                rows={4}
                fullWidth
              />
              <FormSelect
                name="categoryId"
                label="Catégorie"
                options={[
                  { value: '1', label: 'Sports Nautiques' },
                  { value: '2', label: 'Aventure' },
                ]}
              />
              <FormSelect
                name="status"
                label="Statut"
                options={[
                  { value: 'online', label: 'En ligne' },
                  { value: 'offline', label: 'Hors ligne' },
                ]}
              />
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

export default ActivitiesPage;
