import { format, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { withOUAS } from '@ouas/react';
import type { ComponentType } from 'react';
import type { EmailData } from '../../data/mock-data.js';

import './EventCard.css';

interface EventCardProps extends Partial<EmailData> {
  _ouas_region?: string;
  _ouas_variant?: string;
  filter_date?: string;
  slot_badge?: ComponentType<any>;
}

function EventCardComponent(props: EventCardProps) {
  const {
    id,
    title,
    subject,
    event_date,
    sender,
    sender_name,
    organization,
    is_deadline,
    _ouas_variant = 'compact',
    filter_date,
    slot_badge: BadgeSlot,
  } = props;

  // Since the LayoutEngine doesn't natively group arrays by date yet,
  // we use a simple filter prop passed from the calendar grid to only render
  // events that match the day.
  if (filter_date && event_date) {
    if (!isSameDay(new Date(event_date), new Date(filter_date))) {
      return null;
    }
  }

  // If this item has no event date, don't show it in calendar
  if (!event_date) return null;

  const displayTitle = title || subject || 'No Title';
  const displaySender = sender_name || organization || sender || 'Unknown';
  const timeStr = format(new Date(event_date), 'h:mm a');

  return (
    <div className={`event-card ${_ouas_variant} ${is_deadline ? 'is-deadline' : ''}`}>
      <div className="event-card-time">
        {timeStr}
      </div>
      
      <div className="event-card-content">
        <div className="event-card-title">{displayTitle}</div>
        <div className="event-card-sender">{displaySender}</div>
      </div>
      
      {BadgeSlot && (
        <div className="event-card-badge">
          <BadgeSlot {...props} />
        </div>
      )}
    </div>
  );
}

export const EventCard = withOUAS(EventCardComponent, {
  id: 'event-card',
  display_name: 'Event Card',
  description: 'Displays a scheduled event or deadline extracted from an email.',
  category: 'list-item',
  data_source: 'emails',
  variants: ['compact', 'detailed'],
  slots: ['badge'],
  fields: {
    title: { type: 'string', required: true, label: 'Event Title' },
    event_date: { type: 'datetime', required: true, label: 'Event Date/Time' },
    sender: { type: 'string', required: false, label: 'Organizer Email' },
    sender_name: { type: 'string', required: false, label: 'Organizer Name' },
    organization: { type: 'string', required: false, label: 'Organization' },
    is_deadline: { type: 'boolean', required: false, label: 'Is Deadline?' },
  }
});
