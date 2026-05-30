import { format, isToday, isYesterday } from 'date-fns';
import { Mail, MailOpen, AlertCircle, Clock, Paperclip, Reply, Archive } from 'lucide-react';
import { withOUAS } from '@ouas/react';
import type { ComponentType } from 'react';
import type { EmailData } from '../../data/mock-data.js';

import './EmailRow.css';

interface EmailRowProps extends Partial<EmailData> {
  _ouas_region?: string;
  _ouas_variant?: string;
  slot_leading?: ComponentType<any>;
  slot_trailing?: ComponentType<any>;
  slot_actions?: ComponentType<any>[];
}

function EmailRowComponent(props: EmailRowProps) {
  const {
    id,
    sender,
    sender_name,
    subject,
    preview,
    timestamp,
    unread,
    priority,
    attachments,
    _ouas_variant = 'comfortable',
    slot_leading: LeadingSlot,
    slot_trailing: TrailingSlot,
  } = props;

  const displaySender = sender_name || sender || 'Unknown Sender';
  
  let timeStr = '';
  if (timestamp) {
    const date = new Date(timestamp);
    if (isToday(date)) {
      timeStr = format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      timeStr = 'Yesterday';
    } else {
      timeStr = format(date, 'MMM d');
    }
  }

  // Variant handling
  if (_ouas_variant === 'compact') {
    return (
      <div className={`email-row compact ${unread ? 'unread' : ''}`}>
        {LeadingSlot && <div className="slot-leading"><LeadingSlot {...props} /></div>}
        
        <div className="email-row-content">
          <div className="email-row-sender">{displaySender}</div>
          {subject && <div className="email-row-subject">{subject}</div>}
        </div>
        
        <div className="email-row-meta">
          {attachments && attachments.length > 0 && <Paperclip size={14} className="icon-attachment" />}
          {timeStr && <div className="email-row-time">{timeStr}</div>}
        </div>
        
        {TrailingSlot && <div className="slot-trailing"><TrailingSlot {...props} /></div>}
      </div>
    );
  }

  // Default 'comfortable' variant
  return (
    <div className={`email-row comfortable ${unread ? 'unread' : ''}`}>
      <div className="email-row-header">
        <div className="email-row-sender">
          {unread ? <Mail size={16} className="icon-unread" /> : <MailOpen size={16} className="icon-read" />}
          {displaySender}
        </div>
        <div className="email-row-meta">
          {priority === 'high' && <AlertCircle size={16} className="icon-high-priority" />}
          {attachments && attachments.length > 0 && <Paperclip size={16} className="icon-attachment" />}
          {timeStr && <div className="email-row-time">{timeStr}</div>}
        </div>
      </div>
      
      <div className="email-row-body">
        {subject && <div className="email-row-subject">{subject}</div>}
        {preview && <div className="email-row-preview">{preview}</div>}
      </div>
    </div>
  );
}

export const EmailRow = withOUAS(EmailRowComponent, {
  id: 'email-row',
  display_name: 'Email Row',
  description: 'Displays a single email in a list view with sender, subject, and preview text.',
  category: 'list-item',
  data_source: 'emails',
  variants: ['comfortable', 'compact'],
  slots: ['leading', 'trailing', 'actions'],
  fields: {
    sender: { type: 'string', required: true, label: 'Sender Address' },
    sender_name: { type: 'string', required: false, label: 'Sender Name' },
    subject: { type: 'string', required: false, label: 'Subject Line' },
    preview: { type: 'string', required: false, label: 'Preview Text' },
    timestamp: { type: 'datetime', required: false, label: 'Time Received' },
    unread: { type: 'boolean', required: false, label: 'Unread Status' },
    priority: { type: 'enum', values: ['high', 'normal', 'low'], required: false, label: 'Priority' },
    attachments: { type: 'array', required: false, label: 'Attachments' },
  }
});
