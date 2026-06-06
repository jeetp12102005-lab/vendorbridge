// Dashboard — Role-aware stats and quick actions
import { useState } from 'react';
import S from '../styles/theme';
import { Badge, StatCard, Table, Btn, EmptyState, BarChart } from '../components/shared';
import { fmt, fmtD, fmtDT, ROLE_LABELS, ROLE_ICONS, LOG_ICONS, LOG_COLORS } from '../utils/helpers';

export default function Dashboard({ db, setDb, user, setPage }) {
  const vById = id => db.vendors.find(v => v.id === id);
  const rById = id => db.rfqs.find(r => r.id === id);

  // ── Role: admin / officer / manager
  const isAdmin = user.role === 'admin';
  const isOfficer = user.role === 'officer';
  const isManager = user.role === 'manager';
  const isVendor = user.role === 'vendor';

  const activeRFQs = db.rfqs.filter(r => r.status === 'open' || r.status === 'quoted').length;
  const pendingApprovals = db.quotations.filter(q => !db.approvals.find(a => a.quotationId === q.id)).length;
  const activeVendors = db.vendors.filter(v => v.status === 'active').length;
  const totalSpend = db.invoices.reduce((s, i) => s + i.grandTotal, 0);
  const paidInvoices = db.invoices.filter(i => i.status === 'paid').length;
  const pendingInvoices = db.invoices.filter(i => i.status !== 'paid').length;

  // Vendor-specific
  const myRFQs = isVendor ? db.rfqs.filter(r => r.assignedVendors.includes(user.vendorId)) : [];
  const myQuotes = isVendor ? db.quotations.filter(q => q.vendorId === user.vendorId) : [];
  const myInvoices = isVendor ? db.invoices.filter(inv => inv.vendorId === user.vendorId) : [];

  // Quick actions per role
  const QUICK_ACTIONS = {
    admin: [
      { label: 'Manage Vendors', icon: '🏢', page: 'vendors', color: '#8b5cf6' },
      { label: 'View Reports', icon: '📊', page: 'reports', color: '#3b82f6' },
      { label: 'Manage Users', icon: '👥', page: 'users', color: '#06b6d4' },
      { label: 'Activity Logs', icon: '🗒️', page: 'logs', color: '#f59e0b' },
    ],
    officer: [
      { label: 'Create RFQ', icon: '📄', page: 'rfq', color: '#3b82f6' },
      { label: 'Compare Quotes', icon: '⚖', page: 'compare', color: '#8b5cf6' },
      { label: 'Purchase Orders', icon: '📦', page: 'po', color: '#10b981' },
      { label: 'Invoices', icon: '💳', page: 'invoices', color: '#f59e0b' },
    ],
    manager: [
      { label: 'Pending Approvals', icon: '✅', page: 'approvals', color: '#10b981' },
      { label: 'View Reports', icon: '📊', page: 'reports', color: '#3b82f6' },
      { label: 'View Quotations', icon: '💬', page: 'quotations', color: '#8b5cf6' },
      { label: 'Activity Logs', icon: '🗒️', page: 'logs', color: '#f59e0b' },
    ],
    vendor: [
      { label: 'My RFQs', icon: '📄', page: 'rfq', color: '#3b82f6' },
      { label: 'Submit Quote', icon: '💬', page: 'quotations', color: '#06b6d4' },
      { label: 'My Orders', icon: '📦', page: 'po', color: '#10b981' },
      { label: 'My Invoices', icon: '💳', page: 'invoices', color: '#f59e0b' },
    ],
  };

  const actions = QUICK_ACTIONS[user.role] || [];

  return (
    <div className="animate-fade">
      {/* Welcome banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(30,64,175,0.3) 0%, rgba(30,64,175,0.1) 50%, rgba(139,92,246,0.1) 100%)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 16, padding: '20px 24px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '40%', background: 'radial-gradient(circle at center, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: 13, color: '#60a5fa', fontWeight: 500, marginBottom: 4, letterSpacing: 0.5 }}>
          {ROLE_ICONS[user.role]} {ROLE_LABELS[user.role]} Portal
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px' }}>
          Good {getGreeting()}, {user.name.split(' ')[0]}! 👋
        </div>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
          {isVendor
            ? `You have ${myRFQs.filter(r => r.status === 'open').length} open RFQs awaiting your quotation.`
            : isManager
            ? `There are ${pendingApprovals} quotations pending your review.`
            : `${activeRFQs} active RFQs in the procurement pipeline.`}
        </div>
      </div>

      {/* ── STATS */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {isVendor ? (
          <>
            <StatCard label="Assigned RFQs" value={myRFQs.length} sub="Active requests" icon="📄" color="#3b82f6" />
            <StatCard label="My Quotations" value={myQuotes.length} sub="Submitted quotes" icon="💬" color="#06b6d4" />
            <StatCard label="My Invoices" value={myInvoices.length} sub="Total invoices" icon="💳" color="#8b5cf6" />
            <StatCard label="Pending Payment" value={fmt(myInvoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.grandTotal, 0))} sub={`${myInvoices.filter(i => i.status === 'pending').length} invoices`} icon="⏳" color="#f59e0b" />
          </>
        ) : (
          <>
            <StatCard label="Active RFQs" value={activeRFQs} sub="Open & quoted" icon="📄" color="#3b82f6" trend={12} />
            <StatCard label="Pending Approvals" value={pendingApprovals} sub="Awaiting review" icon="⏳" color="#f59e0b" />
            {(isAdmin || isOfficer) && <StatCard label="Active Vendors" value={activeVendors} sub={`of ${db.vendors.length} total`} icon="🏢" color="#8b5cf6" />}
            {isManager && <StatCard label="Total Quotations" value={db.quotations.length} sub="All submissions" icon="💬" color="#06b6d4" />}
            <StatCard label="Total Spend" value={fmt(totalSpend)} sub={`${db.invoices.length} invoices`} icon="💰" color="#10b981" trend={8} />
          </>
        )}
      </div>

      {/* ── Quick Actions */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Quick Actions</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {actions.map(a => (
            <button
              key={a.label}
              onClick={() => setPage(a.page)}
              style={{ background: `${a.color}15`, border: `1px solid ${a.color}30`, borderRadius: 10, padding: '12px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600, color: '#e2e8f0', fontFamily: 'inherit', transition: 'all 0.15s', minWidth: 160 }}
              onMouseEnter={e => { e.currentTarget.style.background = `${a.color}25`; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 4px 12px ${a.color}20`; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${a.color}15`; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <span style={{ fontSize: 18 }}>{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Bottom Grid */}
      <div className="grid-2">
        {/* Recent POs */}
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={S.cardTitle}>Recent Purchase Orders</div>
            <button onClick={() => setPage('po')} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>View all →</button>
          </div>
          {db.purchaseOrders.length === 0 ? <EmptyState icon="📦" title="No purchase orders yet" /> : (
            <Table
              heads={['PO #', 'Vendor', 'Total', 'Status']}
              rows={[...db.purchaseOrders].reverse().slice(0, 4).map(po => (
                <tr key={po.id} className="table-row-hover" onClick={() => setPage('po')}>
                  <td style={{ ...S.td, color: '#60a5fa', fontWeight: 700, fontFamily: 'monospace', fontSize: 12 }}>{po.poNumber}</td>
                  <td style={S.td}>{vById(po.vendorId)?.name}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>{fmt(po.grandTotal)}</td>
                  <td style={S.td}><Badge type="green" dot>{po.status}</Badge></td>
                </tr>
              ))}
            />
          )}
        </div>

        {/* Recent Invoices */}
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={S.cardTitle}>Recent Invoices</div>
            <button onClick={() => setPage('invoices')} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>View all →</button>
          </div>
          {db.invoices.length === 0 ? <EmptyState icon="💳" title="No invoices yet" /> : (
            <Table
              heads={['Invoice #', 'Amount', 'Due', 'Status']}
              rows={[...db.invoices].reverse().slice(0, 4).map(inv => (
                <tr key={inv.id} className="table-row-hover" onClick={() => setPage('invoices')}>
                  <td style={{ ...S.td, color: '#60a5fa', fontWeight: 700, fontFamily: 'monospace', fontSize: 12 }}>{inv.invoiceNumber}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>{fmt(inv.grandTotal)}</td>
                  <td style={S.td}>{fmtD(inv.dueDate)}</td>
                  <td style={S.td}><Badge type={inv.status === 'paid' ? 'green' : 'amber'}>{inv.status}</Badge></td>
                </tr>
              ))}
            />
          )}
        </div>
      </div>

      {/* ── Activity Feed + Chart */}
      <div className="grid-2" style={{ marginTop: 0 }}>
        {/* Activity Timeline */}
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={S.cardTitle}>Recent Activity</div>
            <button onClick={() => setPage('logs')} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>View all →</button>
          </div>
          <ul style={S.timeline}>
            {[...db.logs].reverse().slice(0, 5).map(log => {
              const icon = LOG_ICONS[log.type] || LOG_ICONS.default;
              const color = LOG_COLORS[log.type] || LOG_COLORS.default;
              return (
                <li key={log.id} style={S.tlItem}>
                  <div style={S.tlDot(color)}>{icon}</div>
                  <div style={{ flex: 1, paddingTop: 2 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: '#e2e8f0' }}>{log.action}</div>
                    <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{log.detail}</div>
                    <div style={{ color: '#334155', fontSize: 11, marginTop: 3 }}>{fmtDT(log.timestamp)}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Spend Chart */}
        {!isVendor && (
          <div style={S.card}>
            <div style={S.cardHeader}>
              <div style={S.cardTitle}>Monthly Spend Trend</div>
              <Badge type="cyan">2025</Badge>
            </div>
            <BarChart data={db.monthlySpend} keyField="month" valueField="amount" color="#3b82f6" height={160} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, padding: '10px 0 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 12, color: '#475569' }}>Total YTD</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#60a5fa' }}>{fmt(db.monthlySpend.reduce((s, m) => s + m.amount, 0))}</div>
            </div>
          </div>
        )}

        {isVendor && (
          <div style={S.card}>
            <div style={S.cardHeader}><div style={S.cardTitle}>My RFQ Status</div></div>
            {myRFQs.length === 0 ? <EmptyState icon="📄" title="No RFQs assigned yet" /> : (
              <Table
                heads={['RFQ', 'Deadline', 'Status']}
                rows={myRFQs.slice(0, 5).map(r => (
                  <tr key={r.id} className="table-row-hover">
                    <td style={{ ...S.td, fontWeight: 600 }}>{r.title}</td>
                    <td style={S.td}>{fmtD(r.deadline)}</td>
                    <td style={S.td}><Badge type={r.status === 'open' ? 'blue' : r.status === 'quoted' ? 'amber' : 'green'}>{r.status}</Badge></td>
                  </tr>
                ))}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}
