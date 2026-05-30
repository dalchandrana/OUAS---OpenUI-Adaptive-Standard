import { PenLine, Plus } from 'lucide-react';
import { withOUAS } from '@ouas/react';
import './ComposeButton.css';

interface ComposeButtonProps {
  label?: string;
  _ouas_region?: string;
  _ouas_variant?: string;
}

function ComposeButtonComponent(props: ComposeButtonProps) {
  const { label = 'Compose', _ouas_variant = 'floating' } = props;

  if (_ouas_variant === 'inline') {
    return (
      <button className="compose-btn inline btn btn-primary">
        <Plus size={18} />
        <span>{label}</span>
      </button>
    );
  }

  // Default 'floating' variant
  return (
    <button className="compose-btn floating shadow-lg">
      <PenLine size={24} />
      {label && <span className="floating-label">{label}</span>}
    </button>
  );
}

export const ComposeButton = withOUAS(ComposeButtonComponent, {
  id: 'compose-button',
  display_name: 'Compose Action',
  description: 'A primary action button for creating new emails or events.',
  category: 'action',
  data_source: 'system',
  variants: ['floating', 'inline'],
  fields: {
    label: { type: 'string', required: false, label: 'Button Label' },
  }
});
