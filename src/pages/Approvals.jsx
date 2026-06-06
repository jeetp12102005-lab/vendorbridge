// Approvals — Manager workflow: review, approve, reject quotations
import { useState } from 'react';
import S from '../styles/theme';
import { Badge, Btn, Modal, Alert, Field, Textarea, Table, SectionHeader, EmptyState } from '../components/shared';
import { genId, today, fmt, fmtD, fmtDT, stars } from '../utils/helpers';

export default function Approvals({ db, setDb, user }) {
  const [reviewing, setReviewing] = useState(null);
  const [remarks, setRemarks]     = useState('');
  const [msg, setMsg]             = useState('');
  const [msgType, setMsgType]     = useState('success');
  const [histTab, setHistTab]     = useState('pending'); // 'pending' | 'history'

  const vById = id => db.vendors.find(v => v.id === id);
  const rById = id => db.rfqs.find(r => r.id === id);
  const uById = id => db.users.find(u => u.id === id);

  // Quotes that have NOT been actioned yet
  const pendingQuotes = db.quotations.filter(
    q => !db.approvals.find(a => a.quotationId === q.id)
  );
  const canApprove = user.role === 'manager' || user.role === 'admin';

  const showMsg = (m, t = 'success') => {
    setMsg(m); setMsgType(t);
    setTimeout(() => setMsg(''), 4000);
  };

  const doAction = (action) => {
    const q = reviewing;
    const apId = genId('ap');
    const newAp = {
      id: apId,
      quotationId: q.id,
      rfqId: q.rfqId,
      vendorId: q.vendorId,
      amount: q.grandTotal,
      status: action,
      approvedBy: user.id,
      remarks: remarks.trim() || (action === 'approved' ? 'Approved by manager.' : 'Rejected.'),
      createdAt: today(),
      updatedAt: today(),
    };

    let newPOs  = [...db.purchaseOrders];
    let newInvs = [...db.invoices];
    let newRFQs = [...db.rfqs];

    if (action === 'approved') {
      const poNum = `PO-${new Date().getFullYear()}-${String(db.purchaseOrders.length + 1).padStart(3, '0')}`;
      const poId  = genId('po');
      const invNum = `INV-${new Date().getFullYear()}-${String(db.invoices.length + 1).padStart(3, '0')}`;
      const due = new Date(); due.setDate(due.getDate() + 30);

      newPOs = [...newPOs, {
        id: poId, poNumber: poNum, approvalId: apId,
        quotationId: q.id, rfqId: q.rfqId, vendorId: q.vendorId,
        items: q.items, subtotal: q.totalAmount,
        gst: 18, gstAmount: q.totalAmount * 0.18,
        grandTotal: q.grandTotal, status: 'active',
        createdAt: today(), deliveryDate: '',
      }];

      newInvs = [...newInvs, {
        id: genId('inv'), invoiceNumber: invNum, poId,
        vendorId: q.vendorId, items: q.items,
        subtotal: q.totalAmount, gst: 18,
        gstAmount: q.totalAmount * 0.18,
        grandTotal: q.grandTotal, status: 'pending',
        createdAt: today(),
        dueDate: due.toISOString().split('T')[0],
      }];

      newRFQs = db.rfqs.map(r => r.id === q.rfqId ? { ...r, status: 'approved' } : r);
    }

    setDb(d => ({
      ...d,
      approvals:      [...d.approvals, newAp],
      purchaseOrders: newPOs,
      invoices:       newInvs,
      rfqs:           newRFQs,
      logs: [...d.logs,
        { id: genId('log'), action: `Quotation ${action.charAt(0).toUpperCase() + action.slice(1)}`, detail: `${user.name} ${action} quote from ${vById(q.vendorId)?.name}`, timestamp: new Date().toISOString(), userId: user.id, type: 'approval' },
        ...(action === 'approved' ? [
          { id: genId('log'), action: 'Purchase Order Created', detail: `Auto-generated PO for ${vById(q.vendorId)?.name}`, timestamp: new Date().toISOString(), userId: user.id, type: 'po' },
          { id: genId('log'), action: 'Invoice Generated',     detail: `Auto-generated invoice for ${vById(q.vendorId)?.name}`, timestamp: new Date().toISOString(), userId: user.id, type: 'invoice' },
        ] : []),
      ],
    }));

    showMsg(
      action === 'approved'
        ? '✅ Quotation approved! PO & Invoice auto-generated.'
        : '✕ Quotation rejected.',
      action === 'approved' ? 'success' : 'danger'
    );
    setReviewing(null); setRemarks('');
  };

  const STATUS_C = { approved: 'green', rejected: 'red' };

  return (
    <div className="animate-fade">
      <SectionHeader
        title="Approval Workflow"
        subtitle={`${pendingQuotes.length} pending · ${db.approvals.length} actioned`}
      />
      <Alert msg={msg} type={msgType} />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 4, border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content' }}>
        {[['pending', `⏳ Pending (${pendingQuotes.length})`], ['history', `📋 History (${db.approvals.length})`]].map(([t, l]) => (
          <button key={t} onClick={() => setHistTab(t)} style={{ padding: '8px 20px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.15s', background: histTab === t ? 'linear-gradient(135deg,#1e40af,#3b82f6)' : 'transparent', color: histTab === t ? '#fff' : '#64748b', boxShadow: histTab === t ? '0 2px 8px rgba(59,130,246,0.3)' : 'none' }}>
            {l}
          </button>
        ))}
      </div>

      <div className="grid-2">
        {/* ── Pending Panel */}
        {histTab === 'pending' && (
          <div style={{ gridColumn: '1 / -1' }}>
            {pendingQuotes.length === 0
              ? <EmptyState icon="🎉" title="All caught up!" desc="No quotations pending approval right now." />
              : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {pendingQuotes.map(q => {
                    const v = vById(q.vendorId);
                    const rfq = rById(q.rfqId);
                    return (
                      <div key={q.id} style={{ background: '#0f1629', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.2)'; }}
                      >
                        <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, background: '#f59e0b', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                            <span style={{ fontWeight: 700, fontSize: 15, color: '#f1f5f9' }}>{rfq?.title}</span>
                            <Badge type="amber">Pending Review</Badge>
                          </div>
                          <div style={{ display: 'flex', gap: 20, fontSize: 12.5, color: '#64748b', flexWrap: 'wrap' }}>
                            <span>🏢 {v?.name}</span>
                            <span>💰 Grand Total: <strong style={{ color: '#34d399' }}>{fmt(q.grandTotal)}</strong></span>
                            <span>🚚 {q.deliveryDays} days delivery</span>
                            <span>⭐ {stars(v?.rating)} ({v?.rating})</span>
                            <span>📅 Submitted {fmtD(q.submittedAt)}</span>
                          </div>
                          {q.notes && <div style={{ fontSize: 12, color: '#475569', marginTop: 6, fontStyle: 'italic' }}>📝 {q.notes}</div>}
                        </div>
                        {canApprove && (
                          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                            <Btn sm onClick={() => { setReviewing(q); setRemarks(''); }}>Review →</Btn>
                          </div>
                        )}
                        {!canApprove && <Badge type="gray">Manager only</Badge>}
                      </div>
                    );
                  })}
                </div>
              )}
          </div>
        )}

        {/* ── History Panel */}
        {histTab === 'history' && (
          <div style={{ gridColumn: '1 / -1' }}>
            {db.approvals.length === 0
              ? <EmptyState icon="📋" title="No approval history yet" />
              : (
                <div style={S.card}>
                  <Table
                    heads={['RFQ', 'Vendor', 'Amount', 'Status', 'Decision By', 'Remarks', 'Date']}
                    rows={[...db.approvals].reverse().map(ap => (
                      <tr key={ap.id} className="table-row-hover">
                        <td style={S.td}><div style={{ fontWeight: 600 }}>{rById(ap.rfqId)?.title}</div></td>
                        <td style={S.td}>{vById(ap.vendorId)?.name}</td>
                        <td style={{ ...S.td, fontWeight: 700, color: '#34d399' }}>{fmt(ap.amount)}</td>
                        <td style={S.td}><Badge type={STATUS_C[ap.status] || 'gray'}>{ap.status === 'approved' ? '✅ Approved' : '✕ Rejected'}</Badge></td>
                        <td style={S.td}>{uById(ap.approvedBy)?.name || '—'}</td>
                        <td style={{ ...S.td, fontSize: 12, color: '#64748b', maxWidth: 200 }}>{ap.remarks || '—'}</td>
                        <td style={{ ...S.td, fontSize: 12, color: '#475569' }}>{fmtD(ap.createdAt)}</td>
                      </tr>
                    ))}
                  />
                </div>
              )}
          </div>
        )}
      </div>

      {/* ── Review Modal */}
      {reviewing && (
        <Modal size="lg" title="📋 Review Quotation" subtitle="Carefully review before approving or rejecting" onClose={() => { setReviewing(null); setRemarks(''); }}>
          {/* Quotation summary */}
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: '16px 18px', marginBottom: 18, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              {[
                ['RFQ', rById(reviewing.rfqId)?.title],
                ['Vendor', vById(reviewing.vendorId)?.name],
                ['Grand Total', fmt(reviewing.grandTotal)],
                ['Delivery', `${reviewing.deliveryDays} days`],
                ['Submitted', fmtD(reviewing.submittedAt)],
                ['Vendor Rating', `${stars(vById(reviewing.vendorId)?.rating)} (${vById(reviewing.vendorId)?.rating})`],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: k === 'Grand Total' ? 20 : 14, fontWeight: k === 'Grand Total' ? 800 : 600, color: k === 'Grand Total' ? '#34d399' : '#e2e8f0' }}>{v}</div>
                </div>
              ))}
            </div>
            {reviewing.notes && <div style={{ fontSize: 13, color: '#64748b', fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>📝 {reviewing.notes}</div>}
          </div>

          {/* Items breakdown */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Item Breakdown</div>
            <Table
              heads={['Item', 'Qty', 'Unit Price', 'Total']}
              rows={reviewing.items.map((it, i) => (
                <tr key={i}>
                  <td style={S.td}>{it.name}</td>
                  <td style={S.td}>{it.qty}</td>
                  <td style={S.td}>{fmt(it.unitPrice)}</td>
                  <td style={{ ...S.td, fontWeight: 600, color: '#34d399' }}>{fmt(it.total)}</td>
                </tr>
              ))}
            />
          </div>

          <Field label="Approval Remarks (Optional)">
            <Textarea
              rows={3}
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="Add remarks for this decision — reason for approval or rejection..."
            />
          </Field>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button
              style={{ ...S.btn('success'), flex: 1, justifyContent: 'center', fontSize: 14 }}
              onClick={() => doAction('approved')}
            >✅ Approve & Generate PO</button>
            <button
              style={{ ...S.btn('danger'), flex: 1, justifyContent: 'center', fontSize: 14 }}
              onClick={() => doAction('rejected')}
            >✕ Reject</button>
          </div>
          <div style={{ fontSize: 11, color: '#334155', textAlign: 'center', marginTop: 10 }}>
            Approving will auto-generate a Purchase Order and Invoice.
          </div>
        </Modal>
      )}
    </div>
  );
}
