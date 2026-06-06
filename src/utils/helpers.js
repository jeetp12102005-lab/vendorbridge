// VendorBridge ERP — Utility Helpers
export const genId = (prefix = '') =>
  `${prefix}${Date.now()}${Math.random().toString(36).slice(2, 6)}`;

export const today = () => new Date().toISOString().split('T')[0];

export const fmt = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN');

export const fmtNum = (n) =>
  Number(n || 0).toLocaleString('en-IN');

export const fmtD = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  }) : '—';

export const fmtDT = (d) =>
  d ? new Date(d).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }) : '—';

export const pct = (val, total) =>
  total ? Math.round((val / total) * 100) : 0;

export const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

// Role helpers
export const ROLES = ['admin', 'officer', 'manager', 'vendor'];
export const ROLE_LABELS = {
  admin: 'Admin',
  officer: 'Proc. Officer',
  manager: 'Manager',
  vendor: 'Vendor',
};
export const ROLE_COLORS = {
  admin: 'red',
  officer: 'cyan',
  manager: 'amber',
  vendor: 'green',
};
export const ROLE_ICONS = {
  admin: '🛡️',
  officer: '📋',
  manager: '✅',
  vendor: '🏢',
};

// Status badge mapping
export const STATUS_BADGE = {
  open:      'blue',
  quoted:    'amber',
  approved:  'green',
  rejected:  'red',
  closed:    'gray',
  active:    'green',
  inactive:  'gray',
  submitted: 'cyan',
  pending:   'amber',
  paid:      'green',
  draft:     'gray',
};

export const LOG_ICONS = {
  rfq:       '📄',
  vendor:    '🏢',
  quotation: '💬',
  approval:  '✅',
  po:        '📦',
  invoice:   '💳',
  user:      '👤',
  default:   '🔔',
};

export const LOG_COLORS = {
  rfq:       '#3b82f6',
  vendor:    '#8b5cf6',
  quotation: '#06b6d4',
  approval:  '#10b981',
  po:        '#f59e0b',
  invoice:   '#ef4444',
  user:      '#94a3b8',
  default:   '#3b82f6',
};

// Nav config per role
export const NAV = [
  { id: 'dashboard',  label: 'Dashboard',           icon: '⊞', sec: 'main' },
  { id: 'vendors',    label: 'Vendor Management',    icon: '🏢', sec: 'procurement' },
  { id: 'rfq',        label: 'RFQ Management',       icon: '📄', sec: 'procurement' },
  { id: 'quotations', label: 'Quotations',           icon: '💬', sec: 'procurement' },
  { id: 'compare',    label: 'Compare Quotes',       icon: '⚖',  sec: 'procurement' },
  { id: 'approvals',  label: 'Approvals',            icon: '✅', sec: 'workflow' },
  { id: 'po',         label: 'Purchase Orders',      icon: '📦', sec: 'workflow' },
  { id: 'invoices',   label: 'Invoices',             icon: '💳', sec: 'workflow' },
  { id: 'reports',    label: 'Reports & Analytics',  icon: '📊', sec: 'analytics' },
  { id: 'logs',       label: 'Activity Logs',        icon: '🗒️', sec: 'analytics' },
  { id: 'users',      label: 'User Management',      icon: '👥', sec: 'admin' },
];

export const ROLE_NAV = {
  admin:   ['dashboard','vendors','rfq','quotations','compare','approvals','po','invoices','reports','logs','users'],
  officer: ['dashboard','vendors','rfq','quotations','compare','po','invoices','logs'],
  manager: ['dashboard','approvals','rfq','quotations','compare','reports','logs'],
  vendor:  ['dashboard','rfq','quotations','po','logs'],
};

export const SEC_LABELS = {
  main:        'Overview',
  procurement: 'Procurement',
  workflow:    'Workflow',
  analytics:   'Analytics',
  admin:       'Administration',
};

// Vendor categories
export const VENDOR_CATEGORIES = [
  'Electronics', 'Office Supplies', 'Construction', 'Food & Beverage',
  'IT Services', 'Logistics', 'Healthcare', 'Consulting', 'Other',
];

// Stars display
export const stars = (n = 0) =>
  '★'.repeat(Math.round(n)) + '☆'.repeat(Math.max(0, 5 - Math.round(n)));

// CSV export helper
export const exportCSV = (rows, filename) => {
  const keys = Object.keys(rows[0] || {});
  const csv = [keys.join(','), ...rows.map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};
