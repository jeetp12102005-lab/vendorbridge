// RFQ Management — Create, view, manage RFQs
import { useState } from 'react';
import S from '../styles/theme';
import { Badge, Btn, Modal, Alert, Field, Input, Select, Textarea, Table, SearchInput, SectionHeader, EmptyState } from '../components/shared';
import { genId, today, fmtD, STATUS_BADGE } from '../utils/helpers';

export default function RFQMgmt({ db, setDb, user }) {
  const [showAdd, setShowAdd] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [msg, setMsg] = useState('');

  const canCreate = user.role === 'officer' || user.role === 'admin';
  const isVendor = user.role === 'vendor';

  const allRFQs = isVendor ? db.rfqs.filter(r => r.assignedVendors.includes(user.vendorId)) : db.rfqs;
  const filtered = allRFQs.filter(r =>
    (filterStatus === 'all' || r.status === filterStatus) &&
    (r.title.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()))
  );

  const vById = id => db.vendors.find(v => v.id === id);
  const uById = id => db.users.find(u => u.id === id);

  const blank = { title: '', description: '', deadline: '', assignedVendors: [], items: [{ name: '', qty: 1, unit: 'pcs' }], attachments: [] };
  const [form, setForm] = useState(blank);
  const [attachName, setAttachName] = useState('');

  const showMsg = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const addItem = () => setForm({ ...form, items: [...form.items, { name: '', qty: 1, unit: 'pcs' }] });
  const removeItem = i => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });
  const updateItem = (i, k, v) => {
    const items = [...form.items]; items[i][k] = k === 'qty' ? +v : v; setForm({ ...form, items });
  };
  const toggleVendor = vid => {
    const av = form.assignedVendors.includes(vid)
      ? form.assignedVendors.filter(x => x !== vid)
      : [...form.assignedVendors, vid];
    setForm({ ...form, assignedVendors: av });
  };

  const save = () => {
    if (!form.title.trim()) { showMsg('Please enter an RFQ title.'); return; }
    if (form.items.some(it => !it.name.trim())) { showMsg('All item names are required.'); return; }
    const nrfq = { ...form, id: genId('rfq'), status: 'open', createdBy: user.id, createdAt: today() };
    setDb(d => ({ ...d, rfqs: [...d.rfqs, nrfq], logs: [...d.logs, { id: genId('log'), action: 'RFQ Created', detail: `"${form.title}" created by ${user.name}`, timestamp: new Date().toISOString(), userId: user.id, type: 'rfq' }] }));
    showMsg('RFQ created and sent to vendors!');
    setShowAdd(false); setForm(blank);
  };

  const closeRFQ = rfq => {
    setDb(d => ({ ...d, rfqs: d.rfqs.map(r => r.id === rfq.id ? { ...r, status: 'closed' } : r), logs: [...d.logs, { id: genId('log'), action: 'RFQ Closed', detail: `"${rfq.title}" marked as closed`, timestamp: new Date().toISOString(), userId: user.id, type: 'rfq' }] }));
    setViewing(null);
    showMsg('RFQ closed.');
  };

  const STATUS_COLORS = { open: '#3b82f6', quoted: '#f59e0b', approved: '#10b981', closed: '#475569', draft: '#94a3b8' };
  const quoteCount = rfqId => db.quotations.filter(q => q.rfqId === rfqId).length;

  return (
    <div className="animate-fade">
      <SectionHeader
        title="RFQ Management"
        subtitle={`${allRFQs.filter(r => r.status === 'open').length} open · ${allRFQs.length} total requests`}
        action={canCreate && <Btn onClick={() => setShowAdd(true)}>＋ Create RFQ</Btn>}
      />

      <Alert msg={msg} type="success" />

      {/* Filters */}
      <div style={{ ...S.card, padding: '14px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <SearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title or ID..." />
        </div>
        <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...S.select, width: 160 }}>
          <option value="all">All Status</option>
          {['open', 'quoted', 'approved', 'closed'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </Select>
      </div>

      {/* Pipeline Stats */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Open', count: allRFQs.filter(r => r.status === 'open').length, color: '#3b82f6' },
          { label: 'Quoted', count: allRFQs.filter(r => r.status === 'quoted').length, color: '#f59e0b' },
          { label: 'Approved', count: allRFQs.filter(r => r.status === 'approved').length, color: '#10b981' },
          { label: 'Closed', count: allRFQs.filter(r => r.status === 'closed').length, color: '#475569' },
        ].map(s => (
          <div key={s.label} onClick={() => setFilterStatus(s.label.toLowerCase())} style={{ ...S.cardSm, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${s.color}40`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
          >
            <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.count}</div>
              <div style={{ fontSize: 11, color: '#475569' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <EmptyState icon="📄" title="No RFQs found" desc={isVendor ? "No RFQs have been assigned to you yet." : "Create your first RFQ to begin procurement."} />}

      {/* RFQ Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(r => {
          const sc = STATUS_COLORS[r.status] || '#94a3b8';
          const qc = quoteCount(r.id);
          return (
            <div
              key={r.id}
              style={{ background: '#0f1629', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '16px 20px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 16 }}
              onClick={() => setViewing(r)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${sc}40`; e.currentTarget.style.boxShadow = `0 4px 16px ${sc}10`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Status stripe */}
              <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, background: sc, flexShrink: 0 }} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#f1f5f9' }}>{r.title}</span>
                  <Badge type={STATUS_BADGE[r.status] || 'gray'}>{r.status}</Badge>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#334155' }}>{r.id}</span>
                </div>
                <div style={{ fontSize: 12.5, color: '#64748b', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 500 }}>
                  {r.description || 'No description provided.'}
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#475569', flexWrap: 'wrap' }}>
                  <span>📋 {r.items.length} item(s)</span>
                  <span>📅 Deadline: {fmtD(r.deadline)}</span>
                  <span>🏢 {r.assignedVendors.length} vendor(s)</span>
                  <span style={{ color: qc > 0 ? '#f59e0b' : '#334155' }}>💬 {qc} quote(s)</span>
                  <span>👤 {uById(r.createdBy)?.name || 'Unknown'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <Btn type="ghost" sm onClick={e => { e.stopPropagation(); setViewing(r); }}>View Details</Btn>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Create RFQ Modal */}
      {showAdd && (
        <Modal size="xl" title="📄 Create New RFQ" subtitle="Define procurement requirements and assign vendors" onClose={() => setShowAdd(false)}>
          <div style={S.formRow}>
            <Field label="RFQ Title *">
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Office Laptops Procurement Q3" />
            </Field>
            <Field label="Submission Deadline">
              <Input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} min={today()} />
            </Field>
          </div>
          <Field label="Description / Requirements">
            <Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Detailed requirements, specifications, terms and conditions..." />
          </Field>

          {/* Items */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Items / Services Required</div>
            {form.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <Input placeholder="Item name or description" value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} style={{ ...S.input, flex: 3 }} />
                <Input type="number" min={1} value={item.qty} onChange={e => updateItem(i, 'qty', e.target.value)} style={{ ...S.input, flex: 1, textAlign: 'center' }} />
                <Select value={item.unit} onChange={e => updateItem(i, 'unit', e.target.value)} style={{ ...S.select, flex: 1 }}>
                  {['pcs', 'kg', 'ltr', 'box', 'set', 'unit', 'yr', 'mo'].map(u => <option key={u}>{u}</option>)}
                </Select>
                {form.items.length > 1 && (
                  <button onClick={() => removeItem(i)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, cursor: 'pointer', color: '#f87171', padding: '8px 10px', fontSize: 14 }}>✕</button>
                )}
              </div>
            ))}
            <Btn type="ghost" sm onClick={addItem}>＋ Add Item</Btn>
          </div>

          {/* Vendor Assignment */}
          <Field label="Assign Vendors">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8, padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', maxHeight: 160, overflowY: 'auto' }}>
              {db.vendors.filter(v => v.status === 'active').map(v => (
                <label key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', padding: '6px 8px', borderRadius: 6, background: form.assignedVendors.includes(v.id) ? 'rgba(59,130,246,0.12)' : 'transparent', border: `1px solid ${form.assignedVendors.includes(v.id) ? 'rgba(59,130,246,0.3)' : 'transparent'}`, transition: 'all 0.15s' }}>
                  <input type="checkbox" checked={form.assignedVendors.includes(v.id)} onChange={() => toggleVendor(v.id)} style={{ accentColor: '#3b82f6' }} />
                  <div>
                    <div style={{ fontWeight: 500, color: '#e2e8f0' }}>{v.name}</div>
                    <div style={{ fontSize: 10, color: '#475569' }}>{v.category}</div>
                  </div>
                </label>
              ))}
            </div>
          </Field>

          {/* File Attachment (UI stub) */}
          <Field label="Attachments (Optional)">
            <div style={{ display: 'flex', gap: 8 }}>
              <Input value={attachName} onChange={e => setAttachName(e.target.value)} placeholder="Filename (e.g. specs.pdf)" style={{ ...S.input, flex: 1 }} />
              <Btn type="ghost" sm onClick={() => { if (attachName.trim()) { setForm({ ...form, attachments: [...form.attachments, attachName.trim()] }); setAttachName(''); } }}>＋ Attach</Btn>
            </div>
            {form.attachments.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {form.attachments.map((a, i) => (
                  <span key={i} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', borderRadius: 6, padding: '3px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    📎 {a}
                    <button onClick={() => setForm({ ...form, attachments: form.attachments.filter((_, j) => j !== i) })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', fontSize: 12 }}>✕</button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <Btn onClick={save}>🚀 Submit RFQ</Btn>
            <Btn type="outline" onClick={() => setShowAdd(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* ── View RFQ Modal */}
      {viewing && (
        <Modal size="lg" title={viewing.title} subtitle={`RFQ ID: ${viewing.id}`} onClose={() => setViewing(null)}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <Badge type={STATUS_BADGE[viewing.status] || 'gray'}>{viewing.status}</Badge>
            <span style={{ fontSize: 12, color: '#475569' }}>📅 Deadline: {fmtD(viewing.deadline)}</span>
            <span style={{ fontSize: 12, color: '#475569' }}>📋 {viewing.items.length} item(s)</span>
            <span style={{ fontSize: 12, color: '#475569' }}>💬 {quoteCount(viewing.id)} quote(s)</span>
          </div>

          {viewing.description && (
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '12px 14px', marginBottom: 16, fontSize: 13.5, color: '#94a3b8', lineHeight: 1.6 }}>
              {viewing.description}
            </div>
          )}

          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: '#94a3b8' }}>📋 ITEMS REQUIRED</div>
          <Table
            heads={['Item', 'Qty', 'Unit']}
            rows={viewing.items.map((it, i) => (
              <tr key={i}>
                <td style={S.td}>{it.name}</td>
                <td style={{ ...S.td, fontWeight: 700, color: '#60a5fa' }}>{it.qty}</td>
                <td style={S.td}>{it.unit}</td>
              </tr>
            ))}
          />

          <div style={{ fontWeight: 700, fontSize: 13, margin: '16px 0 10px', color: '#94a3b8' }}>🏢 ASSIGNED VENDORS</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {viewing.assignedVendors.map(vid => {
              const v = vById(vid);
              return v ? (
                <div key={vid} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, padding: '6px 12px', fontSize: 13 }}>
                  <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{v.category}</div>
                </div>
              ) : null;
            })}
            {viewing.assignedVendors.length === 0 && <span style={{ color: '#334155', fontSize: 13 }}>No vendors assigned</span>}
          </div>

          {viewing.attachments?.length > 0 && (
            <>
              <div style={{ fontWeight: 700, fontSize: 13, margin: '16px 0 10px', color: '#94a3b8' }}>📎 ATTACHMENTS</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {viewing.attachments.map((a, i) => (
                  <span key={i} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', borderRadius: 6, padding: '4px 12px', fontSize: 12 }}>📎 {a}</span>
                ))}
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            {(user.role === 'admin' || user.role === 'officer') && viewing.status !== 'closed' && (
              <Btn type="danger" onClick={() => closeRFQ(viewing)}>Close RFQ</Btn>
            )}
            <Btn type="outline" onClick={() => setViewing(null)}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
