// Invoices — View, mark paid, print, send via email
import { useState } from 'react';
import S from '../styles/theme';
import { Badge, Btn, Modal, Alert, Field, Input, Textarea, Table, SectionHeader, EmptyState, SearchInput } from '../components/shared';
import { genId, today, fmt, fmtD } from '../utils/helpers';

export default function Invoices({ db, setDb, user }) {
  const [viewing,   setViewing]   = useState(null);
  const [emailInv,  setEmailInv]  = useState(null);
  const [emailTo,   setEmailTo]   = useState('');
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState('all');
  const [msg, setMsg]             = useState('');
  const [msgType, setMsgType]     = useState('success');

  const vById = id => db.vendors.find(v => v.id === id);
  const isVendor = user.role === 'vendor';
  const canPay   = user.role === 'manager' || user.role === 'admin' || user.role === 'officer';

  const allInvoices = isVendor
    ? db.invoices.filter(i => i.vendorId === user.vendorId)
    : db.invoices;

  const filtered = allInvoices.filter(i => {
    const matchSearch = i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      vById(i.vendorId)?.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || i.status === filter;
    return matchSearch && matchFilter;
  });

  const showMsg = (m, t = 'success') => { setMsg(m); setMsgType(t); setTimeout(() => setMsg(''), 3500); };

  const markPaid = (inv) => {
    setDb(d => ({
      ...d,
      invoices: d.invoices.map(i => i.id === inv.id ? { ...i, status: 'paid', paidAt: today() } : i),
      logs: [...d.logs, { id: genId('log'), action: 'Invoice Paid', detail: `${inv.invoiceNumber} marked as paid`, timestamp: new Date().toISOString(), userId: user.id, type: 'invoice' }],
    }));
    showMsg(`${inv.invoiceNumber} marked as paid! ✓`);
    if (viewing?.id === inv.id) setViewing({ ...viewing, status: 'paid' });
  };

  // ── Print Invoice
  const printInv = (inv) => {
    const v = vById(inv.vendorId);
    const w = window.open('', '_blank');
    const stampColor = inv.status === 'paid' ? '#16a34a' : '#d97706';
    w.document.write(`
<!DOCTYPE html><html><head><title>${inv.invoiceNumber}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; padding: 40px; color: #111; background: #fff; }
  .header { display: flex; justify-content: space-between; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #1e3a8a; }
  .brand { font-size: 26px; font-weight: 900; color: #1e3a8a; }
  .inv-meta { text-align: right; }
  .inv-num { font-size: 20px; font-weight: 700; color: #1e3a8a; }
  .stamp { position: absolute; top: 60px; right: 60px; font-size: 28px; font-weight: 900; color: ${stampColor}; border: 4px solid ${stampColor}; padding: 8px 20px; transform: rotate(-12deg); opacity: 0.75; border-radius: 4px; letter-spacing: 2px; }
  .section { margin-bottom: 24px; }
  .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 10px; }
  .box { background: #f8f9fc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #1e3a8a; color: #fff; padding: 10px 14px; text-align: left; font-size: 12px; }
  td { padding: 10px 14px; border-bottom: 1px solid #f0f4ff; font-size: 13px; }
  .totals { text-align: right; background: #f8f9fc; padding: 16px; border-radius: 8px; margin-top: 16px; }
  .total-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; color: #666; }
  .total-grand { font-weight: 800; font-size: 20px; color: #1e3a8a; border-top: 2px solid #1e3a8a; padding-top: 10px; margin-top: 8px; display: flex; justify-content: space-between; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #999; text-align: center; }
  @media print { body { padding: 20px; } .stamp { position: fixed; } }
</style>
</head><body>
<div class="stamp">${inv.status.toUpperCase()}</div>
<div class="header">
  <div>
    <div class="brand">⬡ VendorBridge ERP</div>
    <div style="font-size:12px;color:#666;margin-top:4px">TAX INVOICE</div>
  </div>
  <div class="inv-meta">
    <div class="inv-num">${inv.invoiceNumber}</div>
    <div style="font-size:12px;color:#666;margin-top:6px">Invoice Date: ${fmtD(inv.createdAt)}</div>
    <div style="font-size:12px;color:#d97706">Due Date: ${fmtD(inv.dueDate)}</div>
  </div>
</div>
<div class="section">
  <div class="section-title">Billed To</div>
  <div class="box">
    <strong style="font-size:16px">${v?.name || '—'}</strong><br/>
    <span style="color:#666;font-size:13px">📧 ${v?.email || ''} &nbsp;|&nbsp; GST: ${v?.gst || '—'}</span><br/>
    <span style="color:#666;font-size:13px">📍 ${v?.address || ''}</span>
  </div>
</div>
<div class="section">
  <div class="section-title">Invoice Items</div>
  <table>
    <thead><tr><th>#</th><th>Description</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr></thead>
    <tbody>
      ${inv.items.map((it, i) => `<tr><td>${i + 1}</td><td>${it.name}</td><td>${it.qty}</td><td>₹${it.unitPrice?.toLocaleString('en-IN')}</td><td>₹${it.total?.toLocaleString('en-IN')}</td></tr>`).join('')}
    </tbody>
  </table>
  <div class="totals">
    <div class="total-row"><span>Subtotal</span><span>₹${inv.subtotal?.toLocaleString('en-IN')}</span></div>
    <div class="total-row"><span>GST (18%)</span><span>₹${inv.gstAmount?.toLocaleString('en-IN')}</span></div>
    <div class="total-grand"><span>TOTAL DUE</span><span>₹${inv.grandTotal?.toLocaleString('en-IN')}</span></div>
  </div>
</div>
<div class="footer">
  This is a computer-generated invoice. VendorBridge ERP Platform &nbsp;|&nbsp; Generated on ${new Date().toLocaleString('en-IN')}
</div>
</body></html>`);
    w.document.close();
    w.print();
  };

  const sendEmail = () => {
    const v = vById(emailInv.vendorId);
    showMsg(`✓ Invoice ${emailInv.invoiceNumber} sent to ${emailTo || v?.email}`);
    setEmailInv(null); setEmailTo('');
  };

  const totalPending = allInvoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.grandTotal, 0);
  const totalPaid    = allInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.grandTotal, 0);

  return (
    <div className="animate-fade">
      <SectionHeader
        title="Invoices"
        subtitle={`${allInvoices.filter(i => i.status === 'pending').length} pending · ${allInvoices.filter(i => i.status === 'paid').length} paid`}
      />
      <Alert msg={msg} type={msgType} />

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Invoices',    value: allInvoices.length,                                     color: '#3b82f6' },
          { label: 'Pending Amount',    value: fmt(totalPending),                                       color: '#f59e0b' },
          { label: 'Paid Amount',       value: fmt(totalPaid),                                          color: '#10b981' },
          { label: 'Overdue',           value: allInvoices.filter(i => i.status !== 'paid' && new Date(i.dueDate) < new Date()).length, color: '#ef4444' },
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
          <SearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices..." />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ ...S.select, width: 150 }}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Table */}
      <div style={S.card}>
        {filtered.length === 0
          ? <EmptyState icon="💳" title="No invoices found" desc={isVendor ? 'No invoices for your account yet.' : 'Invoices are auto-generated on PO approval.'} />
          : (
            <Table
              heads={['Invoice #', 'Vendor', 'Subtotal', 'GST', 'Grand Total', 'Due Date', 'Status', 'Actions']}
              rows={filtered.map(inv => {
                const isOverdue = inv.status !== 'paid' && new Date(inv.dueDate) < new Date();
                return (
                  <tr key={inv.id} className="table-row-hover">
                    <td style={{ ...S.td, color: '#60a5fa', fontWeight: 700, fontFamily: 'monospace' }}>{inv.invoiceNumber}</td>
                    <td style={S.td}>{vById(inv.vendorId)?.name}</td>
                    <td style={S.td}>{fmt(inv.subtotal)}</td>
                    <td style={S.td}>{fmt(inv.gstAmount)}</td>
                    <td style={{ ...S.td, fontWeight: 700, color: '#34d399' }}>{fmt(inv.grandTotal)}</td>
                    <td style={{ ...S.td, color: isOverdue ? '#f87171' : '#94a3b8' }}>{fmtD(inv.dueDate)}{isOverdue && ' ⚠'}</td>
                    <td style={S.td}><Badge type={inv.status === 'paid' ? 'green' : isOverdue ? 'red' : 'amber'}>{inv.status}</Badge></td>
                    <td style={S.td}>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <Btn type="ghost" sm onClick={() => setViewing(inv)}>View</Btn>
                        <Btn type="outline" sm onClick={() => printInv(inv)}>🖨</Btn>
                        <Btn type="outline" sm onClick={() => { setEmailInv(inv); setEmailTo(''); }}>📧</Btn>
                        {canPay && inv.status !== 'paid' && (
                          <Btn type="success" sm onClick={() => markPaid(inv)}>Mark Paid</Btn>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            />
          )}
      </div>

      {/* ── View Modal */}
      {viewing && (
        <Modal size="lg" title={viewing.invoiceNumber} subtitle={`Tax Invoice · ${fmtD(viewing.createdAt)}`} onClose={() => setViewing(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>BILLED TO</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#f1f5f9' }}>{vById(viewing.vendorId)?.name}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{vById(viewing.vendorId)?.email}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>GST: {vById(viewing.vendorId)?.gst || '—'}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '12px 14px', textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>INVOICE INFO</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Issued: {fmtD(viewing.createdAt)}</div>
              <div style={{ fontSize: 12, color: viewing.status !== 'paid' && new Date(viewing.dueDate) < new Date() ? '#f87171' : '#64748b', marginTop: 4 }}>Due: {fmtD(viewing.dueDate)}</div>
              <div style={{ marginTop: 8 }}><Badge type={viewing.status === 'paid' ? 'green' : 'amber'}>{viewing.status.toUpperCase()}</Badge></div>
            </div>
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
          <div style={{ textAlign: 'right', padding: '14px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, marginTop: 12 }}>
            <div style={{ color: '#64748b', fontSize: 13, marginBottom: 4 }}>Subtotal: {fmt(viewing.subtotal)}</div>
            <div style={{ color: '#64748b', fontSize: 13, marginBottom: 8 }}>GST (18%): {fmt(viewing.gstAmount)}</div>
            <div style={{ fontWeight: 800, fontSize: 22, color: '#34d399' }}>Total Due: {fmt(viewing.grandTotal)}</div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
            <Btn onClick={() => printInv(viewing)}>🖨 Print Invoice</Btn>
            <Btn type="outline" onClick={() => { setEmailInv(viewing); setViewing(null); }}>📧 Send Email</Btn>
            {canPay && viewing.status !== 'paid' && <Btn type="success" onClick={() => markPaid(viewing)}>✓ Mark as Paid</Btn>}
            <Btn type="ghost" onClick={() => setViewing(null)}>Close</Btn>
          </div>
        </Modal>
      )}

      {/* ── Email Modal */}
      {emailInv && (
        <Modal title="📧 Send Invoice via Email" onClose={() => setEmailInv(null)}>
          <Field label="Invoice Number">
            <Input value={emailInv.invoiceNumber} readOnly style={{ ...S.input, background: 'rgba(255,255,255,0.02)', color: '#64748b' }} />
          </Field>
          <Field label="To Email">
            <Input type="email" value={emailTo || vById(emailInv.vendorId)?.email || ''} onChange={e => setEmailTo(e.target.value)} />
          </Field>
          <Field label="Subject">
            <Input value={`Invoice ${emailInv.invoiceNumber} — VendorBridge ERP`} readOnly style={{ ...S.input, background: 'rgba(255,255,255,0.02)', color: '#64748b' }} />
          </Field>
          <Field label="Message">
            <Textarea rows={4} defaultValue={`Dear ${vById(emailInv.vendorId)?.name},\n\nPlease find attached Invoice ${emailInv.invoiceNumber} for ${fmt(emailInv.grandTotal)}.\nPayment due by ${fmtD(emailInv.dueDate)}.\n\nRegards,\nVendorBridge ERP`} />
          </Field>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn onClick={sendEmail}>📧 Send Invoice</Btn>
            <Btn type="outline" onClick={() => setEmailInv(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
