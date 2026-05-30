import { differenceInDays, isPast } from 'date-fns';
import { Clock } from 'lucide-react';
import { withOUAS } from '@ouas/react';
import './CountdownBadge.css';

interface CountdownBadgeProps {
  deadline?: string;
  label?: string;
  _ouas_variant?: string;
}

function CountdownBadgeComponent(props: CountdownBadgeProps) {
  const { deadline, label, _ouas_variant = 'simple' } = props;

  if (!deadline) return null;

  const deadlineDate = new Date(deadline);
  const now = new Date();
  const daysLeft = differenceInDays(deadlineDate, now);
  
  const isExpired = isPast(deadlineDate) && daysLeft < 0;
  
  let statusClass = 'normal';
  if (isExpired) statusClass = 'expired';
  else if (daysLeft <= 1) statusClass = 'urgent';
  else if (daysLeft <= 3) statusClass = 'warning';

  let displayValue = '';
  if (isExpired) displayValue = 'Past Due';
  else if (daysLeft === 0) displayValue = 'Due Today';
  else if (daysLeft === 1) displayValue = 'Due Tomorrow';
  else displayValue = `${daysLeft} days left`;

  return (
    <div className={`countdown-badge ${_ouas_variant} ${statusClass}`}>
      <Clock size={12} />
      <span>{displayValue}</span>
    </div>
  );
}

export const CountdownBadge = withOUAS(CountdownBadgeComponent, {
  id: 'countdown-badge',
  display_name: 'Countdown Badge',
  description: 'Displays a visual badge indicating time remaining until a deadline.',
  category: 'badge',
  data_source: 'emails', // Inherited context
  variants: ['simple', 'detailed'],
  fields: {
    deadline: { type: 'datetime', required: true, label: 'Deadline Date' },
    label: { type: 'string', required: false, label: 'Custom Label' },
  }
});
