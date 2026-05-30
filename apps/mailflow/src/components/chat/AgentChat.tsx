'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useOUASContext } from '@ouas/renderer';
import { TransformStatus, type TransformState } from './TransformStatus';
import type { ValidationResult } from '@ouas/validator';
import './AgentChat.css';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
}

interface AgentChatProps {
  userId: string;
  onPresetSelect: (presetId: string) => void;
}

export function AgentChat({ userId, onPresetSelect }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'agent',
      content: 'Hi! I can customize this app for you. What are you trying to do today? You can say "I need to focus on deadlines" or select a preset below.',
    }
  ]);
  const [input, setInput] = useState('');
  
  // Transformation state
  const [transformState, setTransformState] = useState<TransformState>('idle');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  
  const { applyConfig, activeConfig } = useOUASContext();
  const activeConfigId = activeConfig?.config_id ?? null;
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, transformState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || transformState === 'generating' || transformState === 'validating') return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMsg }]);
    
    // Start transformation process
    setTransformState('generating');
    setValidationResult(null);
    setErrorMessage(undefined);

    try {
      // 1. Call Agent API to generate config
      const response = await fetch('/api/ouas/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg, userId }),
      });

      if (!response.ok) {
        let errorMsg = `Agent failed to generate layout: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMsg = errorData.error;
          }
        } catch (e) {
          // ignore parsing error
        }
        throw new Error(errorMsg);
      }

      const { config, message: agentMessage } = await response.json();
      
      setTransformState('validating');
      
      // 2. Apply config via OUAS SDK
      const result = await applyConfig(config) as ValidationResult;
      setValidationResult(result);
      
      if (result.valid) {
        setTransformState('success');
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'agent', 
          content: agentMessage || 'I have updated your layout!' 
        }]);
      } else {
        setTransformState('error');
        setErrorMessage('The generated layout failed OUAS validation.');
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'agent', 
          content: 'Sorry, I generated an invalid layout. Check the errors below.' 
        }]);
      }
      
    } catch (err) {
      setTransformState('error');
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error occurred');
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'agent', 
        content: 'I encountered an error while trying to process your request.' 
      }]);
    }
  };

  return (
    <div className="agent-chat">
      <div className="agent-chat-header">
        <Sparkles size={18} className="agent-icon" />
        <h2>Design Agent</h2>
      </div>
      
      <div className="chat-messages" ref={messagesContainerRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-message ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'agent' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className="message-bubble">
              {msg.content}
            </div>
          </div>
        ))}
        
        {transformState !== 'idle' && (
          <div className="chat-status-wrapper">
            <TransformStatus 
              state={transformState} 
              validationResult={validationResult} 
              errorMessage={errorMessage}
              onDismiss={() => setTransformState('idle')}
            />
          </div>
        )}
      </div>

      <div className="chat-presets">
        <p>Or try a preset:</p>
        <div className="preset-buttons">
          <button className={`preset-btn ${activeConfigId === null ? 'active' : ''}`} onClick={() => onPresetSelect('default')}>Standard</button>
          <button className={`preset-btn ${activeConfigId === 'cfg_exec_tasklist_v1' ? 'active' : ''}`} onClick={() => onPresetSelect('executive')}>Executive Tasklist</button>
          <button className={`preset-btn ${activeConfigId === 'cfg_student_calendar_v1' ? 'active' : ''}`} onClick={() => onPresetSelect('student')}>Student Calendar</button>
          <button className={`preset-btn ${activeConfigId === 'cfg_researcher_kb_v1' ? 'active' : ''}`} onClick={() => onPresetSelect('researcher')}>Researcher KB</button>
        </div>
      </div>

      <form className="chat-input-area" onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="E.g. Turn this into a calendar view..."
          disabled={transformState === 'generating' || transformState === 'validating'}
        />
        <button 
          type="submit" 
          className="btn btn-primary btn-icon"
          disabled={!input.trim() || transformState === 'generating' || transformState === 'validating'}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
