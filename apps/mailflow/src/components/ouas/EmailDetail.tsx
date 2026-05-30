import { format } from 'date-fns';
import { User, Paperclip, CornerUpLeft, CornerUpRight, Trash2, MoreVertical } from 'lucide-react';
import { withOUAS } from '@ouas/react';
import type { ComponentType } from 'react';
import type { EmailData } from '../../data/mock-data.js';

import './EmailDetail.css';

interface EmailDetailProps extends Partial<EmailData> {
  _ouas_region?: string;
  _ouas_variant?: string;
  slot_header?: ComponentType<any>;
  slot_actions?: ComponentType<any>[];
}

function EmailDetailComponent(props: EmailDetailProps) {
  const {
    id,
    sender,
    sender_name,
    recipients,
    subject,
    body,
    timestamp,
    attachments,
    _ouas_variant = 'full',
    slot_header: HeaderSlot,
  } = props;

  if (!id) {
    return (
      <div className="email-detail-empty">
        <div className="empty-state-icon">
          <User size={48} />
        </div>
        <p>Select an item to read</p>
      </div>
    );
  }

  const displaySender = sender_name || sender || 'Unknown Sender';
  const timeStr = timestamp ? format(new Date(timestamp), 'MMM d, yyyy, h:mm a') : '';
  const recipientStr = recipients ? recipients.join(', ') : '';

  if (_ouas_variant === 'reader-mode') {
    return (
      <div className="email-detail reader-mode">
        {HeaderSlot && <div className="email-detail-header-slot"><HeaderSlot {...props} /></div>}
        
        <div className="reader-header">
          {subject && <h1 className="reader-subject">{subject}</h1>}
          <div className="reader-meta">
            <span className="reader-sender">By {displaySender}</span>
            {timeStr && <span className="reader-time">{timeStr}</span>}
          </div>
        </div>

        {body && (
          <div className="reader-body">
            {body.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default 'full' variant
  return (
    <div className="email-detail full">
      <div className="email-detail-topbar">
        <div className="email-detail-actions">
          <button className="btn btn-ghost btn-icon" title="Reply"><CornerUpLeft size={18} /></button>
          <button className="btn btn-ghost btn-icon" title="Forward"><CornerUpRight size={18} /></button>
          <button className="btn btn-ghost btn-icon" title="Archive"><Trash2 size={18} /></button>
        </div>
        <div className="email-detail-actions-right">
          <button className="btn btn-ghost btn-icon"><MoreVertical size={18} /></button>
        </div>
      </div>

      <div className="email-detail-header">
        {subject && <h2 className="email-detail-subject">{subject}</h2>}
        
        <div className="email-detail-sender-info">
          <div className="avatar">{displaySender.charAt(0).toUpperCase()}</div>
          <div className="sender-details">
            <div className="sender-name">
              <strong>{displaySender}</strong> <span className="sender-email">&lt;{sender}&gt;</span>
            </div>
            {recipientStr && <div className="recipient-info">to {recipientStr}</div>}
          </div>
          {timeStr && <div className="email-detail-time">{timeStr}</div>}
        </div>
      </div>

      {attachments && attachments.length > 0 && (
        <div className="email-detail-attachments">
          {attachments.map((att, i) => (
            <div key={i} className="attachment-chip">
              <Paperclip size={14} />
              <span>{att}</span>
            </div>
          ))}
        </div>
      )}

      {body && (
        <div className="email-detail-body">
          {body.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export const EmailDetail = withOUAS(EmailDetailComponent, {
  id: 'email-detail',
  display_name: 'Email Detail View',
  description: 'Displays the full contents of an email message, including sender details, subject, body text, and attachments.',
  category: 'detail',
  data_source: 'emails',
  variants: ['full', 'reader-mode'],
  slots: ['header', 'actions'],
  fields: {
    sender: { type: 'string', required: true, label: 'Sender Address' },
    sender_name: { type: 'string', required: false, label: 'Sender Name' },
    recipients: { type: 'array', required: false, label: 'Recipients' },
    subject: { type: 'string', required: false, label: 'Subject Line' },
    body: { type: 'string', required: false, label: 'Message Body' },
    timestamp: { type: 'datetime', required: false, label: 'Time Received' },
    attachments: { type: 'array', required: false, label: 'Attachments' },
  }
});
