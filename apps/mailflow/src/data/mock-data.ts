import { addDays, subDays, subHours, subMinutes } from 'date-fns';
import type { LayoutConfig } from '@ouas/validator';

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = [
  { id: 'user_exec_001', name: 'Elena (Executive)', role: 'executive' },
  { id: 'user_student_001', name: 'Sam (Student)', role: 'student' },
  { id: 'user_researcher_001', name: 'Dr. Reed (Researcher)', role: 'researcher' },
];

// ─── Preset Configs ──────────────────────────────────────────────────────────

export const presetConfigs: Record<string, LayoutConfig> = {
  executive: {
    ouas_version: '1.0',
    config_id: 'cfg_exec_tasklist_v1',
    app_id: 'com.example.mailflow',
    user_id: 'user_exec_001',
    manifest_version: '1.0.0',
    created_by_agent: 'claude-3-5-sonnet',
    created_at: new Date().toISOString(),
    description: 'Email as task list for busy executive.',
    layout: {
      type: 'single-column',
      regions: [
        {
          id: 'main-list',
          component: 'email-row',
          variant: 'compact',
          visible_fields: ['sender', 'priority', 'unread'],
          hidden_fields: ['subject', 'preview', 'timestamp'],
          sort: { field: 'priority', direction: 'desc' },
          filter: null,
          slots: {
            leading: 'priority-badge',
            trailing: 'snooze-button',
            actions: ['archive', 'reply', "snooze"]
          },
        },
        {
          id: 'compose-bar',
          component: 'compose-button',
          variant: 'floating',
          visible_fields: ['label'],
          position: 'bottom-right',
        },
      ],
    },
    theme: { density: 'compact', accent_color: '#E53935' },
  },
  student: {
    ouas_version: '1.0',
    config_id: 'cfg_student_calendar_v1',
    app_id: 'com.example.mailflow',
    user_id: 'user_student_001',
    manifest_version: '1.0.0',
    created_by_agent: 'claude-3-5-sonnet',
    created_at: new Date().toISOString(),
    description: 'Email as calendar for student.',
    layout: {
      type: 'calendar',
      regions: [
        {
          id: 'calendar-main',
          component: 'calendar-view',
          variant: 'full',
          visible_fields: ['view_type', 'date_range_start', 'date_range_end'],
          slots: { events: 'event-card' },
        },
        {
          id: 'event-items',
          component: 'event-card',
          variant: 'compact',
          visible_fields: ['title', 'event_date', 'sender', 'organization', 'is_deadline'],
          sort: { field: 'event_date', direction: 'asc' },
          slots: { badge: 'countdown-badge' },
        },
        {
          id: 'deadline-indicator',
          component: 'countdown-badge',
          variant: 'detailed',
          visible_fields: ['deadline', 'label'],
        },
        {
          id: 'compose-bar',
          component: 'compose-button',
          variant: 'inline',
          visible_fields: ['label'],
        },
      ],
    },
    theme: { density: 'comfortable', accent_color: '#4285F4' },
  },
  researcher: {
    ouas_version: '1.0',
    config_id: 'cfg_researcher_kb_v1',
    app_id: 'com.example.mailflow',
    user_id: 'user_researcher_001',
    manifest_version: '1.0.0',
    created_by_agent: 'claude-3-5-sonnet',
    created_at: new Date().toISOString(),
    description: 'Email as knowledge base for researcher.',
    layout: {
      type: 'two-column',
      regions: [
        {
          id: 'topic-sidebar',
          component: 'topic-group',
          variant: 'list',
          visible_fields: ['topic_name', 'email_count', 'key_terms'],
          sort: { field: 'email_count', direction: 'desc' },
          slots: { items: 'email-row' },
        },
        {
          id: 'reading-pane',
          component: 'email-detail',
          variant: 'reader-mode',
          visible_fields: ['sender', 'subject', 'body', "timestamp", "attachments"],
          slots: { header: 'node-view', actions: ['reply', 'forward', "archive"] },
        },
        {
          id: 'tag-display',
          component: 'tag-cloud',
          variant: 'cloud',
          visible_fields: ['tags', 'max_tags'],
        },
        {
          id: 'relationship-graph',
          component: 'node-view',
          variant: 'graph',
          visible_fields: ['sender_name', 'email_count', 'connected_to'],
        },
        {
          id: 'thread-list',
          component: 'thread-group',
          variant: 'expanded',
          visible_fields: ['topic', 'thread_count', 'tags'],
          sort: { field: 'thread_count', direction: 'desc' },
        },
      ],
    },
    theme: { density: 'spacious', accent_color: '#00BFA5' },
  },
};

// ─── Default Layout (Standard Email App) ─────────────────────────────────────

export const defaultLayoutConfig: LayoutConfig = {
  ouas_version: '1.0',
  config_id: 'cfg_default_v1',
  app_id: 'com.example.mailflow',
  user_id: 'system',
  manifest_version: '1.0.0',
  created_by_agent: 'system',
  created_at: new Date().toISOString(),
  description: 'Standard 2-pane email layout (default fallback).',
  layout: {
    type: 'two-column',
    regions: [
      {
        id: 'sidebar-list',
        component: 'email-row',
        variant: 'comfortable',
        visible_fields: ['sender', 'subject', 'preview', 'timestamp', 'unread'],
        sort: { field: 'timestamp', direction: 'desc' },
      },
      {
        id: 'main-detail',
        component: 'email-detail',
        variant: 'full',
        visible_fields: ['sender', 'recipients', 'subject', 'body', 'timestamp', 'attachments'],
      },
      {
        id: 'compose-fab',
        component: 'compose-button',
        variant: 'floating',
        visible_fields: ['label'],
        position: 'bottom-right',
      }
    ],
  },
  theme: { density: 'comfortable' },
};

// ─── Mock Emails ─────────────────────────────────────────────────────────────

const now = new Date();

export interface EmailData {
  id: string;
  sender: string;
  sender_name?: string;
  recipients: string[];
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  unread: boolean;
  priority: 'high' | 'normal' | 'low';
  attachments?: string[];
  tags: string[];
  topic: string;
  // Extracted fields for calendar
  title?: string;
  event_date?: string;
  organization?: string;
  is_deadline?: boolean;
  deadline?: string;
  // Node fields
  connected_to?: string[];
  email_count?: number;
}

export const emails: EmailData[] = [
  // Executive Focus Emails
  {
    id: 'msg-001',
    sender: 'board@acme.corp',
    sender_name: 'Acme Board',
    recipients: ['elena@acme.corp'],
    subject: 'URGENT: Q3 Earnings Call Preparation',
    preview: 'Elena, please review the attached slides before tomorrow.',
    body: 'Elena,\n\nPlease review the attached slides for the Q3 earnings call tomorrow at 9 AM EST. The margins on the new product line need more explanation.\n\nThanks,\nBoard',
    timestamp: subMinutes(now, 15).toISOString(),
    unread: true,
    priority: 'high',
    attachments: ['Q3_Slides_Draft.pdf'],
    tags: ['q3', 'earnings', 'urgent', 'slides'],
    topic: 'Q3 Earnings',
    title: 'Q3 Earnings Call',
    event_date: addDays(now, 1).toISOString(),
    is_deadline: true,
    deadline: addDays(now, 1).toISOString(),
    organization: 'Acme Corp',
    connected_to: ['CFO', 'CEO'],
  },
  {
    id: 'msg-002',
    sender: 'legal@acme.corp',
    sender_name: 'Acme Legal',
    recipients: ['elena@acme.corp'],
    subject: 'Signature required: M&A NDA',
    preview: 'Attached is the non-disclosure agreement for Project Apollo.',
    body: 'Attached is the non-disclosure agreement for Project Apollo. We need this signed by EOD to proceed with data room access.',
    timestamp: subHours(now, 2).toISOString(),
    unread: true,
    priority: 'high',
    attachments: ['Project_Apollo_NDA.pdf'],
    tags: ['legal', 'nda', 'm&a', 'apollo'],
    topic: 'Project Apollo',
    is_deadline: true,
    deadline: new Date(now.setHours(17, 0, 0, 0)).toISOString(),
    organization: 'Acme Legal',
    connected_to: ['External Counsel'],
  },
  
  // Student Focus Emails
  {
    id: 'msg-003',
    sender: 'prof.smith@university.edu',
    sender_name: 'Prof. Smith',
    recipients: ['sam@student.edu'],
    subject: 'Assignment 3 Extended Deadline',
    preview: 'The deadline for Assignment 3 has been moved to Friday at midnight.',
    body: 'Class,\n\nDue to the server outage yesterday, the deadline for Assignment 3 has been moved to Friday at midnight. Office hours are Thursday 2-4 PM.\n\n- Prof. Smith',
    timestamp: subHours(now, 12).toISOString(),
    unread: false,
    priority: 'normal',
    tags: ['assignment', 'deadline', 'extension', 'cs101'],
    topic: 'CS101',
    title: 'CS101 Assignment 3',
    event_date: addDays(now, 2).toISOString(),
    is_deadline: true,
    deadline: addDays(now, 2).toISOString(),
    organization: 'University',
    connected_to: ['TA Group'],
  },
  {
    id: 'msg-004',
    sender: 'robotics-club@university.edu',
    sender_name: 'Robotics Club',
    recipients: ['sam@student.edu'],
    subject: 'Workshop: Intro to ROS2',
    preview: 'Join us this Wednesday at 6 PM in the engineering lab.',
    body: 'Join us this Wednesday at 6 PM in the engineering lab for a hands-on intro to ROS2. Bring your laptops. Pizza provided!',
    timestamp: subDays(now, 1).toISOString(),
    unread: true,
    priority: 'normal',
    tags: ['club', 'workshop', 'ros2', 'robotics'],
    topic: 'Robotics Club',
    title: 'ROS2 Workshop',
    event_date: addDays(now, 1).toISOString(), // Tomorrow
    organization: 'Robotics Club',
  },

  // Researcher Focus Emails
  {
    id: 'msg-005',
    sender: 'dr.chen@institute.org',
    sender_name: 'Dr. Chen',
    recipients: ['reed@lab.org'],
    subject: 'Re: Nature submission draft review',
    preview: 'I have left comments on section 3 regarding the methodology.',
    body: 'Reed,\n\nI have left comments on section 3 regarding the methodology. The control group variance is higher than expected. See attached annotated draft.\n\nBest,\nChen',
    timestamp: subDays(now, 2).toISOString(),
    unread: false,
    priority: 'high',
    attachments: ['Nature_Draft_v2_Chen_comments.docx'],
    tags: ['publication', 'nature', 'methodology', 'draft'],
    topic: 'Nature Paper 2025',
    connected_to: ['Dr. Smith', 'Lab Admin'],
  },
  {
    id: 'msg-006',
    sender: 'lab-equipment@vendor.com',
    sender_name: 'Vendor Supply',
    recipients: ['reed@lab.org'],
    subject: 'Spectrometer Calibration Due',
    preview: 'Your Mass Spectrometer is due for annual calibration next month.',
    body: 'Your Mass Spectrometer (Serial #84920) is due for annual calibration next month. Please schedule a technician visit by clicking the link below.',
    timestamp: subDays(now, 5).toISOString(),
    unread: false,
    priority: 'low',
    tags: ['equipment', 'maintenance', 'calibration'],
    topic: 'Lab Management',
    organization: 'Vendor Supply',
  },
];

// Generate 44 more mock emails to meet the 50+ PRD requirement
for (let i = 7; i <= 55; i++) {
  const isRead = Math.random() > 0.3;
  const isUrgent = Math.random() > 0.8;
  const daysAgo = Math.floor(Math.random() * 30);
  const fakeDate = subDays(now, daysAgo);
  
  emails.push({
    id: `msg-${i.toString().padStart(3, '0')}`,
    sender: `user${i}@example.com`,
    sender_name: `User ${i}`,
    recipients: ['user@example.com'],
    subject: `Routine update ${i}`,
    preview: `This is an auto-generated mock email number ${i}.`,
    body: `This is the full body for auto-generated mock email number ${i}. It contains standard text used to fill out the dataset.`,
    timestamp: fakeDate.toISOString(),
    unread: !isRead,
    priority: isUrgent ? 'high' : (Math.random() > 0.5 ? 'normal' : 'low'),
    tags: ['update', 'routine', `tag-${i % 5}`],
    topic: `Topic ${i % 3}`,
    title: `Routine Event ${i}`,
    event_date: Math.random() > 0.5 ? addDays(now, (i % 10)).toISOString() : undefined,
    organization: `Company ${i % 4}`,
    connected_to: [`Contact ${i % 5}`],
    email_count: Math.floor(Math.random() * 10) + 1,
  });
}
