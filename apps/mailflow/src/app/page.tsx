'use client';

import { useState } from 'react';
import { OUASProvider } from '@ouas/renderer';
import { AgentChat } from '@/components/chat/AgentChat';
import { defaultLayoutConfig, emails, users } from '@/data/mock-data';
import manifestData from '@/data/manifest.ouas.json';
import type { Manifest } from '@ouas/validator';

// Import our OUAS components
import { EmailRow } from '@/components/ouas/EmailRow';
import { EmailDetail } from '@/components/ouas/EmailDetail';
import { ComposeButton } from '@/components/ouas/ComposeButton';
import { CalendarView } from '@/components/ouas/CalendarView';
import { EventCard } from '@/components/ouas/EventCard';
import { CountdownBadge } from '@/components/ouas/CountdownBadge';
import { TopicGroup } from '@/components/ouas/TopicGroup';
import { TagCloud } from '@/components/ouas/TagCloud';
import { NodeView } from '@/components/ouas/NodeView';
import { ThreadGroup } from '@/components/ouas/ThreadGroup';
import { LayoutRenderer } from './LayoutRenderer';

const manifest = manifestData as unknown as Manifest;

const componentRegistry = {
  'email-row': EmailRow,
  'email-detail': EmailDetail,
  'compose-button': ComposeButton,
  'calendar-view': CalendarView,
  'event-card': EventCard,
  'countdown-badge': CountdownBadge,
  'topic-group': TopicGroup,
  'tag-cloud': TagCloud,
  'node-view': NodeView,
  'thread-group': ThreadGroup,
};

// Fallback layout when there's an error or it's loading
function FallbackLayout() {
  return (
    <div className="flex h-screen items-center justify-center text-center p-8">
      <div>
        <h2 className="text-xl font-bold mb-2">Loading Layout...</h2>
        <p className="text-gray-500">Please wait while we initialize your interface.</p>
      </div>
    </div>
  );
}

export default function MailFlowApp() {
  const [currentUserId, setCurrentUserId] = useState('user_exec_001');

  // We are creating a wrapper component to use the context
  // The layout itself is driven by the backend.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      {/* Persona Switcher (Mock Auth) */}
      <header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '12px 24px',
        backgroundColor: '#0f172a',
        color: 'white',
        flexShrink: 0
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '4px' }}></div>
          MailFlow
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>View as Persona:</span>
          <select 
            value={currentUserId}
            onChange={(e) => setCurrentUserId(e.target.value)}
            style={{ 
              padding: '6px 12px', 
              borderRadius: '6px', 
              backgroundColor: '#1e293b', 
              color: 'white', 
              border: '1px solid #334155' 
            }}
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Main App Content - Key changes on user switch to force re-mount and re-fetch */}
      <main style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <OUASProvider
          key={currentUserId}
          manifest={manifest}
          agentApiBase="/api/ouas"
          userId={currentUserId}
          components={componentRegistry}
          dataSources={{ emails }}
          fallback={<FallbackLayout />}
        >
          <div style={{ flex: 1, position: 'relative', height: '100%' }}>
            <LayoutRenderer />
          </div>
          <div style={{ width: '350px', flexShrink: 0, zIndex: 10, height: '100%' }}>
            <AgentChatWrapper userId={currentUserId} />
          </div>
        </OUASProvider>
      </main>
    </div>
  );
}

// Separate component to isolate context usage
function AgentChatWrapper({ userId }: { userId: string }) {
  // We need to fetch the mock data via API for the preset select so 
  // that it applies through the context cleanly. 
  // Instead, since it's a demo, we can just hit our own API.
  const handlePresetSelect = async (preset: string) => {
    if (preset === 'default') {
      await fetch(`/api/ouas/config/${userId}`, { method: 'DELETE' });
    } else {
      // Just hit a refresh by forcing window reload for presets since the server handles them for us
      // by looking at userId. But if they select a mismatching preset, we just POST it.
      const presetModule = await import('@/data/mock-data');
      const config = presetModule.presetConfigs[preset];
      if (config) {
        await fetch(`/api/ouas/config/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        });
      }
    }
    // Reload the page to fetch the new config (simple approach for the demo)
    window.location.reload();
  };

  return <AgentChat userId={userId} onPresetSelect={handlePresetSelect} />;
}
