// ============================================================
// Mock data — 10+ tasks across all 3 statuses
// Conditions: ≥3 per priority, ≥3 overdue (not done), 4+ assignees
// ============================================================

import type { Task } from './types'

export const mockTasks: Task[] = [
  // ── TODO ──────────────────────────────────────────────────
  {
    id: 'task-001',
    title: 'Implement OAuth2 Authentication Flow',
    description:
      'Set up OAuth2 with Google and GitHub providers. Integrate refresh token rotation and secure cookie storage for session management.',
    priority: 'high',
    dueDate: '2026-06-05',   // OVERDUE (past)
    assignee: 'Sarah Chen',
    status: 'todo',
    tags: ['auth', 'backend', 'security'],
    createdAt: '2026-05-15T09:00:00.000Z',
  },
  {
    id: 'task-002',
    title: 'Design System Tokens — Dark Mode',
    description:
      'Define semantic color tokens for dark mode variants across all components. Ensure WCAG AA contrast ratios are met for all text/background pairs.',
    priority: 'medium',
    dueDate: '2026-06-25',
    assignee: 'Marcus Reid',
    status: 'todo',
    tags: ['ux', 'design'],
    createdAt: '2026-05-20T10:30:00.000Z',
  },
  {
    id: 'task-003',
    title: 'Write Unit Tests for Payment Service',
    description:
      'Cover edge cases for payment gateway integrations: declined cards, network timeouts, idempotency key collisions, and webhook signature validation.',
    priority: 'high',
    dueDate: '2026-06-10',   // OVERDUE
    assignee: 'Priya Nair',
    status: 'todo',
    tags: ['backend', 'testing'],
    createdAt: '2026-05-22T11:00:00.000Z',
  },
  {
    id: 'task-004',
    title: 'Update API Rate Limiting Middleware',
    description:
      'Replace in-memory rate limiter with Redis-backed sliding window algorithm. Configurable per-route limits and grace periods.',
    priority: 'low',
    dueDate: '2026-07-10',
    assignee: 'Sarah Chen',
    status: 'todo',
    tags: ['backend'],
    createdAt: '2026-06-01T08:00:00.000Z',
  },

  // ── IN PROGRESS ───────────────────────────────────────────
  {
    id: 'task-005',
    title: 'Refactor Dashboard Data Fetching',
    description:
      'Migrate dashboard from polling to WebSocket-based real-time updates. Implement optimistic UI updates with rollback on error.',
    priority: 'high',
    dueDate: '2026-06-08',   // OVERDUE
    assignee: 'James Okafor',
    status: 'in-progress',
    tags: ['frontend', 'performance'],
    createdAt: '2026-05-18T14:00:00.000Z',
  },
  {
    id: 'task-006',
    title: 'Notification Service Integration',
    description:
      'Integrate SendGrid for transactional emails and Twilio for SMS alerts. Template system for onboarding, alerts, and digest emails.',
    priority: 'medium',
    dueDate: '2026-06-28',
    assignee: 'Priya Nair',
    status: 'in-progress',
    tags: ['backend', 'blocked'],
    createdAt: '2026-05-25T09:30:00.000Z',
  },
  {
    id: 'task-007',
    title: 'Mobile Responsive Overhaul — Settings Pages',
    description:
      'Audit and fix breakpoints on all Settings sub-pages. Focus on form layout reflow, nested navigation drawer, and date picker mobile UX.',
    priority: 'medium',
    dueDate: '2026-07-05',
    assignee: 'Marcus Reid',
    status: 'in-progress',
    tags: ['ux', 'frontend'],
    createdAt: '2026-06-02T10:00:00.000Z',
  },
  {
    id: 'task-008',
    title: 'PostgreSQL Query Optimization — Reports Module',
    description:
      'Identify slow queries in the reports module using pg_stat_statements. Add composite indexes and rewrite N+1 ORM calls to bulk-fetch.',
    priority: 'high',
    dueDate: '2026-06-30',
    assignee: 'James Okafor',
    status: 'in-progress',
    tags: ['backend', 'performance'],
    createdAt: '2026-06-05T11:00:00.000Z',
  },

  // ── DONE ──────────────────────────────────────────────────
  {
    id: 'task-009',
    title: 'CI/CD Pipeline — GitHub Actions Setup',
    description:
      'Configure matrix build pipeline with lint, type-check, unit tests, and Docker image publication. Auto-deploy to staging on PR merge.',
    priority: 'high',
    dueDate: '2026-06-01',
    assignee: 'Sarah Chen',
    status: 'done',
    tags: ['devops', 'backend'],
    createdAt: '2026-05-10T09:00:00.000Z',
  },
  {
    id: 'task-010',
    title: 'Accessibility Audit — Core Navigation',
    description:
      'Run axe-core and manual keyboard navigation tests on the main nav, breadcrumbs, and skip-link. Fix all critical and serious issues.',
    priority: 'medium',
    dueDate: '2026-06-05',
    assignee: 'Marcus Reid',
    status: 'done',
    tags: ['ux', 'a11y'],
    createdAt: '2026-05-12T14:00:00.000Z',
  },
  {
    id: 'task-011',
    title: 'Seed Script for Staging Environment',
    description:
      'Create deterministic database seed script using Faker.js for realistic user, order, and product data. Idempotent and version-tagged.',
    priority: 'low',
    dueDate: '2026-05-28',
    assignee: 'Priya Nair',
    status: 'done',
    tags: ['backend', 'devops'],
    createdAt: '2026-05-08T10:00:00.000Z',
  },
  {
    id: 'task-012',
    title: 'Implement File Upload with Progress Tracking',
    description:
      'Add chunked multipart upload to the document manager. Show real-time progress bar, support resume on failure, and validate MIME types server-side.',
    priority: 'low',
    dueDate: '2026-07-20',
    assignee: 'James Okafor',
    status: 'todo',
    tags: [],
    createdAt: '2026-06-10T09:00:00.000Z',
  },
]
