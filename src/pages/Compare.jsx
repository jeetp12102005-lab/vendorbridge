// Compare Quotes — Side-by-side comparison
import { useState } from 'react';
import S from '../styles/theme';
import { Badge, Btn, SectionHeader, EmptyState } from '../components/shared';
import { fmt, fmtD, stars } from '../utils/helpers';

export default function Compare({ db, setDb, user, setPage }) {
  const [selRFQ, setSelRFQ] = useState('');
  const [sortBy, setSortBy] = useState('price'); // 'price' | 'delivery' | 'rating'

  const rfqs = db.rfqs.filter(r => r.status === 'quoted' || r.status === 'approved');
  const vById = id => db.vendors.find(v => v.id === id);
  const rById = id => db.rfqs.find(r => r.id === id);

  let quotes = selRFQ ? db.quotations.filter(q => q.rfqId === selRFQ) : [];
  const isApproved = q => !!db.approvals.find(a => a.quotationId === q.id && a.status === 'approved');

  // Sort
  quotes = [...quotes].sort((a, b) => {
    if (sortBy === 'price') return a.grandTotal - b.grandTotal;
    if (sortBy === 'delivery') return a.deliveryDays - b.deliveryDays;
    if (sortBy === 'rating') return (vById(b.vendorId)?.rating || 0) - (vById(a.vendorId)?.rating || 0);
    return 0;
  });

  const minPrice = quotes.length ? Math.min(...quotes.map(q => q.grandTotal)) : Infinity;
  const minDays = quotes.length ? Math.min(...quotes.map(q => q.deliveryDays)) : Infinity;
  const maxRating = quotes.length ? Math.max(...quotes.map(q => vById(q.vendorId)?.rating || 0)) : 0;

  const COMPARE_ROWS = [
    { label: 'Subtotal', fn: q => fmt(q.totalAmount), bold: false },
    { label: 'GST (18%)', fn: q => fmt(q.totalAmount * 0.18), bold: false },
    { label: 'Grand Total', fn: q => fmt(q.grandTotal), bold: true, hi: q => q.grandTotal === minPrice, hiColor: '#10b981' },
    { label: 'Delivery Time', fn: q => `${q.deliveryDays} days`, bold: false, hi: q => q.deliveryDays === minDays, hiColor: '#06b6d4' },
    { label: 'Vendor Rating', fn: q => stars(vById(q.vendorId)?.rating || 0) + ` (${vById(q.vendorId)?.rating || 'N/A'})`, bold: false, hi: q => (vById(q.vendorId)?.rating || 0) === maxRating, hiColor: '#f59e0b' },
    { label: 'Notes', fn: q => q.notes || '—', bold: false },
    { label: 'Status', fn: q => isApproved(q) ? '✅ Approved' : q.status, bold: false },
  ];

  return (
    <div className="animate-fade">
      <SectionHeader
        title="Quote Comparison"
        subtitle="Compare vendor quotations side by side to make informed procurement decisions"
      />

      {/* RFQ Selector */}
      <div style={{ ...S.card, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Select RFQ to Compare</div>
            <select
              value={selRFQ}
              onChange={e => setSelRFQ(e.target.value)}
              style={{ ...S.select, width: 380, maxWidth: '100%' }}
            >
              <option value="">-- Choose an RFQ --</option>
              {rfqs.map(r => (
                <option key={r.id} value={r.id}>{r.title} ({db.quotations.filter(q => q.rfqId === r.id).length} quotes)</option>
              ))}
            </select>
          </div>
          {selRFQ && (
            <div>
              <div style={{ fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Sort By</div>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                {[['price', '💰 Price'], ['delivery', '🚚 Delivery'], ['rating', '⭐ Rating']].map(([v, l]) => (
                  <button key={v} onClick={() => setSortBy(v)} style={{ padding: '7px 14px', background: sortBy === v ? 'linear-gradient(135deg,#1e40af,#3b82f6)' : 'none', border: 'none', cursor: 'pointer', color: sortBy === v ? '#fff' : '#475569', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.15s' }}>{l}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        {rfqs.length === 0 && (
          <div style={{ marginTop: 14 }}>
            <EmptyState icon="⚖" title="No quoted RFQs available" desc="RFQs need at least one vendor quotation before comparison is possible." />
          </div>
        )}
      </div>

      {selRFQ && quotes.length === 0 && (
        <EmptyState icon="💬" title="No quotations yet" desc="No vendors have submitted quotes for this RFQ yet." />
      )}

      {/* Comparison Table */}
      {quotes.length > 0 && (
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div>
              <div style={S.cardTitle}>Comparison: {rById(selRFQ)?.title}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{quotes.length} vendor quote(s) · Sorted by {sortBy}</div>
            </div>
            <Badge type="blue">{quotes.length} Vendors</Badge>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...S.th, width: 140, background: '#080d18', position: 'sticky', left: 0, zIndex: 2 }}>Criteria</th>
                  {quotes.map((q, idx) => {
                    const v = vById(q.vendorId);
                    const best = q.grandTotal === minPrice;
                    return (
                      <th key={q.id} style={{ ...S.th, textAlign: 'center', minWidth: 180, background: best ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.02)', borderTop: best ? '2px solid #10b981' : '2px solid transparent' }}>
                        <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 13, marginBottom: 4 }}>{v?.name}</div>
                        <div style={{ fontSize: 10, color: '#475569', fontWeight: 400, marginBottom: 4 }}>{v?.category}</div>
                        <div style={{ color: '#f59e0b', fontSize: 12 }}>{stars(v?.rating)} <span style={{ color: '#475569' }}>{v?.rating}</span></div>
                        {best && <div style={{ marginTop: 6 }}><Badge type="green">🏆 Best Price</Badge></div>}
                        {q.deliveryDays === minDays && <div style={{ marginTop: 4 }}><Badge type="cyan">⚡ Fastest</Badge></div>}
                        {isApproved(q) && <div style={{ marginTop: 4 }}><Badge type="green">✅ Approved</Badge></div>}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, ri) => (
                  <tr key={ri}>
                    <td style={{ ...S.td, fontWeight: 600, color: '#64748b', background: '#080d18', fontSize: 12, position: 'sticky', left: 0 }}>{row.label}</td>
                    {quotes.map(q => {
                      const highlight = row.hi && row.hi(q);
                      return (
                        <td key={q.id} style={{ ...S.td, textAlign: 'center', background: highlight ? `${row.hiColor}10` : 'transparent', fontWeight: row.bold ? 800 : 400, color: highlight ? row.hiColor : row.bold ? '#f1f5f9' : '#94a3b8', fontSize: row.bold ? 16 : 13.5 }}>
                          {highlight && row.bold && <span style={{ color: row.hiColor, marginRight: 4 }}>★</span>}
                          {row.fn(q)}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Item breakdown */}
                {quotes[0]?.items.map((_, itemIdx) => (
                  <tr key={`item-${itemIdx}`} style={{ background: 'rgba(255,255,255,0.01)' }}>
                    <td style={{ ...S.td, color: '#475569', fontSize: 11, position: 'sticky', left: 0, background: '#080d18', paddingLeft: 20 }}>
                      └ {quotes[0].items[itemIdx]?.name}
                    </td>
                    {quotes.map(q => (
                      <td key={q.id} style={{ ...S.td, textAlign: 'center', fontSize: 12, color: '#64748b' }}>
                        {fmt(q.items[itemIdx]?.unitPrice || 0)} / {q.items[itemIdx]?.unit}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action */}
          {(user.role === 'manager' || user.role === 'admin') && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 13, color: '#64748b' }}>
                Ready to approve? Go to the <strong style={{ color: '#e2e8f0' }}>Approvals</strong> screen to review and approve a quotation.
              </div>
              <Btn onClick={() => setPage('approvals')}>Go to Approvals →</Btn>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
