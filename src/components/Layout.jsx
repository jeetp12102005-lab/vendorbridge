// Layout — Sidebar + Topbar + Notification Drawer + Theme Toggle
import { useState } from 'react';
import S from '../styles/theme';
import { Badge, Btn } from './shared';
import { useTheme } from '../context/ThemeContext';
import { NAV, ROLE_NAV, SEC_LABELS, ROLE_LABELS, ROLE_COLORS, ROLE_ICONS, fmtDT, LOG_ICONS, LOG_COLORS } from '../utils/helpers';

export default function Layout({ user, page, setPage, onLogout, db, children }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const allowed = ROLE_NAV[user.role] || [];
  const visibleNav = NAV.filter(n => allowed.includes(n.id));
  const grouped = {};
  visibleNav.forEach(n => { if (!grouped[n.sec]) grouped[n.sec] = []; grouped[n.sec].push(n); });

  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const pageLabel = NAV.find(n => n.id === page)?.label || 'Dashboard';
  const unread = db.logs.filter(l => l.unread).length;
  const pendingApprovals = db.quotations.filter(q => !db.approvals.find(a => a.quotationId === q.id)).length;

  return (
    <div style={S.appWrap}>

      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside style={S.sidebar}>

        {/* Logo */}
        <div style={S.sidebarLogo}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={S.logoMark}>VB</div>
            <div>
              <div style={S.logoText}>VendorBridge</div>
              <div style={S.logoSub}>ERP · Procurement</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, paddingTop: 6 }}>
          {Object.entries(SEC_LABELS).map(([sec, label]) =>
            grouped[sec] ? (
              <div key={sec} style={S.navSection}>
                <div style={S.navSectionLabel}>{label}</div>
                {grouped[sec].map(n => (
                  <div
                    key={n.id}
                    style={S.navItem(page === n.id)}
                    onClick={() => setPage(n.id)}
                    onMouseEnter={e => {
                      if (page !== n.id) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.82)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (page !== n.id) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.52)';
                      }
                    }}
                  >
                    <span style={S.navIcon}>{n.icon}</span>
                    <span style={{ flex: 1 }}>{n.label}</span>
                    {n.id === 'approvals' && pendingApprovals > 0 && (user.role === 'manager' || user.role === 'admin') && (
                      <span style={{
                        background: 'var(--danger)', color: '#fff',
                        borderRadius: '10px', fontSize: '10px',
                        padding: '1px 6px', fontWeight: 700, minWidth: '18px',
                        textAlign: 'center',
                      }}>
                        {pendingApprovals}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : null
          )}
        </nav>

        {/* Sidebar user */}
        <div style={S.sidebarUser}>
          <div style={S.avatar(32)}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', marginTop: '1px' }}>
              {ROLE_LABELS[user.role]}
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Logout"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '6px', cursor: 'pointer',
              color: 'rgba(255,255,255,0.45)', fontSize: '14px',
              padding: '4px 8px', transition: 'all 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
          >
            ⏻
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────── */}
      <div style={S.mainArea}>

        {/* Topbar */}
        <div style={S.topbar}>
          {/* Page title */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <span style={S.topbarTitle}>{pageLabel}</span>
            <span style={S.topbarSub}>
              {ROLE_ICONS[user.role]}&nbsp;
              <span style={{ color: 'var(--text-secondary)' }}>{user.name}</span>
              &nbsp;·&nbsp;
              <span style={{ color: 'var(--accent)' }}>{ROLE_LABELS[user.role]}</span>
            </span>
          </div>

          {/* Role badge */}
          <Badge type={ROLE_COLORS[user.role]}>{ROLE_LABELS[user.role]}</Badge>

          {/* ── Dark / Light toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Notification bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setNotifOpen(o => !o)}
              style={{
                width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: notifOpen ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                border: `1px solid ${notifOpen ? 'var(--accent-border)' : 'var(--border-strong)'}`,
                borderRadius: '8px', cursor: 'pointer',
                fontSize: '15px', color: notifOpen ? 'var(--accent)' : 'var(--text-muted)',
                transition: 'all 0.15s',
              }}
            >
              🔔
            </button>
            {unread > 0 && <span className="notif-badge">{unread}</span>}
          </div>
        </div>

        {/* Page content */}
        <main style={S.content} className="animate-fade">
          {children}
        </main>
      </div>

      {/* ── Notification Drawer ───────────────────────────── */}
      {notifOpen && (
        <div
          style={{
            position: 'fixed', top: 0, right: 0,
            width: '340px', height: '100vh',
            background: 'var(--bg-surface)',
            borderLeft: '1px solid var(--border)',
            zIndex: 300,
            display: 'flex', flexDirection: 'column',
            boxShadow: 'var(--shadow-lg)',
            animation: 'slideInRight 0.2s ease',
          }}
        >
          {/* Drawer header */}
          <div style={{
            padding: '16px 18px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Activity Feed
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {db.logs.length} recent entries
              </div>
            </div>
            <button
              onClick={() => setNotifOpen(false)}
              style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: '6px', cursor: 'pointer',
                color: 'var(--text-muted)', fontSize: '16px', padding: '3px 9px',
                transition: 'all 0.15s',
              }}
            >
              ×
            </button>
          </div>

          {/* Log entries */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
            {[...db.logs].reverse().slice(0, 25).map(log => {
              const icon = LOG_ICONS[log.type] || LOG_ICONS.default;
              const color = LOG_COLORS[log.type] || LOG_COLORS.default;
              return (
                <div
                  key={log.id}
                  style={{
                    display: 'flex', gap: '10px',
                    padding: '10px 6px',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div style={{
                    width: '30px', height: '30px',
                    borderRadius: '7px',
                    background: color + '16',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', flexShrink: 0,
                    border: `1px solid ${color}28`,
                  }}>
                    {icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '12px', fontWeight: 600,
                      color: 'var(--text-primary)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {log.action}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '1px' }}>
                      {log.detail}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {fmtDT(log.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Click-away overlay for drawer */}
      {notifOpen && (
        <div
          onClick={() => setNotifOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 299 }}
        />
      )}
    </div>
  );
}
