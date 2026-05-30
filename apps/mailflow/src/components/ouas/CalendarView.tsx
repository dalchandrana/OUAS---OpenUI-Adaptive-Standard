import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { withOUAS } from '@ouas/react';
import type { ComponentType, ReactNode } from 'react';
import './CalendarView.css';

interface CalendarViewProps {
  view_type?: 'week' | 'month';
  date_range_start?: string;
  date_range_end?: string;
  _ouas_region?: string;
  _ouas_variant?: string;
  slot_events?: ComponentType<any>;
}

function CalendarViewComponent(props: CalendarViewProps) {
  const {
    view_type = 'week',
    _ouas_variant = 'full',
    slot_events: EventsSlot,
  } = props;

  // We'll mock a simple week view centered around today
  const today = new Date();
  const startDate = startOfWeek(today, { weekStartsOn: 1 }); // Start on Monday
  
  const days = [];
  for (let i = 0; i < (view_type === 'week' ? 7 : 14); i++) {
    days.push(addDays(startDate, i));
  }

  return (
    <div className={`calendar-view ${_ouas_variant}`}>
      <div className="calendar-header">
        <h2>{format(today, 'MMMM yyyy')}</h2>
        <div className="calendar-view-toggle">
          <span className={view_type === 'week' ? 'active' : ''}>Week</span>
          <span className={view_type === 'month' ? 'active' : ''}>2 Weeks</span>
        </div>
      </div>
      
      <div className="calendar-grid">
        {days.map((day, i) => (
          <div key={i} className={`calendar-day ${isSameDay(day, today) ? 'today' : ''}`}>
            <div className="day-header">
              <span className="day-name">{format(day, 'EEE')}</span>
              <span className="day-number">{format(day, 'd')}</span>
            </div>
            
            <div className="day-events">
              {/* If we have events, we'd normally pass the filtered list. 
                  For now, we'll just render the slot and the layout engine 
                  will populate it with the filtered items */}
              {EventsSlot && <EventsSlot filter_date={day.toISOString()} {...props} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const CalendarView = withOUAS(CalendarViewComponent, {
  id: 'calendar-view',
  display_name: 'Calendar Grid',
  description: 'Displays a calendar grid (week or month) and acts as a container for event cards.',
  category: 'container',
  data_source: 'emails',
  variants: ['full', 'compact'],
  slots: ['events'],
  fields: {
    view_type: { type: 'enum', values: ['week', 'month'], required: false, label: 'View Type' },
    date_range_start: { type: 'datetime', required: false },
    date_range_end: { type: 'datetime', required: false },
  }
});
