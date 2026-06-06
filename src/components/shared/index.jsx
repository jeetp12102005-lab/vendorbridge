// Shared UI Components — VendorBridge ERP
// All colors use CSS custom properties for dark/light theme support
import S from '../../styles/theme';

// ── Badge ──────────────────────────────────────────────────────────
export const Badge = ({ type = 'gray', children, dot }) => (
  <span style={S.badge(type)}>
    {dot && <span className="status-dot" style={{ background: S.badge(type).color, width: 6, height: 6 }} />}
    {children}
  </span>
);

// ── Button ─────────────────────────────────────────────────────────
export const Btn = ({ type = 'primary', sm, onClick, children, disabled, title, style = {} }) => (
  <button
    title={title}
    style={{
      ...(sm ? S.btnSm(type) : S.btn(type)),
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      ...style,
    }}
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

// ── Modal ──────────────────────────────────────────────────────────
export const Modal = ({ onClose, size = 'md', title, subtitle, children }) => {
  const sizeMap = { sm: S.modal, md: S.modal, lg: S.modalLg, xl: S.modalXl };
  return (
    <div style={S.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={sizeMap[size] || S.modal}>
        <div style={S.modalHeader}>
          <div>
            <div style={S.modalTitle}>{title}</div>
            {subtitle && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>{subtitle}</div>}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: '6px', cursor: 'pointer',
              fontSize: '17px', color: 'var(--text-muted)',
              padding: '2px 9px', lineHeight: 1.4,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
          >×</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ── Alert ──────────────────────────────────────────────────────────
export const Alert = ({ type = 'success', msg }) => {
  if (!msg) return null;
  const icons = { success: '✓', danger: '✕', info: 'ℹ', warning: '⚠' };
  return (
    <div style={S.alert(type)}>
      <span style={{ fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>{icons[type] || 'ℹ'}</span>
      {msg}
    </div>
  );
};

// ── Form Field wrapper ─────────────────────────────────────────────
export const Field = ({ label, children, hint }) => (
  <div style={S.formGroup}>
    {label && <label style={S.label}>{label}</label>}
    {children}
    {hint && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{hint}</div>}
  </div>
);

// ── Input ──────────────────────────────────────────────────────────
export const Input = ({ style: extraStyle = {}, ...props }) => (
  <input
    style={{ ...S.input, ...extraStyle }}
    {...props}
    onFocus={e => {
      e.target.style.borderColor = 'var(--border-focus)';
      e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)';
    }}
    onBlur={e => {
      e.target.style.borderColor = 'var(--border-strong)';
      e.target.style.boxShadow = 'none';
    }}
  />
);

// ── Select ─────────────────────────────────────────────────────────
export const Select = ({ children, style: extraStyle = {}, ...props }) => (
  <select style={{ ...S.select, ...extraStyle }} {...props}>
    {children}
  </select>
);

// ── Textarea ───────────────────────────────────────────────────────
export const Textarea = ({ style: extraStyle = {}, ...props }) => (
  <textarea
    style={{ ...S.textarea, ...extraStyle }}
    {...props}
    onFocus={e => {
      e.target.style.borderColor = 'var(--border-focus)';
      e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)';
    }}
    onBlur={e => {
      e.target.style.borderColor = 'var(--border-strong)';
      e.target.style.boxShadow = 'none';
    }}
  />
);

// ── Table ──────────────────────────────────────────────────────────
export const Table = ({ heads, rows, emptyMsg = 'No data found' }) => (
  <div style={S.tableWrap}>
    <table style={S.table}>
      <thead>
        <tr>{heads.map((h, i) => <th key={i} style={S.th}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.length === 0
          ? <tr><td colSpan={heads.length} style={{ ...S.td, textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>{emptyMsg}</td></tr>
          : rows}
      </tbody>
    </table>
  </div>
);

// ── Card ───────────────────────────────────────────────────────────
export const Card = ({ children, style: extra = {}, onClick }) => (
  <div
    style={{ ...S.card, ...extra }}
    onClick={onClick}
    onMouseEnter={onClick ? e => {
      e.currentTarget.style.borderColor = 'var(--accent-border)';
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
    } : undefined}
    onMouseLeave={onClick ? e => {
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
    } : undefined}
  >
    {children}
  </div>
);

// ── SVG Bar Chart ──────────────────────────────────────────────────
export const BarChart = ({ data = [], height = 160, keyField = 'month', valueField = 'amount', color = 'var(--accent)' }) => {
  const max = Math.max(...data.map(d => d[valueField]), 1);
  return (
    <div style={{ position: 'relative', height }}>
      <svg viewBox={`0 0 ${data.length * 50} ${height}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {data.map((d, i) => {
          const barH = (d[valueField] / max) * (height - 30);
          const x = i * 50 + 5;
          const y = height - barH - 20;
          return (
            <g key={i}>
              <rect x={x} y={y} width={40} height={barH} rx={4} fill="url(#barGrad)" />
              <text x={x + 20} y={height - 4} textAnchor="middle" fontSize="10" fill="#888888" fontFamily="Inter">{d[keyField]}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ── Stat Card ──────────────────────────────────────────────────────
export const StatCard = ({ label, value, sub, icon, color = 'var(--accent)', trend }) => (
  <div
    style={S.statCard(color)}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      e.currentTarget.style.transform = 'translateY(-1px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    {/* Left color stripe instead of top glow */}
    <div style={S.statStripe(color)} />

    <div style={{ paddingLeft: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={S.statLabel}>{label}</div>
          <div style={{
            ...S.statValue,
            fontSize: typeof value === 'string' && value.length > 8 ? '18px' : '26px',
          }}>
            {value}
          </div>
          {sub && <div style={S.statSub}>{sub}</div>}
          {trend !== undefined && (
            <div style={{
              fontSize: '11px',
              color: trend >= 0 ? 'var(--success)' : 'var(--danger)',
              marginTop: '6px', fontWeight: 600,
            }}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
            </div>
          )}
        </div>
        {icon && <div style={S.statIcon(color)}>{icon}</div>}
      </div>
    </div>
  </div>
);

// ── Empty state ────────────────────────────────────────────────────
export const EmptyState = ({ icon = '📭', title = 'Nothing here yet', desc }) => (
  <div style={S.emptyState}>
    <div style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.6 }}>{icon}</div>
    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>{title}</div>
    {desc && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{desc}</div>}
  </div>
);

// ── Progress bar ───────────────────────────────────────────────────
export const ProgressBar = ({ value, max, color = 'var(--accent)' }) => {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
        <span>{pct}%</span>
      </div>
      <div style={{ background: 'var(--bg-elevated)', borderRadius: '4px', height: '6px', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div style={{ width: `${pct}%`, background: color, height: '100%', borderRadius: '4px', transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
};

// ── Section header ─────────────────────────────────────────────────
export const SectionHeader = ({ title, subtitle, action }) => (
  <div style={S.pageHeader}>
    <div>
      <div style={S.pageTitle}>{title}</div>
      {subtitle && <div style={S.pageSubtitle}>{subtitle}</div>}
    </div>
    {action}
  </div>
);

// ── Search input ───────────────────────────────────────────────────
export const SearchInput = ({ value, onChange, placeholder = 'Search...' }) => (
  <div style={{ position: 'relative' }}>
    <span style={{
      position: 'absolute', left: '11px', top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--text-muted)', fontSize: '13px',
      pointerEvents: 'none',
    }}>🔍</span>
    <Input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ paddingLeft: '34px' }}
    />
  </div>
);
