// Vendor Management — Full CRUD with dark card grid
import { useState } from 'react';
import S from '../styles/theme';
import { Badge, Btn, Modal, Alert, Field, Input, Select, Textarea, Table, SearchInput, SectionHeader, EmptyState, ProgressBar } from '../components/shared';
import { genId, today, VENDOR_CATEGORIES, stars, STATUS_BADGE, fmtD } from '../utils/helpers';

export default function Vendors({ db, setDb, user }) {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success');

  const canEdit = user.role === 'admin' || user.role === 'officer';

  const blank = { name: '', category: 'Electronics', gst: '', email: '', phone: '', address: '', status: 'active', website: '', contactPerson: '' };
  const [form, setForm] = useState(blank);

  const filtered = db.vendors.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || v.category === filterCat;
    const matchStatus = filterStatus === 'all' || v.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const showMsg = (m, t = 'success') => { setMsg(m); setMsgType(t); setTimeout(() => setMsg(''), 3000); };

  const save = () => {
    if (!form.name.trim() || !form.email.trim()) { showMsg('Name and email are required.', 'danger'); return; }
    if (editing) {
      setDb(d => ({ ...d, vendors: d.vendors.map(v => v.id === editing.id ? { ...v, ...form } : v), logs: [...d.logs, { id: genId('log'), action: 'Vendor Updated', detail: `${form.name} details updated`, timestamp: new Date().toISOString(), userId: user.id, type: 'vendor' }] }));
      showMsg('Vendor updated successfully!');
    } else {
      const nv = { ...form, id: genId('v'), rating: 4.0, createdAt: today() };
      setDb(d => ({ ...d, vendors: [...d.vendors, nv], logs: [...d.logs, { id: genId('log'), action: 'Vendor Added', detail: `${form.name} registered as new vendor`, timestamp: new Date().toISOString(), userId: user.id, type: 'vendor' }] }));
      showMsg('Vendor added successfully!');
    }
    setShowAdd(false); setEditing(null);
  };

  const toggleStatus = (v) => {
    const newStatus = v.status === 'active' ? 'inactive' : 'active';
    setDb(d => ({ ...d, vendors: d.vendors.map(vn => vn.id === v.id ? { ...vn, status: newStatus } : vn), logs: [...d.logs, { id: genId('log'), action: 'Vendor Status Changed', detail: `${v.name} marked as ${newStatus}`, timestamp: new Date().toISOString(), userId: user.id, type: 'vendor' }] }));
    showMsg(`Vendor ${newStatus === 'active' ? 'activated' : 'deactivated'}.`);
  };

  const openEdit = (v) => { setEditing(v); setForm({ ...v }); setShowAdd(true); };
  const openAdd = () => { setEditing(null); setForm(blank); setShowAdd(true); };

  const CAT_COLORS = { Electronics: '#3b82f6', 'Office Supplies': '#8b5cf6', Construction: '#f59e0b', 'Food & Beverage': '#10b981', 'IT Services': '#06b6d4', Logistics: '#ef4444', Other: '#94a3b8' };
  const catColor = cat => CAT_COLORS[cat] || '#94a3b8';

  return (
    <div className="animate-fade">
      <SectionHeader
        title="Vendor Management"
        subtitle={`${db.vendors.filter(v => v.status === 'active').length} active · ${db.vendors.length} total vendors`}
        action={canEdit && <Btn onClick={openAdd}>＋ Add Vendor</Btn>}
      />

      <Alert msg={msg} type={msgType} />

      {/* Filters */}
      <div style={{ ...S.card, padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <SearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors by name, category, email..." />
        </div>
        <Select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ ...S.select, width: 180 }}>
          <option value="all">All Categories</option>
          {VENDOR_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </Select>
        <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...S.select, width: 140 }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
          {['grid', 'list'].map(m => (
            <button key={m} onClick={() => setViewMode(m)} style={{ padding: '7px 12px', background: viewMode === m ? 'rgba(59,130,246,0.2)' : 'none', border: 'none', cursor: 'pointer', color: viewMode === m ? '#60a5fa' : '#475569', fontSize: 14, borderRadius: 7, transition: 'all 0.15s' }}>
              {m === 'grid' ? '⊞' : '☰'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Vendors', value: db.vendors.length, color: '#3b82f6' },
          { label: 'Active', value: db.vendors.filter(v => v.status === 'active').length, color: '#10b981' },
          { label: 'Inactive', value: db.vendors.filter(v => v.status === 'inactive').length, color: '#f59e0b' },
          { label: 'Categories', value: [...new Set(db.vendors.map(v => v.category))].length, color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} style={{ ...S.cardSm, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 3, alignSelf: 'stretch', borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#475569' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <EmptyState icon="🏢" title="No vendors found" desc="Try adjusting your search or filters." />}

      {/* ── Grid View */}
      {viewMode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
          {filtered.map(v => (
            <div
              key={v.id}
              style={{ background: '#0f1629', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column', gap: 12, transition: 'all 0.2s', cursor: 'pointer' }}
              onClick={() => setViewing(v)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${catColor(v.category)}40`; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${catColor(v.category)}15`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: `${catColor(v.category)}20`, border: `1px solid ${catColor(v.category)}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: catColor(v.category), flexShrink: 0 }}>
                    {v.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>{v.name}</div>
                    <Badge type={v.status === 'active' ? 'green' : 'gray'} dot>{v.status}</Badge>
                  </div>
                </div>
                <Badge type="blue" style={{ background: `${catColor(v.category)}15`, color: catColor(v.category), border: `1px solid ${catColor(v.category)}30` }}>{v.category}</Badge>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 12, color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span>📧</span><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.email}</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span>📞</span>{v.phone || '—'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span>🏛</span><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.gst || '—'}</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span>📍</span>{v.address || '—'}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 13, color: '#f59e0b' }}>
                  {stars(v.rating)} <span style={{ fontSize: 11, color: '#475569', marginLeft: 4 }}>{v.rating}</span>
                </div>
                {canEdit && (
                  <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                    <Btn type="ghost" sm onClick={() => openEdit(v)}>✏ Edit</Btn>
                    <Btn type={v.status === 'active' ? 'danger' : 'success'} sm onClick={() => toggleStatus(v)}>
                      {v.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Btn>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── List View */}
      {viewMode === 'list' && (
        <div style={S.card}>
          <Table
            heads={['Vendor', 'Category', 'Contact', 'GST', 'Rating', 'Status', canEdit ? 'Actions' : '']}
            rows={filtered.map(v => (
              <tr key={v.id} className="table-row-hover" onClick={() => setViewing(v)}>
                <td style={S.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: `${catColor(v.category)}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: catColor(v.category) }}>{v.name[0]}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{v.name}</div>
                      <div style={{ fontSize: 11, color: '#475569' }}>{v.email}</div>
                    </div>
                  </div>
                </td>
                <td style={S.td}><Badge type="blue" style={{ background: `${catColor(v.category)}15`, color: catColor(v.category), border: `1px solid ${catColor(v.category)}30` }}>{v.category}</Badge></td>
                <td style={S.td}><div style={{ fontSize: 12 }}>{v.phone || '—'}</div><div style={{ fontSize: 11, color: '#475569' }}>{v.contactPerson}</div></td>
                <td style={{ ...S.td, fontFamily: 'monospace', fontSize: 11, color: '#64748b' }}>{v.gst || '—'}</td>
                <td style={S.td}><span style={{ color: '#f59e0b', fontSize: 13 }}>{stars(v.rating)}</span> <span style={{ fontSize: 11, color: '#475569' }}>{v.rating}</span></td>
                <td style={S.td}><Badge type={v.status === 'active' ? 'green' : 'gray'} dot>{v.status}</Badge></td>
                {canEdit && (
                  <td style={S.td} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Btn type="ghost" sm onClick={() => openEdit(v)}>Edit</Btn>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          />
        </div>
      )}

      {/* ── Add/Edit Modal */}
      {showAdd && (
        <Modal size="lg" title={editing ? '✏ Edit Vendor' : '＋ Add New Vendor'} subtitle="Fill in all vendor details below" onClose={() => { setShowAdd(false); setEditing(null); }}>
          <div style={S.formRow}>
            <Field label="Company Name *">
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. TechSupply Co Ltd" />
            </Field>
            <Field label="Category *">
              <Select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {VENDOR_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </Select>
            </Field>
          </div>
          <div style={S.formRow}>
            <Field label="GST Number">
              <Input value={form.gst} onChange={e => setForm({ ...form, gst: e.target.value })} placeholder="27AABCT3518Q1ZV" />
            </Field>
            <Field label="Status">
              <Select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </Field>
          </div>
          <div style={S.formRow}>
            <Field label="Email Address *">
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="vendor@company.com" />
            </Field>
            <Field label="Phone Number">
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" />
            </Field>
          </div>
          <div style={S.formRow}>
            <Field label="Contact Person">
              <Input value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} placeholder="Primary contact name" />
            </Field>
            <Field label="Website">
              <Input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://vendor.com" />
            </Field>
          </div>
          <Field label="Address">
            <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="City, State" />
          </Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <Btn onClick={save}>💾 Save Vendor</Btn>
            <Btn type="outline" onClick={() => { setShowAdd(false); setEditing(null); }}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* ── View Details Modal */}
      {viewing && (
        <Modal size="lg" title={viewing.name} subtitle={viewing.category} onClose={() => setViewing(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div style={{ fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Contact Details</div>
              {[
                ['📧 Email', viewing.email],
                ['📞 Phone', viewing.phone || '—'],
                ['👤 Contact', viewing.contactPerson || '—'],
                ['🌐 Website', viewing.website || '—'],
                ['📍 Address', viewing.address || '—'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13 }}>
                  <span style={{ color: '#64748b' }}>{k}</span>
                  <span style={{ color: '#e2e8f0', fontWeight: 500, maxWidth: 200, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Procurement Details</div>
              {[
                ['🏛 GST Number', viewing.gst || '—'],
                ['📅 Registered', fmtD(viewing.createdAt)],
                ['⭐ Rating', `${stars(viewing.rating)} (${viewing.rating})`],
                ['📄 Total Quotes', db.quotations.filter(q => q.vendorId === viewing.id).length],
                ['📦 Total POs', db.purchaseOrders.filter(p => p.vendorId === viewing.id).length],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13 }}>
                  <span style={{ color: '#64748b' }}>{k}</span>
                  <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            {canEdit && <Btn onClick={() => { setViewing(null); openEdit(viewing); }}>✏ Edit Vendor</Btn>}
            {canEdit && <Btn type={viewing.status === 'active' ? 'danger' : 'success'} onClick={() => { toggleStatus(viewing); setViewing(null); }}>{viewing.status === 'active' ? 'Deactivate' : 'Activate'}</Btn>}
            <Btn type="outline" onClick={() => setViewing(null)}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
