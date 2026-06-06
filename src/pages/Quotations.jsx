// Quotations — Vendor submission + team view
import { useState } from 'react';
import S from '../styles/theme';
import { Badge, Btn, Modal, Alert, Field, Input, Textarea, Table, SectionHeader, EmptyState } from '../components/shared';
import { genId, today, fmt, fmtD, STATUS_BADGE } from '../utils/helpers';

export default function Quotations({ db, setDb, user }) {
  const [showForm, setShowForm] = useState(false);
  const [selRFQ, setSelRFQ] = useState('');
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ items: [], deliveryDays: 14, notes: '' });
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');

  const isVendor = user.role === 'vendor';
  const myQuotes = isVendor ? db.quotations.filter(q => q.vendorId === user.vendorId) : db.quotations;
  const filtered = myQuotes.filter(q => {
    const rfq = db.rfqs.find(r => r.id === q.rfqId);
    return rfq?.title.toLowerCase().includes(search.toLowerCase()) || q.id.toLowerCase().includes(search.toLowerCase());
  });

  const vById = id => db.vendors.find(v => v.id === id);
  const rById = id => db.rfqs.find(r => r.id === id);
  const eligibleRFQs = isVendor
    ? db.rfqs.filter(r => r.assignedVendors.includes(user.vendorId) && r.status !== 'closed' && !db.quotations.find(q => q.rfqId === r.id && q.vendorId === user.vendorId))
    : [];
  const submittedRFQs = isVendor
    ? db.rfqs.filter(r => db.quotations.find(q => q.rfqId === r.id && q.vendorId === user.vendorId))
    : [];

  const showMsg = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const openForm = (rfqId, existingQuote = null) => {
    const rfq = rById(rfqId);
    if (!rfq) return;
    setSelRFQ(rfqId);
    setEditing(existingQuote);
    if (existingQuote) {
      setForm({ items: existingQuote.items.map(it => ({ ...it })), deliveryDays: existingQuote.deliveryDays, notes: existingQuote.notes });
    } else {
      setForm({ items: rfq.items.map(it => ({ ...it, unitPrice: 0, total: 0 })), deliveryDays: 14, notes: '' });
    }
    setShowForm(true);
  };

  const updPrice = (i, p) => {
    const items = [...form.items];
    items[i].unitPrice = +p;
    items[i].total = items[i].qty * +p;
    setForm({ ...form, items });
  };

  const sub = form.items.reduce((s, it) => s + (it.total || 0), 0);
  const grand = sub * 1.18;

  const submit = () => {
    if (form.items.some(it => !it.unitPrice)) { showMsg('Please enter unit price for all items.'); return; }

    if (editing) {
      setDb(d => ({
        ...d,
        quotations: d.quotations.map(q => q.id === editing.id ? { ...q, items: form.items, totalAmount: sub, grandTotal: grand, deliveryDays: form.deliveryDays, notes: form.notes, status: 'submitted', submittedAt: today() } : q),
        logs: [...d.logs, { id: genId('log'), action: 'Quotation Updated', detail: `${user.name} updated quote for ${rById(selRFQ)?.title}`, timestamp: new Date().toISOString(), userId: user.id, type: 'quotation' }],
      }));
      showMsg('Quotation updated successfully!');
    } else {
      const q = { id: genId('q'), rfqId: selRFQ, vendorId: user.vendorId, items: form.items, totalAmount: sub, gst: 18, grandTotal: grand, deliveryDays: form.deliveryDays, notes: form.notes, status: 'submitted', submittedAt: today() };
      setDb(d => ({
        ...d,
        quotations: [...d.quotations, q],
        rfqs: d.rfqs.map(r => r.id === selRFQ ? { ...r, status: 'quoted' } : r),
        logs: [...d.logs, { id: genId('log'), action: 'Quotation Submitted', detail: `${user.name} submitted quote for "${rById(selRFQ)?.title}"`, timestamp: new Date().toISOString(), userId: user.id, type: 'quotation' }],
      }));
      showMsg('Quotation submitted successfully!');
    }
    setShowForm(false); setEditing(null);
  };

  const isApproved = q => !!db.approvals.find(a => a.quotationId === q.id && a.status === 'approved');

  return (
    <div className="animate-fade">
      <SectionHeader
        title="Quotations"
        subtitle={isVendor ? `${myQuotes.length} submitted · ${eligibleRFQs.length} pending` : `${db.quotations.length} total quotations`}
      />
      <Alert msg={msg} type="success" />

      {/* Vendor: Submit panel */}
      {isVendor && eligibleRFQs.length > 0 && (
        <div style={{ ...S.card, background: 'linear-gradient(135deg, rgba(30,64,175,0.2), rgba(6,182,212,0.08))', border: '1px solid rgba(59,130,246,0.2)', marginBottom: 20 }}>
          <div style={S.cardHeader}>
            <div>
              <div style={S.cardTitle}>Submit New Quotation</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{eligibleRFQs.length} RFQ(s) awaiting your quote</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {eligibleRFQs.map(r => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: 13.5 }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>📋 {r.items.length} items · 📅 Due {fmtD(r.deadline)}</div>
                </div>
                <Btn sm onClick={() => openForm(r.id)}>Submit Quote →</Btn>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ ...S.card, padding: '14px 16px', marginBottom: 16 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search quotations..."
          style={{ ...S.input, background: 'transparent', border: 'none', fontSize: 14, outline: 'none', width: '100%' }}
        />
      </div>

      {/* Quotations Table */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <div style={S.cardTitle}>{isVendor ? 'My Quotations' : 'All Quotations'}</div>
          <Badge type="gray">{filtered.length} records</Badge>
        </div>
        {filtered.length === 0
          ? <EmptyState icon="💬" title="No quotations found" desc={isVendor ? "You haven't submitted any quotations yet." : "No quotations in the system."} />
          : (
            <Table
              heads={['Quote ID', 'RFQ', isVendor ? 'Submitted' : 'Vendor', 'Grand Total', 'Delivery', 'Status', 'Actions']}
              rows={filtered.map(q => {
                const approved = isApproved(q);
                return (
                  <tr key={q.id} className="table-row-hover">
                    <td style={{ ...S.td, fontFamily: 'monospace', fontSize: 11, color: '#334155' }}>{q.id.slice(0, 12)}…</td>
                    <td style={S.td}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{rById(q.rfqId)?.title || q.rfqId}</div>
                    </td>
                    <td style={S.td}>{isVendor ? fmtD(q.submittedAt) : vById(q.vendorId)?.name}</td>
                    <td style={{ ...S.td, fontWeight: 700, color: '#34d399' }}>{fmt(q.grandTotal)}</td>
                    <td style={S.td}>{q.deliveryDays} days</td>
                    <td style={S.td}>
                      <Badge type={approved ? 'green' : STATUS_BADGE[q.status] || 'gray'}>
                        {approved ? '✓ Approved' : q.status}
                      </Badge>
                    </td>
                    <td style={S.td}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Btn type="ghost" sm onClick={() => setViewing(q)}>View</Btn>
                        {isVendor && !approved && <Btn type="outline" sm onClick={() => openForm(q.rfqId, q)}>Edit</Btn>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            />
          )}
      </div>

      {/* ── Submit Form Modal */}
      {showForm && (
        <Modal size="xl" title={editing ? '✏ Edit Quotation' : '💬 Submit Quotation'} subtitle={rById(selRFQ)?.title} onClose={() => { setShowForm(false); setEditing(null); }}>
          {/* Pricing Table */}
          <div style={{ overflowX: 'auto', marginBottom: 16 }}>
            <table style={{ ...S.table }}>
              <thead>
                <tr>
                  {['Item', 'Qty', 'Unit', 'Unit Price (₹)', 'Total (₹)'].map(h => <th key={h} style={S.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {form.items.map((it, i) => (
                  <tr key={i}>
                    <td style={S.td}><strong>{it.name}</strong></td>
                    <td style={S.td}>{it.qty}</td>
                    <td style={S.td}>{it.unit}</td>
                    <td style={S.td}>
                      <Input type="number" min={0} value={it.unitPrice} onChange={e => updPrice(i, e.target.value)} style={{ ...S.input, width: 140 }} />
                    </td>
                    <td style={{ ...S.td, fontWeight: 600, color: '#34d399' }}>{fmt(it.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: '14px 18px', marginBottom: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
            {[['Subtotal', sub], ['GST (18%)', sub * 0.18]].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13.5, color: '#64748b' }}>
                <span>{l}</span><span>{fmt(v)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, color: '#34d399', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span>Grand Total</span><span>{fmt(grand)}</span>
            </div>
          </div>

          <div style={S.formRow}>
            <Field label="Delivery Days">
              <Input type="number" min={1} value={form.deliveryDays} onChange={e => setForm({ ...form, deliveryDays: +e.target.value })} />
            </Field>
            <Field label="Notes / Terms">
              <Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Warranty, delivery terms, etc." />
            </Field>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <Btn onClick={submit}>{editing ? '💾 Update Quotation' : '🚀 Submit Quotation'}</Btn>
            <Btn type="outline" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* ── View Details Modal */}
      {viewing && (
        <Modal size="lg" title="Quotation Details" subtitle={`${viewing.id} · ${rById(viewing.rfqId)?.title}`} onClose={() => setViewing(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            {[
              ['Vendor', vById(viewing.vendorId)?.name],
              ['RFQ', rById(viewing.rfqId)?.title],
              ['Submitted', fmtD(viewing.submittedAt)],
              ['Delivery', `${viewing.deliveryDays} days`],
            ].map(([k, v]) => (
              <div key={k} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{v}</div>
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
          <div style={{ textAlign: 'right', padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, marginTop: 12 }}>
            <div style={{ color: '#64748b', fontSize: 13 }}>Subtotal: {fmt(viewing.totalAmount)}</div>
            <div style={{ color: '#64748b', fontSize: 13 }}>GST (18%): {fmt(viewing.totalAmount * 0.18)}</div>
            <div style={{ fontWeight: 800, fontSize: 20, color: '#34d399', marginTop: 8 }}>Total: {fmt(viewing.grandTotal)}</div>
          </div>
          {viewing.notes && <p style={{ color: '#64748b', marginTop: 12, fontSize: 13, fontStyle: 'italic' }}>📝 {viewing.notes}</p>}
          <div style={{ marginTop: 16 }}>
            <Badge type={isApproved(viewing) ? 'green' : 'cyan'}>{isApproved(viewing) ? '✓ Approved' : viewing.status}</Badge>
          </div>
          <Btn type="outline" onClick={() => setViewing(null)} style={{ marginTop: 16 }}>Close</Btn>
        </Modal>
      )}
    </div>
  );
}
