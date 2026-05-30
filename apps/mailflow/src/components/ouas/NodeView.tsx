import { Network, ArrowRight } from 'lucide-react';
import { withOUAS } from '@ouas/react';
import './NodeView.css';

interface NodeViewProps {
  sender_name?: string;
  email_count?: number;
  connected_to?: string[];
  _ouas_variant?: string;
}

function NodeViewComponent(props: NodeViewProps) {
  const { sender_name, email_count, connected_to, _ouas_variant = 'graph' } = props;

  const displaySender = sender_name || 'Unknown Node';

  return (
    <div className={`node-view ${_ouas_variant}`}>
      <div className="node-view-header">
        <Network size={16} className="node-icon" />
        <span className="node-name">{displaySender}</span>
        {email_count !== undefined && <span className="node-badge">{email_count}</span>}
      </div>
      
      {connected_to && connected_to.length > 0 && (
        <div className="node-connections">
          <div className="connection-label">Connected to:</div>
          <div className="connection-list">
            {connected_to.map((conn, i) => (
              <div key={i} className="connection-item">
                <ArrowRight size={12} className="connection-arrow" />
                <span>{conn}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const NodeView = withOUAS(NodeViewComponent, {
  id: 'node-view',
  display_name: 'Relationship Node',
  description: 'Visualizes communication relationships between people or organizations.',
  category: 'display',
  data_source: 'emails',
  variants: ['graph', 'list'],
  fields: {
    sender_name: { type: 'string', required: true, label: 'Entity Name' },
    email_count: { type: 'number', required: false, label: 'Interaction Count' },
    connected_to: { type: 'array', required: false, label: 'Connected Entities' },
  }
});
