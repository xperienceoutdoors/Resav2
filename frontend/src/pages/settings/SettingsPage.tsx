import React, { useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Grid,
  Button,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { FormTextField } from '../../components/FormFields';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const companyValidationSchema = Yup.object({
  name: Yup.string().required('Le nom est requis'),
  email: Yup.string().email('Email invalide').required('L\'email est requis'),
  phone: Yup.string().required('Le téléphone est requis'),
  address: Yup.string().required('L\'adresse est requise'),
});

const SettingsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCompanySubmit = (values: any) => {
    console.log('Save company settings:', values);
  };

  const handleOpeningHoursSubmit = (values: any) => {
    console.log('Save opening hours:', values);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Configuration
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          aria-label="settings tabs"
        >
          <Tab label="Informations de l'établissement" />
          <Tab label="Horaires d'ouverture" />
          <Tab label="Conditions générales" />
        </Tabs>

        {/* Informations de l'établissement */}
        <TabPanel value={tabValue} index={0}>
          <Formik
            initialValues={{
              name: '',
              email: '',
              phone: '',
              address: '',
              website: '',
              description: '',
            }}
            validationSchema={companyValidationSchema}
            onSubmit={handleCompanySubmit}
          >
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormTextField
                    name="name"
                    label="Nom de l'établissement"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormTextField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormTextField
                    name="phone"
                    label="Téléphone"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormTextField
                    name="address"
                    label="Adresse"
                    multiline
                    rows={2}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormTextField
                    name="website"
                    label="Site web"
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
                <Grid item xs={12}>
                  <Button type="submit" variant="contained">
                    Enregistrer
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </Formik>
        </TabPanel>

        {/* Horaires d'ouverture */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Périodes d'ouverture
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 3 }}
          >
            Ajouter une période
          </Button>
          <Typography color="text.secondary">
            Aucune période d'ouverture définie
          </Typography>
        </TabPanel>

        {/* Conditions générales */}
        <TabPanel value={tabValue} index={2}>
          <FormTextField
            name="terms"
            label="Conditions générales de vente"
            multiline
            rows={15}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained">
            Enregistrer
          </Button>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
