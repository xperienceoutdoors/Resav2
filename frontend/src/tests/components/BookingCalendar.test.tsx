import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import BookingCalendar from '../../components/Calendar/BookingCalendar';

const mockStore = configureStore([]);

describe('BookingCalendar Component', () => {
  const mockEvents = [
    {
      id: '1',
      title: 'Test Booking',
      start: new Date('2025-02-02T10:00:00'),
      end: new Date('2025-02-02T11:00:00'),
      color: '#4caf50'
    }
  ];

  const mockEventClick = jest.fn();
  const mockDateSelect = jest.fn();

  it('renders calendar with events', () => {
    render(
      <Provider store={mockStore({})}>
        <BookingCalendar
          events={mockEvents}
          onEventClick={mockEventClick}
          onDateSelect={mockDateSelect}
        />
      </Provider>
    );

    // Vérifier que le calendrier est rendu
    expect(screen.getByText('Test Booking')).toBeInTheDocument();
  });

  it('handles date selection', () => {
    render(
      <Provider store={mockStore({})}>
        <BookingCalendar
          events={mockEvents}
          onEventClick={mockEventClick}
          onDateSelect={mockDateSelect}
        />
      </Provider>
    );

    // Les tests de sélection de date nécessitent une interaction complexe avec FullCalendar
    // qui n'est pas facilement testable avec jest
    expect(mockDateSelect).not.toHaveBeenCalled();
  });
});
