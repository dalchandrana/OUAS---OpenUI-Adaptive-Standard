import { Hash } from 'lucide-react';
import { withOUAS } from '@ouas/react';
import './TagCloud.css';

interface TagCloudProps {
  tags?: string[];
  max_tags?: number;
  _ouas_variant?: string;
}

function TagCloudComponent(props: TagCloudProps) {
  const { tags, max_tags = 10, _ouas_variant = 'cloud' } = props;

  if (!tags || tags.length === 0) return null;

  const displayTags = tags.slice(0, max_tags);

  return (
    <div className={`tag-cloud ${_ouas_variant}`}>
      {_ouas_variant === 'inline' ? (
        displayTags.map((tag, i) => (
          <span key={i} className="tag-inline">#{tag}</span>
        ))
      ) : (
        <div className="tag-cloud-container">
          <div className="tag-cloud-header">
            <Hash size={14} /> <span>Popular Tags</span>
          </div>
          <div className="tag-cloud-items">
            {displayTags.map((tag, i) => (
              <span key={i} className="tag-pill" style={{ 
                fontSize: `${Math.max(0.7, 1 - (i * 0.05))}rem`,
                opacity: Math.max(0.5, 1 - (i * 0.05))
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const TagCloud = withOUAS(TagCloudComponent, {
  id: 'tag-cloud',
  display_name: 'Tag Cloud',
  description: 'Displays a collection of extracted tags for quick filtering and overview.',
  category: 'display',
  data_source: 'emails',
  variants: ['cloud', 'inline'],
  fields: {
    tags: { type: 'array', required: true, label: 'Tag List' },
    max_tags: { type: 'number', required: false, label: 'Max Tags to Show' },
  }
});
