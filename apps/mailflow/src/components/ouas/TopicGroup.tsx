import { Folder, ChevronRight, Hash } from 'lucide-react';
import { withOUAS } from '@ouas/react';
import type { ComponentType } from 'react';
import './TopicGroup.css';

interface TopicGroupProps {
  topic_name?: string;
  email_count?: number;
  key_terms?: string[];
  _ouas_region?: string;
  _ouas_variant?: string;
  slot_items?: ComponentType<any>;
}

function TopicGroupComponent(props: TopicGroupProps) {
  const { topic_name, email_count, key_terms, _ouas_variant = 'list', slot_items: ItemsSlot } = props;

  const displayTopic = topic_name || 'Uncategorized';

  if (_ouas_variant === 'cards') {
    return (
      <div className="topic-group-card">
        <div className="topic-card-header">
          <Folder className="topic-icon" size={20} />
          <h3>{displayTopic}</h3>
          {email_count !== undefined && <span className="topic-count">{email_count}</span>}
        </div>
        {key_terms && key_terms.length > 0 && (
          <div className="topic-terms">
            {key_terms.slice(0, 3).map((term, i) => (
              <span key={i} className="term-chip">{term}</span>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default 'list' variant
  return (
    <div className="topic-group-list">
      <div className="topic-list-header">
        <div className="topic-list-title">
          <ChevronRight size={16} />
          <Folder size={16} className="topic-icon-small" />
          <span className="topic-name">{displayTopic}</span>
          {email_count !== undefined && <span className="topic-count-small">({email_count})</span>}
        </div>
      </div>
      {/* If expanded, we'd render items here. Since we mock data simply, we just show the structure */}
      <div className="topic-list-items">
        {/* Mocking children if slot provided */}
        {ItemsSlot && <div className="topic-slot-placeholder">Sub-items would appear here</div>}
      </div>
    </div>
  );
}

export const TopicGroup = withOUAS(TopicGroupComponent, {
  id: 'topic-group',
  display_name: 'Topic Group',
  description: 'Groups related emails by AI-extracted topic or project.',
  category: 'container',
  data_source: 'emails',
  variants: ['list', 'cards'],
  slots: ['items'],
  fields: {
    topic_name: { type: 'string', required: true, label: 'Topic Name' },
    email_count: { type: 'number', required: false, label: 'Item Count' },
    key_terms: { type: 'array', required: false, label: 'Key Terms' },
  }
});
