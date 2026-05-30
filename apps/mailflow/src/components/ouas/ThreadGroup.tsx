import { Layers } from 'lucide-react';
import { withOUAS } from '@ouas/react';
import './ThreadGroup.css';

interface ThreadGroupProps {
  topic?: string;
  thread_count?: number;
  tags?: string[];
  _ouas_variant?: string;
}

function ThreadGroupComponent(props: ThreadGroupProps) {
  const { topic, thread_count, tags, _ouas_variant = 'expanded' } = props;

  return (
    <div className={`thread-group ${_ouas_variant}`}>
      <div className="thread-group-header">
        <Layers size={18} className="thread-icon" />
        <span className="thread-title">{topic || 'General Thread'}</span>
        {thread_count !== undefined && <span className="thread-count">{thread_count} msgs</span>}
      </div>
      {tags && tags.length > 0 && (
        <div className="thread-tags">
          {tags.slice(0, 4).map((tag, i) => (
            <span key={i} className="thread-tag">#{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export const ThreadGroup = withOUAS(ThreadGroupComponent, {
  id: 'thread-group',
  display_name: 'Thread Group',
  description: 'Visualizes a conversation thread or grouped interactions.',
  category: 'container',
  data_source: 'emails',
  variants: ['expanded', 'collapsed'],
  fields: {
    topic: { type: 'string', required: true, label: 'Thread Topic' },
    thread_count: { type: 'number', required: false, label: 'Message Count' },
    tags: { type: 'array', required: false, label: 'Thread Tags' },
  }
});
