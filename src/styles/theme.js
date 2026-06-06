// VendorBridge ERP — Theme Style Constants
// Uses CSS custom properties so light/dark switching works automatically.
// All color values reference CSS vars set in index.css.

export const S = {

  // ── App layout ─────────────────────────────────────────────────────
  appWrap: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg-page)',
  },

  // ── Sidebar ────────────────────────────────────────────────────────
  sidebar: {
    width: '256px',
    background: 'var(--bg-sidebar)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0, left: 0,
    height: '100vh',
    zIndex: 100,
    overflowY: 'auto',
    borderRight: '1px solid rgba(255,255,255,0.05)',
  },
  sidebarLogo: {
    padding: '20px 18px 18px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  logoMark: {
    width: '30px', height: '30px',
    borderRadius: '7px',
    background: 'var(--accent)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', fontWeight: 800, color: '#fff',
    marginBottom: '10px',
    letterSpacing: '-0.5px',
    flexShrink: 0,
  },
  logoText: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: '-0.3px',
    lineHeight: 1.2,
  },
  logoSub: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.35)',
    fontWeight: 500,
    marginTop: '2px',
    letterSpacing: '0.3px',
  },
  navSection: { padding: '8px 0 4px' },
  navSectionLabel: {
    padding: '0 14px 5px',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '1.2px',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.22)',
  },
  navItem: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '8px 14px',
    margin: '1px 8px',
    borderRadius: '7px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: active ? 600 : 400,
    color: active ? '#ffffff' : 'rgba(255,255,255,0.52)',
    background: active ? 'rgba(59,130,246,0.22)' : 'transparent',
    borderLeft: active ? '3px solid var(--accent-sidebar)' : '3px solid transparent',
    transition: 'all 0.13s ease',
  }),
  navIcon: { width: '15px', textAlign: 'center', fontSize: '13px', flexShrink: 0 },
  sidebarUser: {
    padding: '12px 14px',
    marginTop: 'auto',
    borderTop: '1px solid rgba(255,255,255,0.07)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: (size = 32) => ({
    width: size, height: size,
    borderRadius: '7px',
    background: 'var(--accent)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: Math.round(size * 0.36),
    fontWeight: 700,
    color: '#fff',
    flexShrink: 0,
    letterSpacing: '-0.5px',
    textTransform: 'uppercase',
  }),

  // ── Main area ──────────────────────────────────────────────────────
  mainArea: {
    marginLeft: '256px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    background: 'var(--bg-page)',
  },

  // ── Topbar ─────────────────────────────────────────────────────────
  topbar: {
    height: '60px',
    background: 'var(--bg-surface)',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    gap: '12px',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    boxShadow: 'var(--shadow-xs)',
  },
  topbarTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.2px',
  },
  topbarSub: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: 400,
    marginTop: '1px',
  },

  // ── Page content ───────────────────────────────────────────────────
  content: { padding: '24px', flex: 1 },

  // ── Page header ────────────────────────────────────────────────────
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  pageTitle: {
    fontSize: '20px',
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: '-0.5px',
    lineHeight: 1.2,
  },
  pageSubtitle: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginTop: '4px',
    fontWeight: 400,
  },

  // ── Cards ──────────────────────────────────────────────────────────
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: 'var(--shadow-sm)',
  },
  cardHover: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '16px',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-sm)',
    transition: 'box-shadow 0.18s ease, border-color 0.18s ease',
  },
  cardSm: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '14px 16px',
    boxShadow: 'var(--shadow-xs)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid var(--border)',
  },
  cardTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '0.1px',
  },

  // ── Stat cards ─────────────────────────────────────────────────────
  statCard: () => ({
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '18px 20px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
  }),
  statStripe: (color) => ({
    position: 'absolute',
    top: 0, left: 0, bottom: 0,
    width: '3px',
    background: color,
    borderRadius: '10px 0 0 10px',
  }),
  statIcon: (color) => ({
    width: '38px', height: '38px',
    borderRadius: '8px',
    background: color + '14',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px',
    marginBottom: '12px',
  }),
  statLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    marginBottom: '5px',
  },
  statValue: {
    fontSize: '26px',
    fontWeight: 800,
    color: 'var(--text-primary)',
    lineHeight: 1.1,
    letterSpacing: '-0.5px',
  },
  statSub: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '5px',
  },

  // ── Table ──────────────────────────────────────────────────────────
  tableWrap: { overflowX: 'auto' },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  th: {
    textAlign: 'left',
    padding: '9px 14px',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.7px',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    background: 'var(--bg-elevated)',
    borderBottom: '1px solid var(--border)',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '11px 14px',
    borderBottom: '1px solid var(--border)',
    verticalAlign: 'middle',
    color: 'var(--text-primary)',
    fontSize: '13px',
  },

  // ── Badges ─────────────────────────────────────────────────────────
  badge: (type) => {
    const map = {
      blue:   { bg: 'var(--accent-dim)',    color: 'var(--accent)',   border: 'var(--accent-border)' },
      cyan:   { bg: 'var(--info-bg)',       color: 'var(--info)',     border: 'var(--info-border)' },
      green:  { bg: 'var(--success-bg)',    color: 'var(--success)',  border: 'var(--success-border)' },
      amber:  { bg: 'var(--warning-bg)',    color: 'var(--warning)',  border: 'var(--warning-border)' },
      red:    { bg: 'var(--danger-bg)',     color: 'var(--danger)',   border: 'var(--danger-border)' },
      purple: { bg: 'var(--purple-bg)',     color: 'var(--purple)',   border: 'var(--purple-border)' },
      gray:   { bg: 'var(--bg-elevated)',   color: 'var(--text-secondary)', border: 'var(--border-strong)' },
    };
    const c = map[type] || map.gray;
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '2px 8px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 600,
      whiteSpace: 'nowrap',
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      letterSpacing: '0.2px',
    };
  },

  // ── Buttons ────────────────────────────────────────────────────────
  btn: (type = 'primary') => {
    const map = {
      primary: {
        background: 'var(--accent)',
        color: 'var(--text-on-accent)',
        border: 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      },
      success: {
        background: 'var(--success)',
        color: '#fff',
        border: 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      },
      danger: {
        background: 'var(--danger)',
        color: '#fff',
        border: 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      },
      outline: {
        background: 'transparent',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-strong)',
        boxShadow: 'none',
      },
      ghost: {
        background: 'var(--bg-elevated)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border)',
        boxShadow: 'none',
      },
      cyan: {
        background: 'var(--info)',
        color: '#fff',
        border: 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      },
    };
    const c = map[type] || map.primary;
    return {
      ...c,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      padding: '8px 16px',
      borderRadius: '7px',
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: 'inherit',
      transition: 'all 0.15s ease',
      letterSpacing: '0.1px',
      whiteSpace: 'nowrap',
    };
  },
  btnSm: (type = 'outline') => {
    const full = S.btn(type);
    return { ...full, padding: '5px 11px', fontSize: '12px', borderRadius: '6px' };
  },

  // ── Forms ──────────────────────────────────────────────────────────
  formGroup: { marginBottom: '14px' },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '5px',
    letterSpacing: '0.1px',
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-strong)',
    borderRadius: '7px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  select: {
    width: '100%',
    padding: '9px 12px',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-strong)',
    borderRadius: '7px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    padding: '9px 12px',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-strong)',
    borderRadius: '7px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: '80px',
  },
  formRow:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  formRow3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' },

  // ── Modal ──────────────────────────────────────────────────────────
  overlay: {
    position: 'fixed', inset: 0,
    background: 'var(--bg-overlay)',
    backdropFilter: 'blur(3px)',
    zIndex: 200,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px',
    animation: 'fadeIn 0.15s ease',
  },
  modal: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '24px',
    width: '100%', maxWidth: '560px',
    maxHeight: '90vh', overflowY: 'auto',
    boxShadow: 'var(--shadow-xl)',
    animation: 'fadeIn 0.2s ease',
  },
  modalLg: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '24px',
    width: '100%', maxWidth: '760px',
    maxHeight: '90vh', overflowY: 'auto',
    boxShadow: 'var(--shadow-xl)',
    animation: 'fadeIn 0.2s ease',
  },
  modalXl: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '24px',
    width: '100%', maxWidth: '960px',
    maxHeight: '90vh', overflowY: 'auto',
    boxShadow: 'var(--shadow-xl)',
    animation: 'fadeIn 0.2s ease',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '20px',
    paddingBottom: '14px',
    borderBottom: '1px solid var(--border)',
  },
  modalTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.2px',
  },

  // ── Alerts ─────────────────────────────────────────────────────────
  alert: (type) => {
    const map = {
      success: { bg: 'var(--success-bg)', color: 'var(--success)', border: 'var(--success-border)' },
      danger:  { bg: 'var(--danger-bg)',  color: 'var(--danger)',  border: 'var(--danger-border)' },
      info:    { bg: 'var(--accent-dim)', color: 'var(--accent)',  border: 'var(--accent-border)' },
      warning: { bg: 'var(--warning-bg)', color: 'var(--warning)', border: 'var(--warning-border)' },
    };
    const c = map[type] || map.info;
    return {
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      padding: '10px 14px',
      borderRadius: '7px',
      fontSize: '13px',
      fontWeight: 500,
      marginBottom: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      lineHeight: 1.5,
    };
  },

  // ── Misc helpers ───────────────────────────────────────────────────
  row:     { display: 'flex', alignItems: 'center', gap: '10px' },
  between: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  center:  { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  col:     { display: 'flex', flexDirection: 'column', gap: '8px' },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: 'var(--text-muted)',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid var(--border)',
    margin: '16px 0',
  },
  timeline: { listStyle: 'none', padding: 0 },
  tlItem: {
    display: 'flex', gap: '12px',
    paddingBottom: '18px',
    position: 'relative',
  },
  tlDot: (color = 'var(--accent)') => ({
    width: '32px', height: '32px',
    borderRadius: '8px',
    background: color + '18',
    border: `1px solid ${color}30`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
    fontSize: '13px',
    color,
  }),

  // ── Auth page ──────────────────────────────────────────────────────
  authPage: {
    minHeight: '100vh',
    background: 'var(--bg-page)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  authCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '14px',
    padding: '36px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: 'var(--shadow-lg)',
    position: 'relative',
    zIndex: 2,
  },
};

export default S;
