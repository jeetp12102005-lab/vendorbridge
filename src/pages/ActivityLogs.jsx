// Activity Logs — Audit timeline with filters
import { useState } from 'react';
import S from '../styles/theme';
import { Badge, Table, SectionHeader, SearchInput } from '../components/shared';
import { fmtDT, LOG_ICONS, LOG_COLORS, exportCSV } from '../utils/helpers';

const TYPE_OPTIONS = ['all', 'rfq', 'vendor', 'quotation', 'approval', 'po', 'invoice', 'user'];
const TYPE_LABELS = { all: 'All Events', rfq: 'RFQ', vendor: 'Vendor', quotation: 'Quotation', approval: 'Approval', po: 'Purchase Order', invoice: 'Invoice', user: 'User' };

export default function ActivityLogs({ db, user }) {
  const [search,     setSearch]     = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode,   setViewMode]   = useState('timeline'); // 'timeline' | 'table'

  const isVendor = user.role === 'vendor';
  const allLogs  = isVendor
    ? db.logs.filter(l => l.userId === user.id)
    : db.logs;

  const filtered = [...allLogs].reverse().filter(l => {
    const matchSearch = l.action.toLowerCase().includes(search.toLowerCase()) || l.detail.toLowerCase().includes(search.toLowerCase());
    const matchType   = filterType === 'all' || l.type === filterType;
    return matchSearch && matchType;
  });

  const uById = id => db.users.find(u => u.id === id);

  const handleExport = () => {
    exportCSV(filtered.map(l => ({
      ID:        l.id,
      Action:    l.action,
      Detail:    l.detail,
      Type:      l.type,
      User:      uById(l.userId)?.name || l.userId,
      Timestamp: l.timestamp,
    })), 'vendorbridge_activity_logs.csv');
  };

  return (
    <div className="animate-fade">
      <SectionHeader
        title="Activity Logs"
        subtitle={`${filtered.length} events · Full audit trail`}
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setViewMode(v => v === 'timeline' ? 'table' : 'timeline')}
              style={{ ...S.btn('ghost'), padding: '8px 14px', fontSize: 13 }}>
              {viewMode === 'timeline' ? '⊞ Table View' : '⏱ Timeline View'}
            </button>
            {!isVendor && (
              <button onClick={handleExport} style={{ ...S.btn('outline'), padding: '8px 14px', fontSize: 13 }}>
                📥 Export CSV
              </button>
            )}
          </div>
        }
      />

      {/* Filters */}
      <div style={{ ...S.card, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <SearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Search actions or details..." />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {TYPE_OPTIONS.map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${filterType === t ? (LOG_COLORS[t] || '#3b82f6') + '60' : 'rgba(255,255,255,0.08)'}`, background: filterType === t ? `${LOG_COLORS[t] || '#3b82f6'}18` : 'transparent', color: filterType === t ? LOG_COLORS[t] || '#60a5fa' : '#475569', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.15s' }}>
              {LOG_ICONS[t] || '🔔'} {TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {TYPE_OPTIONS.slice(1).map(t => {
          const count = allLogs.filter(l => l.type === t).length;
          if (!count) return null;
          return (
            <div key={t} onClick={() => setFilterType(t)}
              style={{ background: '#0f1629', border: `1px solid ${LOG_COLORS[t] || '#3b82f6'}30`, borderRadius: 10, padding: '8px 14px', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8 }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${LOG_COLORS[t] || '#3b82f6'}60`}
              onMouseLeave={e => e.currentTarget.style.borderColor = `${LOG_COLORS[t] || '#3b82f6'}30`}>
              <span style={{ fontSize: 16 }}>{LOG_ICONS[t]}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: LOG_COLORS[t] || '#60a5fa' }}>{count}</div>
                <div style={{ fontSize: 10, color: '#475569' }}>{TYPE_LABELS[t]}</div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '56px 24px', color: '#334155' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🗒️</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#475569' }}>No matching logs</div>
        </div>
      )}

      {/* ── TIMELINE VIEW */}
      {viewMode === 'timeline' && filtered.length > 0 && (
        <div style={S.card}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {filtered.map((log, idx) => {
              const icon  = LOG_ICONS[log.type]  || LOG_ICONS.default;
              const color = LOG_COLORS[log.type] || LOG_COLORS.default;
              const u     = uById(log.userId);
              return (
                <li key={log.id} style={{ display: 'flex', gap: 14, paddingBottom: 20, position: 'relative' }}>
                  {/* Connector line */}
                  {idx < filtered.length - 1 && (
                    <div style={{ position: 'absolute', left: 16, top: 36, bottom: 0, width: 2, background: 'rgba(255,255,255,0.04)' }} />
                  )}
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 15, color, boxShadow: `0 0 10px ${color}25`, zIndex: 1 }}>
                    {icon}
                  </div>
                  <div style={{ flex: 1, paddingTop: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 13.5, color: '#e2e8f0' }}>{log.action}</span>
                      <Badge type="gray" style={{ fontSize: 10 }}>{log.type}</Badge>
                      {u && <span style={{ fontSize: 11, color: '#334155' }}>by {u.name}</span>}
                    </div>
                    <div style={{ color: '#64748b', fontSize: 12.5, marginBottom: 4 }}>{log.detail}</div>
                    <div style={{ color: '#2d3f5c', fontSize: 11 }}>🕐 {fmtDT(log.timestamp)}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ── TABLE VIEW */}
      {viewMode === 'table' && filtered.length > 0 && (
        <div style={S.card}>
          <Table
            heads={['Action', 'Detail', 'Type', 'User', 'Timestamp']}
            rows={filtered.map(log => {
              const icon  = LOG_ICONS[log.type]  || '🔔';
              const color = LOG_COLORS[log.type] || '#3b82f6';
              const u     = uById(log.userId);
              return (
                <tr key={log.id} className="table-row-hover">
                  <td style={S.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 15 }}>{icon}</span>
                      <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{log.action}</span>
                    </div>
                  </td>
                  <td style={{ ...S.td, color: '#64748b', maxWidth: 280 }}>{log.detail}</td>
                  <td style={S.td}>
                    <span style={{ background: `${color}18`, color, border: `1px solid ${color}35`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>
                      {log.type || 'event'}
                    </span>
                  </td>
                  <td style={S.td}><div style={{ fontSize: 12.5 }}>{u?.name || '—'}</div><div style={{ fontSize: 10, color: '#334155' }}>{u?.role}</div></td>
                  <td style={{ ...S.td, fontSize: 12, color: '#475569' }}>{fmtDT(log.timestamp)}</td>
                </tr>
              );
            })}
          />
        </div>
      )}
    </div>
  );
}
