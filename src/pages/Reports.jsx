// Reports & Analytics — KPIs, bar charts, vendor performance
import { useState } from 'react';
import S from '../styles/theme';
import { Badge, Btn, Table, SectionHeader, BarChart, StatCard, ProgressBar } from '../components/shared';
import { fmt, fmtD, stars, exportCSV } from '../utils/helpers';

export default function Reports({ db }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'vendors' | 'procurement'

  const vById = id => db.vendors.find(v => v.id === id);

  // ── Aggregate metrics
  const totalSpend     = db.invoices.reduce((s, i) => s + i.grandTotal, 0);
  const paid           = db.invoices.filter(i => i.status === 'paid');
  const pending        = db.invoices.filter(i => i.status !== 'paid');
  const approvedCount  = db.approvals.filter(a => a.status === 'approved').length;
  const rejectedCount  = db.approvals.filter(a => a.status === 'rejected').length;
  const approvalRate   = db.approvals.length ? Math.round((approvedCount / db.approvals.length) * 100) : 0;

  // ── Spend by vendor
  const spendMap = {};
  db.invoices.forEach(inv => { spendMap[inv.vendorId] = (spendMap[inv.vendorId] || 0) + inv.grandTotal; });
  const spendList = Object.entries(spendMap)
    .map(([vid, amt]) => ({ v: vById(vid), amt }))
    .sort((a, b) => b.amt - a.amt);
  const maxSpend = Math.max(...spendList.map(x => x.amt), 1);

  // ── Category distribution
  const catMap = {};
  db.vendors.forEach(v => { catMap[v.category] = (catMap[v.category] || 0) + 1; });
  const catList = Object.entries(catMap).sort((a, b) => b[1] - a[1]);

  // ── Vendor performance
  const vendorPerf = db.vendors.map(v => ({
    v,
    quotes: db.quotations.filter(q => q.vendorId === v.id).length,
    pos:    db.purchaseOrders.filter(p => p.vendorId === v.id).length,
    spend:  db.invoices.filter(i => i.vendorId === v.id).reduce((s, i) => s + i.grandTotal, 0),
  })).sort((a, b) => b.spend - a.spend);

  const TABS = [
    { id: 'overview',    label: '📊 Overview' },
    { id: 'vendors',     label: '🏢 Vendor Analytics' },
    { id: 'procurement', label: '📋 Procurement Stats' },
  ];

  const catColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#94a3b8'];

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
        <StatCard label="Total RFQs" value={db.rfqs.length} sub={`${db.rfqs.filter(r => r.status === 'open').length} open`} icon="📄" color="#8b5cf6" />
        <StatCard label="Active Vendors" value={db.vendors.filter(v => v.status === 'active').length} sub={`of ${db.vendors.length} total`} icon="🏢" color="#10b981" />
        <StatCard label="Approval Rate" value={`${approvalRate}%`} sub={`${approvedCount} approved · ${rejectedCount} rejected`} icon="✅" color="#f59e0b" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 4, border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding: '8px 18px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.15s', background: activeTab === t.id ? 'linear-gradient(135deg,#1e40af,#3b82f6)' : 'transparent', color: activeTab === t.id ? '#fff' : '#64748b', boxShadow: activeTab === t.id ? '0 2px 8px rgba(59,130,246,0.3)' : 'none', whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div>
          <div className="grid-2">
            {/* Monthly Spend Chart */}
            <div style={S.card}>
              <div style={S.cardHeader}>
                <div style={S.cardTitle}>Monthly Spend Trend (2025)</div>
                <Badge type="blue">₹ INR</Badge>
              </div>
              <BarChart data={db.monthlySpend} keyField="month" valueField="amount" color="#3b82f6" height={180} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 12, color: '#475569' }}>YTD Total</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#60a5fa' }}>{fmt(db.monthlySpend.reduce((s, m) => s + m.amount, 0))}</span>
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
                : spendList.map(({ v, amt }) => (
                  <div key={v?.id} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                      <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{v?.name || 'Unknown'}</span>
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
              <div style={S.cardHeader}><div style={S.cardTitle}>Invoice Status</div></div>
              <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
                {[
                  { label: 'Paid',    val: paid.length,    color: '#10b981', pct: db.invoices.length ? Math.round((paid.length / db.invoices.length) * 100) : 0 },
                  { label: 'Pending', val: pending.length, color: '#f59e0b', pct: db.invoices.length ? Math.round((pending.length / db.invoices.length) * 100) : 0 },
                ].map(s => (
                  <div key={s.label} style={{ flex: 1, textAlign: 'center', background: `${s.color}10`, border: `1px solid ${s.color}25`, borderRadius: 10, padding: '14px 10px' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{s.label} ({s.pct}%)</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 13, color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Paid Amount</span>
                <span style={{ fontWeight: 700, color: '#34d399' }}>{fmt(paid.reduce((s, i) => s + i.grandTotal, 0))}</span>
              </div>
              <div style={{ fontSize: 13, color: '#475569', display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span>Total Pending</span>
                <span style={{ fontWeight: 700, color: '#fbbf24' }}>{fmt(pending.reduce((s, i) => s + i.grandTotal, 0))}</span>
              </div>
            </div>

            <div style={S.card}>
              <div style={S.cardHeader}><div style={S.cardTitle}>Procurement Summary</div></div>
              <table style={{ ...S.table }}>
                <tbody>
                  {[
                    ['Total RFQs',          db.rfqs.length],
                    ['Open RFQs',           db.rfqs.filter(r => r.status === 'open').length],
                    ['Total Quotations',    db.quotations.length],
                    ['Approvals Given',     approvedCount],
                    ['Approvals Rejected',  rejectedCount],
                    ['Purchase Orders',     db.purchaseOrders.length],
                    ['Total Invoices',      db.invoices.length],
                    ['Active Vendors',      db.vendors.filter(v => v.status === 'active').length],
                  ].map(([l, v]) => (
                    <tr key={l} className="table-row-hover">
                      <td style={{ ...S.td, color: '#64748b' }}>{l}</td>
                      <td style={{ ...S.td, textAlign: 'right', fontWeight: 700, color: '#e2e8f0' }}>{v}</td>
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
              <div style={S.cardHeader}><div style={S.cardTitle}>Vendor Categories</div></div>
              {catList.map(([cat, cnt], i) => (
                <div key={cat} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                    <span style={{ fontWeight: 500, color: '#e2e8f0' }}>{cat}</span>
                    <span style={{ fontWeight: 700, color: catColors[i % catColors.length] }}>{cnt} vendor{cnt > 1 ? 's' : ''}</span>
                  </div>
                  <ProgressBar value={cnt} max={db.vendors.length} color={catColors[i % catColors.length]} />
                </div>
              ))}
            </div>

            {/* Top rated vendors */}
            <div style={S.card}>
              <div style={S.cardHeader}><div style={S.cardTitle}>Top Rated Vendors</div></div>
              {[...db.vendors].sort((a, b) => b.rating - a.rating).slice(0, 5).map((v, i) => (
                <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `${catColors[i]}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: catColors[i], flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: '#e2e8f0' }}>{v.name}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{v.category}</div>
                  </div>
                  <div style={{ color: '#f59e0b', fontSize: 13 }}>{stars(v.rating)} <span style={{ color: '#475569', fontSize: 11 }}>{v.rating}</span></div>
                  <Badge type={v.status === 'active' ? 'green' : 'gray'}>{v.status}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Vendor Performance Table */}
          <div style={S.card}>
            <div style={S.cardHeader}><div style={S.cardTitle}>Vendor Performance Overview</div></div>
            <Table
              heads={['Vendor', 'Category', 'Rating', 'Quotes', 'POs', 'Total Spend', 'Status']}
              rows={vendorPerf.map(({ v, quotes, pos, spend }) => (
                <tr key={v.id} className="table-row-hover">
                  <td style={S.td}>
                    <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{v.name}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{v.email}</div>
                  </td>
                  <td style={S.td}><Badge type="blue">{v.category}</Badge></td>
                  <td style={S.td}><span style={{ color: '#f59e0b' }}>{stars(v.rating)}</span> <span style={{ fontSize: 11, color: '#475569' }}>{v.rating}</span></td>
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
                { label: 'Open',     count: db.rfqs.filter(r => r.status === 'open').length,     color: '#3b82f6' },
                { label: 'Quoted',   count: db.rfqs.filter(r => r.status === 'quoted').length,   color: '#f59e0b' },
                { label: 'Approved', count: db.rfqs.filter(r => r.status === 'approved').length, color: '#10b981' },
                { label: 'Closed',   count: db.rfqs.filter(r => r.status === 'closed').length,   color: '#475569' },
              ].map(s => (
                <div key={s.label} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                    <span style={{ fontWeight: 500, color: '#e2e8f0' }}>{s.label}</span>
                    <span style={{ fontWeight: 700, color: s.color }}>{s.count}</span>
                  </div>
                  <ProgressBar value={s.count} max={Math.max(db.rfqs.length, 1)} color={s.color} />
                </div>
              ))}
            </div>

            <div style={S.card}>
              <div style={S.cardHeader}><div style={S.cardTitle}>Approval Metrics</div></div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                {[
                  { label: 'Approved', val: approvedCount, color: '#10b981' },
                  { label: 'Rejected', val: rejectedCount, color: '#ef4444' },
                  { label: 'Pending',  val: db.quotations.filter(q => !db.approvals.find(a => a.quotationId === q.id)).length, color: '#f59e0b' },
                ].map(s => (
                  <div key={s.label} style={{ flex: 1, textAlign: 'center', background: `${s.color}10`, border: `1px solid ${s.color}25`, borderRadius: 10, padding: '14px 10px' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10 }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#60a5fa' }}>{approvalRate}%</div>
                <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>Approval Rate</div>
              </div>
            </div>
          </div>

          {/* Recent Approved Quotations */}
          <div style={S.card}>
            <div style={S.cardHeader}><div style={S.cardTitle}>Approved Quotation History</div></div>
            <Table
              heads={['RFQ', 'Vendor', 'Approved Amount', 'Remarks', 'Date']}
              rows={db.approvals.filter(a => a.status === 'approved').map(ap => (
                <tr key={ap.id} className="table-row-hover">
                  <td style={{ ...S.td, fontWeight: 600 }}>{db.rfqs.find(r => r.id === ap.rfqId)?.title}</td>
                  <td style={S.td}>{vById(ap.vendorId)?.name}</td>
                  <td style={{ ...S.td, fontWeight: 700, color: '#34d399' }}>{fmt(ap.amount)}</td>
                  <td style={{ ...S.td, fontSize: 12, color: '#64748b' }}>{ap.remarks}</td>
                  <td style={{ ...S.td, fontSize: 12, color: '#475569' }}>{fmtD(ap.createdAt)}</td>
                </tr>
              ))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
