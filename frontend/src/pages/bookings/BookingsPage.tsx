import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  ViewList as ListIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import DataTable from '../../components/DataTable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
      id={`bookings-tabpanel-${index}`}
      aria-labelledby={`bookings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

interface Column {
  id: string;
  label: string;
  minWidth: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => string;
}

const BookingsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Données de test
  const bookings = [
    {
      id: '1',
      bookingNumber: 'RES-001',
      date: '2025-02-02T10:00:00',
      startTime: '2025-02-02T10:00:00',
      activity: 'Kayak',
      customer: 'Jean Dupont',
      status: 'confirmed',
      participants: 2,
      totalPrice: 50,
    },
    {
      id: '2',
      bookingNumber: 'RES-002',
      date: '2025-02-02T14:00:00',
      startTime: '2025-02-02T14:00:00',
      activity: 'Paddle',
      customer: 'Marie Martin',
      status: 'pending',
      participants: 1,
      totalPrice: 30,
    },
  ];

  const columns: Column[] = [
    { id: 'bookingNumber', label: 'N° Réservation', minWidth: 100 },
    { id: 'date', label: 'Date', minWidth: 100, format: (value: string) => format(new Date(value), 'P', { locale: fr }) },
    { id: 'startTime', label: 'Horaire', minWidth: 100, format: (value: string) => format(new Date(value), 'p', { locale: fr }) },
    { id: 'activity', label: 'Activité', minWidth: 130 },
    { id: 'customer', label: 'Client', minWidth: 130 },
    {
      id: 'status',
      label: 'Statut',
      minWidth: 100,
      format: (value: string) => {
        const statusMap: { [key: string]: string } = {
          pending: 'En attente',
          confirmed: 'Confirmé',
          cancelled: 'Annulé'
        };
        return statusMap[value] || value;
      },
    },
    {
      id: 'participants',
      label: 'Participants',
      minWidth: 100,
      align: 'right',
    },
    {
      id: 'totalPrice',
      label: 'Total',
      minWidth: 100,
      align: 'right',
      format: (value: number) => `${value}€`,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Réservations
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChangeTab}>
          <Tab
            icon={<ListIcon />}
            label="Liste"
            id="bookings-tab-0"
          />
          <Tab
            icon={<CalendarIcon />}
            label="Calendrier"
            id="bookings-tab-1"
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardContent>
            <DataTable
              columns={columns}
              rows={bookings}
              onView={(id) => console.log('View booking:', id)}
              onEdit={(id) => console.log('Edit booking:', id)}
              onDelete={(id) => console.log('Cancel booking:', id)}
            />
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardContent>
            <Typography color="text.secondary">
              Vue calendrier à implémenter
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  );
};

export default BookingsPage;
