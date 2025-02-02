import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box } from '@mui/material';
import frLocale from '@fullcalendar/core/locales/fr';
import { EventClickArg } from '@fullcalendar/core';
import { DateSelectArg } from '@fullcalendar/core';

export interface BookingCalendarProps {
  events: Array<{
    id: string;
    title: string;
    start: Date;
    end: Date;
    color?: string;
  }>;
  onEventClick: (id: string) => void;
  onDateSelect: (start: Date, end: Date) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  events,
  onEventClick,
  onDateSelect,
}) => {
  return (
    <Box sx={{ height: '100%', '& .fc': { height: '100%' } }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        eventClick={(info: EventClickArg) => onEventClick(info.event.id)}
        selectable={true}
        select={(info: DateSelectArg) => onDateSelect(info.start, info.end)}
        editable={false}
        dayMaxEvents={true}
        weekends={true}
        locale={frLocale}
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
      />
    </Box>
  );
};

export default BookingCalendar;
