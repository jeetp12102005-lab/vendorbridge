// Purchase Orders — View, print, manage POs
import { useState } from 'react';
import S from '../styles/theme';
import { Badge, Btn, Modal, Table, SectionHeader, EmptyState, SearchInput } from '../components/shared';
import { fmt, fmtD } from '../utils/helpers';

export default function PurchaseOrders({ db, user }) {
  const [viewing,  setViewing]  = useState(null);
  const [search,   setSearch]   = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const vById = id => db.vendors.find(v => v.id === id);

  const isVendor = user.role === 'vendor';
  const allPOs = isVendor
    ? db.purchaseOrders.filter(p => p.vendorId === user.vendorId)
    : db.purchaseOrders;

  const filtered = allPOs.filter(p => {
    const matchSearch = p.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      vById(p.vendorId)?.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // ── Print PO
  const printPO = (po) => {
    const v = vById(po.vendorId);
    const w = window.open('', '_blank');
    w.document.write(`
<!DOCTYPE html><html><head><title>${po.poNumber}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; padding: 40px; color: #111; background: #fff; }
  .header { display: flex; justify-content: space-between; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #1e3a8a; }
  .brand { font-size: 26px; font-weight: 900; color: #1e3a8a; }
  .brand-sub { font-size: 12px; color: #666; margin-top: 4px; }
  .po-meta { text-align: right; }
  .po-num { font-size: 20px; font-weight: 700; color: #1e3a8a; }
  .section { margin-bottom: 24px; }
  .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 10px; }
  .vendor-box { background: #f8f9fc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #1e3a8a; color: #fff; padding: 10px 14px; text-align: left; font-size: 12px; }
  td { padding: 10px 14px; border-bottom: 1px solid #f0f4ff; font-size: 13px; }
  .totals { text-align: right; background: #f8f9fc; padding: 16px; border-radius: 8px; margin-top: 16px; }
  .total-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; color: #666; }
  .total-grand { font-weight: 800; font-size: 20px; color: #1e3a8a; border-top: 2px solid #1e3a8a; padding-top: 10px; margin-top: 8px; display: flex; justify-content: space-between; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #999; text-align: center; }
  .status-badge { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #dcfce7; color: #16a34a; }
  @media print { body { padding: 20px; } }
</style>
</head><body>
<div class="header">
  <div>
    <div class="brand">⬡ VendorBridge ERP</div>
    <div class="brand-sub">PURCHASE ORDER</div>
  </div>
  <div class="po-meta">
    <div class="po-num">${po.poNumber}</div>
    <div style="font-size:12px;color:#666;margin-top:6px">Date: ${fmtD(po.createdAt)}</div>
    <div style="margin-top:8px"><span class="status-badge">${po.status.toUpperCase()}</span></div>
  </div>
</div>

<div class="section">
  <div class="section-title">Vendor Details</div>
  <div class="vendor-box">
    <strong style="font-size:16px">${v?.name || '—'}</strong><br/>
    <span style="color:#666;font-size:13px">📧 ${v?.email || ''} &nbsp;|&nbsp; 📞 ${v?.phone || ''}</span><br/>
    <span style="color:#666;font-size:13px">GST: ${v?.gst || '—'} &nbsp;|&nbsp; 📍 ${v?.address || ''}</span>
  </div>
</div>

<div class="section">
  <div class="section-title">Items Ordered</div>
  <table>
    <thead><tr><th>#</th><th>Item / Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
    <tbody>
      ${po.items.map((it, i) => `<tr><td>${i + 1}</td><td>${it.name}</td><td>${it.qty}</td><td>₹${it.unitPrice?.toLocaleString('en-IN')}</td><td>₹${it.total?.toLocaleString('en-IN')}</td></tr>`).join('')}
    </tbody>
  </table>
  <div class="totals">
    <div class="total-row"><span>Subtotal</span><span>₹${po.subtotal?.toLocaleString('en-IN')}</span></div>
    <div class="total-row"><span>GST (18%)</span><span>₹${po.gstAmount?.toLocaleString('en-IN')}</span></div>
    <div class="total-grand"><span>GRAND TOTAL</span><span>₹${po.grandTotal?.toLocaleString('en-IN')}</span></div>
  </div>
</div>

<div class="footer">
  This is a computer-generated Purchase Order. No signature required. &nbsp;|&nbsp; VendorBridge ERP Platform &nbsp;|&nbsp; Generated on ${new Date().toLocaleString('en-IN')}
</div>
</body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <div className="animate-fade">
      <SectionHeader
        title="Purchase Orders"
        subtitle={`${allPOs.filter(p => p.status === 'active').length} active · ${allPOs.length} total POs`}
      />

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total POs',     value: allPOs.length,                                   color: '#3b82f6' },
          { label: 'Active',        value: allPOs.filter(p => p.status === 'active').length, color: '#10b981' },
          { label: 'Total Value',   value: fmt(allPOs.reduce((s, p) => s + p.grandTotal, 0)), color: '#8b5cf6' },
          { label: 'Avg PO Value',  value: fmt(allPOs.length ? allPOs.reduce((s, p) => s + p.grandTotal, 0) / allPOs.length : 0), color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ ...S.cardSm, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 3, alignSelf: 'stretch', borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: s.value?.toString().length > 8 ? 14 : 20, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#475569' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ ...S.card, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <SearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by PO number or vendor..." />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...S.select, width: 150 }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Table */}
      <div style={S.card}>
        {filtered.length === 0
          ? <EmptyState icon="📦" title="No purchase orders found" desc={isVendor ? 'No POs issued to your company yet.' : 'POs are generated automatically on approval.'} />
          : (
            <Table
              heads={['PO Number', 'Vendor', 'Subtotal', 'GST', 'Grand Total', 'Date', 'Status', 'Actions']}
              rows={filtered.map(po => (
                <tr key={po.id} className="table-row-hover">
                  <td style={{ ...S.td, color: '#60a5fa', fontWeight: 700, fontFamily: 'monospace' }}>{po.poNumber}</td>
                  <td style={S.td}>
                    <div style={{ fontWeight: 600 }}>{vById(po.vendorId)?.name}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{vById(po.vendorId)?.category}</div>
                  </td>
                  <td style={S.td}>{fmt(po.subtotal)}</td>
                  <td style={S.td}>{fmt(po.gstAmount)}</td>
                  <td style={{ ...S.td, fontWeight: 700, color: '#34d399' }}>{fmt(po.grandTotal)}</td>
                  <td style={S.td}>{fmtD(po.createdAt)}</td>
                  <td style={S.td}><Badge type="green" dot>{po.status}</Badge></td>
                  <td style={S.td}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Btn type="ghost" sm onClick={() => setViewing(po)}>View</Btn>
                      <Btn type="outline" sm onClick={() => printPO(po)}>🖨 Print</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            />
          )}
      </div>

      {/* ── View Modal */}
      {viewing && (
        <Modal size="lg" title={viewing.poNumber} subtitle={`Purchase Order · ${fmtD(viewing.createdAt)}`} onClose={() => setViewing(null)}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              ['Vendor',   vById(viewing.vendorId)?.name],
              ['Category', vById(viewing.vendorId)?.category],
              ['Date',     fmtD(viewing.createdAt)],
              ['Status',   ''],
            ].map(([k, v]) => (
              <div key={k} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '10px 14px', minWidth: 140 }}>
                <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{k}</div>
                {k === 'Status'
                  ? <Badge type="green" dot>{viewing.status}</Badge>
                  : <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{v}</div>}
              </div>
            ))}
          </div>

          <Table
            heads={['Item', 'Qty', 'Unit Price', 'Total']}
            rows={viewing.items.map((it, i) => (
              <tr key={i}>
                <td style={S.td}>{it.name}</td>
                <td style={S.td}>{it.qty}</td>
                <td style={S.td}>{fmt(it.unitPrice)}</td>
                <td style={{ ...S.td, fontWeight: 600, color: '#34d399' }}>{fmt(it.total)}</td>
              </tr>
            ))}
          />

          <div style={{ textAlign: 'right', padding: '14px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, marginTop: 14 }}>
            <div style={{ color: '#64748b', fontSize: 13, marginBottom: 4 }}>Subtotal: {fmt(viewing.subtotal)}</div>
            <div style={{ color: '#64748b', fontSize: 13, marginBottom: 8 }}>GST (18%): {fmt(viewing.gstAmount)}</div>
            <div style={{ fontWeight: 800, fontSize: 22, color: '#34d399' }}>Grand Total: {fmt(viewing.grandTotal)}</div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <Btn onClick={() => printPO(viewing)}>🖨 Print PO</Btn>
            <Btn type="outline" onClick={() => setViewing(null)}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
