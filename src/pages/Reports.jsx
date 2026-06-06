// Reports & Analytics — KPIs, bar charts, vendor performance
import { useState } from 'react';
import S from '../styles/theme';
import { Badge, Btn, Table, SectionHeader, BarChart, StatCard, ProgressBar } from '../components/shared';
import { fmt, fmtD, stars, exportCSV } from '../utils/helpers';

export default function Reports({ db }) {
  const [activeTab, setActiveTab] = useState('overview');

  const vById = id => db.vendors.find(v => v.id === id);

  // ── Aggregate metrics
  const allInvoices   = db.invoices || [];
  const totalSpend    = allInvoices.reduce((s, i) => s + i.grandTotal, 0);
  const paid          = allInvoices.filter(i => i.status === 'paid');
  const pending       = allInvoices.filter(i => i.status === 'pending');
  const overdue       = allInvoices.filter(i => i.status === 'overdue');
  const approvedCount = (db.approvals || []).filter(a => a.status === 'approved').length;
  const rejectedCount = (db.approvals || []).filter(a => a.status === 'rejected').length;
  const pendingApprovalCount = (db.approvals || []).filter(a => a.status === 'pending').length;
  const approvalRate  = db.approvals?.length ? Math.round((approvedCount / db.approvals.length) * 100) : 0;

  // ── Spend by vendor (from invoices)
  const spendMap = {};
  allInvoices.forEach(inv => { spendMap[inv.vendorId] = (spendMap[inv.vendorId] || 0) + inv.grandTotal; });
  const spendList = Object.entries(spendMap)
    .map(([vid, amt]) => ({ v: vById(vid), amt }))
    .sort((a, b) => b.amt - a.amt);
  const maxSpend = Math.max(...spendList.map(x => x.amt), 1);

  // ── Category distribution
  const catMap = {};
  (db.vendors || []).forEach(v => { catMap[v.category] = (catMap[v.category] || 0) + 1; });
  const catList = Object.entries(catMap).sort((a, b) => b[1] - a[1]);

  // ── Category spend data (from seed or computed)
  const catSpend = db.categorySpend || [];
  const maxCatSpend = Math.max(...catSpend.map(c => c.amount), 1);

  // ── Vendor performance
  const vendorPerf = (db.vendors || []).map(v => ({
    v,
    quotes: (db.quotations || []).filter(q => q.vendorId === v.id).length,
    pos:    (db.purchaseOrders || []).filter(p => p.vendorId === v.id).length,
    spend:  allInvoices.filter(i => i.vendorId === v.id).reduce((s, i) => s + i.grandTotal, 0),
  })).sort((a, b) => b.spend - a.spend);

  // ── Avg delivery time from POs
  const deliveredPOs = (db.purchaseOrders || []).filter(p => p.status === 'delivered' && p.createdAt && p.deliveryDate);
  const avgDeliveryDays = deliveredPOs.length
    ? Math.round(deliveredPOs.reduce((s, p) => {
        const diff = (new Date(p.deliveryDate) - new Date(p.createdAt)) / (1000 * 60 * 60 * 24);
        return s + diff;
      }, 0) / deliveredPOs.length)
    : 0;

  const TABS = [
    { id: 'overview',    label: '📊 Overview' },
    { id: 'vendors',     label: '🏢 Vendor Analytics' },
    { id: 'procurement', label: '📋 Procurement Stats' },
    { id: 'spend',       label: '💰 Spend Analysis' },
  ];

  const catColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#94a3b8', '#ec4899', '#14b8a6', '#f97316'];

  return (
    <div className="animate-fade">
      <SectionHeader
        title="Reports & Analytics"
        subtitle="Comprehensive procurement insights and performance metrics"
        action={
          <Btn type="outline" onClick={() => exportCSV(vendorPerf.map(r => ({
            Vendor: r.v.name, Category: r.v.category, Rating: r.v.rating,
            Quotations: r.quotes, PurchaseOrders: r.pos, TotalSpend: r.spend,
          })), 'vendor_performance_report.csv')}>
            📥 Export Report
          </Btn>
        }
      />

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <StatCard label="Total Procurement Spend" value={fmt(totalSpend)} icon="💰" color="#3b82f6" trend={8} />
        <StatCard label="Total RFQs Issued" value={(db.rfqs || []).length} sub={`${(db.rfqs || []).filter(r => r.status === 'open').length} open`} icon="📄" color="#8b5cf6" />
        <StatCard label="Active Vendors" value={(db.vendors || []).filter(v => v.status === 'active').length} sub={`of ${(db.vendors || []).length} total`} icon="🏢" color="#10b981" />
        <StatCard label="Approval Rate" value={`${approvalRate}%`} sub={`${approvedCount} approved · ${rejectedCount} rejected`} icon="✅" color="#f59e0b" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 4, border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding: '8px 18px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.15s', background: activeTab === t.id ? 'linear-gradient(135deg,#1e40af,#3b82f6)' : 'transparent', color: activeTab === t.id ? '#fff' : 'var(--text-muted)', boxShadow: activeTab === t.id ? '0 2px 8px rgba(59,130,246,0.3)' : 'none', whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div>
          {/* Overdue Alert */}
          {overdue.length > 0 && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 18 }}>⚠️</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: '#ef4444' }}>{overdue.length} Overdue Invoice{overdue.length > 1 ? 's' : ''} — Action Required</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Total overdue: {fmt(overdue.reduce((s, i) => s + i.grandTotal, 0))}</div>
              </div>
            </div>
          )}

          <div className="grid-2">
            {/* Monthly Spend Chart */}
            <div style={S.card}>
              <div style={S.cardHeader}>
                <div style={S.cardTitle}>Monthly Spend Trend (12 Months)</div>
                <Badge type="blue">₹ INR</Badge>
              </div>
              <BarChart data={db.monthlySpend || []} keyField="month" valueField="amount" color="#3b82f6" height={180} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Annual Total</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#60a5fa' }}>{fmt((db.monthlySpend || []).reduce((s, m) => s + m.amount, 0))}</span>
              </div>
            </div>

            {/* Spend by Vendor */}
            <div style={S.card}>
              <div style={S.cardHeader}>
                <div style={S.cardTitle}>Spend by Vendor</div>
                <Badge type="cyan">{spendList.length} vendors</Badge>
              </div>
              {spendList.length === 0
                ? <div style={S.emptyState}>No spend data yet</div>
                : spendList.slice(0, 7).map(({ v, amt }) => (
                  <div key={v?.id} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{v?.name || 'Unknown'}</span>
                      <span style={{ fontWeight: 700, color: '#34d399' }}>{fmt(amt)}</span>
                    </div>
                    <ProgressBar value={amt} max={maxSpend} color="#3b82f6" />
                  </div>
                ))}
            </div>
          </div>

          {/* Invoice Status + Procurement Quick Summary */}
          <div className="grid-2" style={{ marginTop: 0 }}>
            <div style={S.card}>
              <div style={S.cardHeader}><div style={S.cardTitle}>Invoice Status Breakdown</div></div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                {[
                  { label: 'Paid',    val: paid.length,    color: '#10b981', amount: paid.reduce((s, i) => s + i.grandTotal, 0) },
                  { label: 'Pending', val: pending.length, color: '#f59e0b', amount: pending.reduce((s, i) => s + i.grandTotal, 0) },
                  { label: 'Overdue', val: overdue.length, color: '#ef4444', amount: overdue.reduce((s, i) => s + i.grandTotal, 0) },
                ].map(s => (
                  <div key={s.label} style={{ flex: 1, textAlign: 'center', background: `${s.color}10`, border: `1px solid ${s.color}25`, borderRadius: 10, padding: '14px 8px' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginTop: 4 }}>{fmt(s.amount)}</div>
                  </div>
                ))}
              </div>
              <div style={{ paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: 13, display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Total Invoice Value</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{fmt(allInvoices.reduce((s, i) => s + i.grandTotal, 0))}</span>
              </div>
            </div>

            <div style={S.card}>
              <div style={S.cardHeader}><div style={S.cardTitle}>Procurement Summary</div></div>
              <table style={{ ...S.table }}>
                <tbody>
                  {[
                    ['Total RFQs',          (db.rfqs || []).length],
                    ['Open RFQs',           (db.rfqs || []).filter(r => r.status === 'open').length],
                    ['Quoted RFQs',         (db.rfqs || []).filter(r => r.status === 'quoted').length],
                    ['Closed RFQs',         (db.rfqs || []).filter(r => r.status === 'closed').length],
                    ['Total Quotations',    (db.quotations || []).length],
                    ['Approvals Granted',   approvedCount],
                    ['Approvals Rejected',  rejectedCount],
                    ['Approvals Pending',   pendingApprovalCount],
                    ['Purchase Orders',     (db.purchaseOrders || []).length],
                    ['Delivered Orders',    (db.purchaseOrders || []).filter(p => p.status === 'delivered').length],
                    ['Total Invoices',      allInvoices.length],
                    ['Avg Delivery (days)', avgDeliveryDays || '—'],
                    ['Active Vendors',      (db.vendors || []).filter(v => v.status === 'active').length],
                    ['Total Vendors',       (db.vendors || []).length],
                  ].map(([l, v]) => (
                    <tr key={l} className="table-row-hover">
                      <td style={{ ...S.td, color: 'var(--text-muted)' }}>{l}</td>
                      <td style={{ ...S.td, textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── VENDOR ANALYTICS TAB */}
      {activeTab === 'vendors' && (
        <div>
          <div className="grid-2" style={{ marginBottom: 16 }}>
            {/* Category distribution */}
            <div style={S.card}>
              <div style={S.cardHeader}><div style={S.cardTitle}>Vendor Categories</div><Badge type="blue">{catList.length} categories</Badge></div>
              {catList.map(([cat, cnt], i) => (
                <div key={cat} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{cat}</span>
                    <span style={{ fontWeight: 700, color: catColors[i % catColors.length] }}>{cnt} vendor{cnt > 1 ? 's' : ''}</span>
                  </div>
                  <ProgressBar value={cnt} max={db.vendors.length} color={catColors[i % catColors.length]} />
                </div>
              ))}
            </div>

            {/* Top rated vendors */}
            <div style={S.card}>
              <div style={S.cardHeader}><div style={S.cardTitle}>Top Rated Vendors</div><Badge type="amber">By Rating</Badge></div>
              {[...db.vendors].sort((a, b) => b.rating - a.rating).slice(0, 8).map((v, i) => (
                <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `${catColors[i % catColors.length]}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: catColors[i % catColors.length], flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)' }}>{v.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{v.category}</div>
                  </div>
                  <div style={{ color: '#f59e0b', fontSize: 13 }}>{stars(v.rating)} <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{v.rating}</span></div>
                  <Badge type={v.status === 'active' ? 'green' : 'gray'}>{v.status}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Vendor Performance Table */}
          <div style={S.card}>
            <div style={S.cardHeader}><div style={S.cardTitle}>Vendor Performance Overview</div><Badge type="cyan">{vendorPerf.length} vendors</Badge></div>
            <Table
              heads={['Vendor', 'Category', 'Rating', 'Quotes', 'POs', 'Total Spend', 'Status']}
              rows={vendorPerf.map(({ v, quotes, pos, spend }) => (
                <tr key={v.id} className="table-row-hover">
                  <td style={S.td}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{v.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{v.email}</div>
                  </td>
                  <td style={S.td}><Badge type="blue">{v.category}</Badge></td>
                  <td style={S.td}><span style={{ color: '#f59e0b' }}>{stars(v.rating)}</span> <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{v.rating}</span></td>
                  <td style={{ ...S.td, fontWeight: 600, color: '#60a5fa' }}>{quotes}</td>
                  <td style={{ ...S.td, fontWeight: 600, color: '#a78bfa' }}>{pos}</td>
                  <td style={{ ...S.td, fontWeight: 700, color: '#34d399' }}>{spend ? fmt(spend) : '—'}</td>
                  <td style={S.td}><Badge type={v.status === 'active' ? 'green' : 'gray'} dot>{v.status}</Badge></td>
                </tr>
              ))}
            />
          </div>
        </div>
      )}

      {/* ── PROCUREMENT STATS TAB */}
      {activeTab === 'procurement' && (
        <div>
          <div className="grid-2">
            <div style={S.card}>
              <div style={S.cardHeader}><div style={S.cardTitle}>RFQ Status Breakdown</div></div>
              {[
                { label: 'Open',     count: (db.rfqs || []).filter(r => r.status === 'open').length,     color: '#3b82f6' },
                { label: 'Quoted',   count: (db.rfqs || []).filter(r => r.status === 'quoted').length,   color: '#f59e0b' },
                { label: 'Approved', count: (db.rfqs || []).filter(r => r.status === 'approved').length, color: '#10b981' },
                { label: 'Closed',   count: (db.rfqs || []).filter(r => r.status === 'closed').length,   color: '#475569' },
              ].map(s => (
                <div key={s.label} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{s.label}</span>
                    <span style={{ fontWeight: 700, color: s.color }}>{s.count}</span>
                  </div>
                  <ProgressBar value={s.count} max={Math.max((db.rfqs || []).length, 1)} color={s.color} />
                </div>
              ))}
            </div>

            <div style={S.card}>
              <div style={S.cardHeader}><div style={S.cardTitle}>Approval Metrics</div></div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Approved', val: approvedCount,          color: '#10b981' },
                  { label: 'Rejected', val: rejectedCount,          color: '#ef4444' },
                  { label: 'Pending',  val: pendingApprovalCount,   color: '#f59e0b' },
                ].map(s => (
                  <div key={s.label} style={{ flex: 1, textAlign: 'center', background: `${s.color}10`, border: `1px solid ${s.color}25`, borderRadius: 10, padding: '14px 10px' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10 }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#60a5fa' }}>{approvalRate}%</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Overall Approval Rate</div>
              </div>
              <div style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <span>Avg Delivery Time</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{avgDeliveryDays ? `${avgDeliveryDays} days` : '—'}</span>
              </div>
            </div>
          </div>

          {/* PO Status */}
          <div style={S.card}>
            <div style={S.cardHeader}><div style={S.cardTitle}>Purchase Order Status</div><Badge type="purple">{(db.purchaseOrders || []).length} POs</Badge></div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
              {[
                { label: 'Active',    count: (db.purchaseOrders || []).filter(p => p.status === 'active').length,    color: '#3b82f6' },
                { label: 'Delivered', count: (db.purchaseOrders || []).filter(p => p.status === 'delivered').length, color: '#10b981' },
                { label: 'Cancelled', count: (db.purchaseOrders || []).filter(p => p.status === 'cancelled').length, color: '#ef4444' },
              ].map(s => (
                <div key={s.label} style={{ flex: 1, minWidth: 100, textAlign: 'center', background: `${s.color}10`, border: `1px solid ${s.color}25`, borderRadius: 10, padding: '14px 10px' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.count}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Approved Quotations */}
          <div style={S.card}>
            <div style={S.cardHeader}><div style={S.cardTitle}>Approved Quotation History</div></div>
            <Table
              heads={['RFQ Title', 'Vendor', 'Approved Amount', 'Remarks', 'Date', 'Status']}
              rows={(db.approvals || []).map(ap => (
                <tr key={ap.id} className="table-row-hover">
                  <td style={{ ...S.td, fontWeight: 600, color: 'var(--text-primary)' }}>{(db.rfqs || []).find(r => r.id === ap.rfqId)?.title || '—'}</td>
                  <td style={S.td}>{vById(ap.vendorId)?.name}</td>
                  <td style={{ ...S.td, fontWeight: 700, color: '#34d399' }}>{fmt(ap.amount)}</td>
                  <td style={{ ...S.td, fontSize: 12, color: 'var(--text-muted)' }}>{ap.remarks || '—'}</td>
                  <td style={{ ...S.td, fontSize: 12, color: 'var(--text-muted)' }}>{fmtD(ap.createdAt)}</td>
                  <td style={S.td}><Badge type={ap.status === 'approved' ? 'green' : ap.status === 'rejected' ? 'red' : 'amber'}>{ap.status}</Badge></td>
                </tr>
              ))}
            />
          </div>
        </div>
      )}

      {/* ── SPEND ANALYSIS TAB */}
      {activeTab === 'spend' && (
        <div>
          {/* Category Spend Bar Chart */}
          <div style={S.card}>
            <div style={S.cardHeader}>
              <div style={S.cardTitle}>Spend by Category</div>
              <Badge type="blue">₹ INR</Badge>
            </div>
            {catSpend.length > 0 ? (
              <>
                <BarChart data={catSpend.map(c => ({ month: c.category.split(' ')[0], amount: c.amount }))} keyField="month" valueField="amount" height={200} />
                <div style={{ marginTop: 16 }}>
                  {catSpend.map((c, i) => (
                    <div key={c.category} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.category}</span>
                        <span style={{ fontWeight: 700, color: catColors[i % catColors.length] }}>{fmt(c.amount)}</span>
                      </div>
                      <ProgressBar value={c.amount} max={maxCatSpend} color={catColors[i % catColors.length]} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={S.emptyState}>No category spend data available</div>
            )}
          </div>

          {/* Top Vendors Leaderboard */}
          <div style={S.card}>
            <div style={S.cardHeader}><div style={S.cardTitle}>Top Vendors by Spend</div><Badge type="green">Leaderboard</Badge></div>
            {(db.topVendors || spendList.map(s => ({ vendorId: s.v?.id, vendorName: s.v?.name, totalSpend: s.amt, orders: (db.purchaseOrders || []).filter(p => p.vendorId === s.v?.id).length }))).map((tv, i) => (
              <div key={tv.vendorId} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                {/* Rank badge */}
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: i === 0 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : i === 1 ? 'linear-gradient(135deg, #94a3b8, #64748b)' : i === 2 ? 'linear-gradient(135deg, #cd7c4a, #92400e)' : 'var(--bg-elevated)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 900,
                  color: i < 3 ? '#fff' : 'var(--text-muted)',
                  border: '1px solid var(--border)',
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{tv.vendorName}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{tv.orders} purchase orders</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: '#34d399' }}>{fmt(tv.totalSpend)}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>total spend</div>
                </div>
              </div>
            ))}
          </div>

          {/* Invoice Payment Timeline */}
          <div style={S.card}>
            <div style={S.cardHeader}><div style={S.cardTitle}>All Invoices — Payment Status</div><Badge type="cyan">{allInvoices.length} invoices</Badge></div>
            <Table
              heads={['Invoice #', 'PO Reference', 'Vendor', 'Amount', 'Due Date', 'Status']}
              rows={[...allInvoices].reverse().map(inv => (
                <tr key={inv.id} className="table-row-hover">
                  <td style={{ ...S.td, color: '#60a5fa', fontWeight: 700, fontFamily: 'monospace', fontSize: 12 }}>{inv.invoiceNumber}</td>
                  <td style={{ ...S.td, color: 'var(--text-muted)', fontSize: 12 }}>{inv.poId || '—'}</td>
                  <td style={S.td}>{vById(inv.vendorId)?.name || '—'}</td>
                  <td style={{ ...S.td, fontWeight: 700, color: inv.status === 'paid' ? '#34d399' : inv.status === 'overdue' ? '#ef4444' : '#fbbf24' }}>{fmt(inv.grandTotal)}</td>
                  <td style={{ ...S.td, fontSize: 12, color: 'var(--text-muted)' }}>{fmtD(inv.dueDate)}</td>
                  <td style={S.td}><Badge type={inv.status === 'paid' ? 'green' : inv.status === 'overdue' ? 'red' : 'amber'}>{inv.status}</Badge></td>
                </tr>
              ))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
