// User Management — Admin only: CRUD users + role management
import { useState } from 'react';
import S from '../styles/theme';
import { Badge, Btn, Modal, Alert, Field, Input, Select, Table, SectionHeader, EmptyState, SearchInput } from '../components/shared';
import { genId, today, ROLE_LABELS, ROLE_COLORS, ROLE_ICONS } from '../utils/helpers';

export default function UserMgmt({ db, setDb, user: currentUser }) {
  const [showAdd,  setShowAdd]  = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [viewing,  setViewing]  = useState(null);
  const [search,   setSearch]   = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [msg,      setMsg]      = useState('');
  const [msgType,  setMsgType]  = useState('success');
  const [showPwdFor, setShowPwdFor] = useState('');

  const blank = { name: '', email: '', password: '', role: 'officer', vendorId: '' };
  const [form, setForm] = useState(blank);

  const filtered = db.users.filter(u =>
    (filterRole === 'all' || u.role === filterRole) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const showMsg = (m, t = 'success') => { setMsg(m); setMsgType(t); setTimeout(() => setMsg(''), 3500); };

  const save = () => {
    if (!form.name.trim() || !form.email.trim()) { showMsg('Name and email are required.', 'danger'); return; }
    if (!editing && !form.password) { showMsg('Password is required for new users.', 'danger'); return; }
    if (!editing && db.users.find(u => u.email === form.email)) { showMsg('Email already registered.', 'danger'); return; }

    if (editing) {
      setDb(d => ({
        ...d,
        users: d.users.map(u => u.id === editing.id ? { ...u, name: form.name, email: form.email, role: form.role, vendorId: form.vendorId, ...(form.password ? { password: form.password } : {}) } : u),
        logs: [...d.logs, { id: genId('log'), action: 'User Updated', detail: `${form.name} account updated by Admin`, timestamp: new Date().toISOString(), userId: currentUser.id, type: 'user' }],
      }));
      showMsg('User updated successfully!');
    } else {
      const nu = { id: genId('u'), name: form.name, email: form.email, password: form.password, role: form.role, ...(form.role === 'vendor' && form.vendorId ? { vendorId: form.vendorId } : {}) };
      setDb(d => ({
        ...d,
        users: [...d.users, nu],
        logs: [...d.logs, { id: genId('log'), action: 'User Created', detail: `${form.name} added as ${ROLE_LABELS[form.role]}`, timestamp: new Date().toISOString(), userId: currentUser.id, type: 'user' }],
      }));
      showMsg('User created successfully!');
    }
    setShowAdd(false); setEditing(null);
  };

  const deleteUser = (u) => {
    if (u.id === currentUser.id) { showMsg("You can't delete your own account.", 'danger'); return; }
    if (!window.confirm(`Are you sure you want to delete ${u.name}?`)) return;
    setDb(d => ({
      ...d,
      users: d.users.filter(x => x.id !== u.id),
      logs: [...d.logs, { id: genId('log'), action: 'User Deleted', detail: `${u.name} removed by Admin`, timestamp: new Date().toISOString(), userId: currentUser.id, type: 'user' }],
    }));
    showMsg(`${u.name} has been removed.`, 'danger');
  };

  const openEdit = (u) => { setEditing(u); setForm({ name: u.name, email: u.email, password: '', role: u.role, vendorId: u.vendorId || '' }); setShowAdd(true); };
  const openAdd  = () => { setEditing(null); setForm(blank); setShowAdd(true); };

  const ROLE_OPTS = ['admin', 'officer', 'manager', 'vendor'];
  const ROW_COUNTS = { admin: db.users.filter(u => u.role === 'admin').length, officer: db.users.filter(u => u.role === 'officer').length, manager: db.users.filter(u => u.role === 'manager').length, vendor: db.users.filter(u => u.role === 'vendor').length };

  return (
    <div className="animate-fade">
      <SectionHeader
        title="User Management"
        subtitle={`${db.users.length} users across all roles`}
        action={<Btn onClick={openAdd}>＋ Add User</Btn>}
      />
      <Alert msg={msg} type={msgType} />

      {/* Role Stats */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {ROLE_OPTS.map(r => (
          <div key={r} onClick={() => setFilterRole(r === filterRole ? 'all' : r)}
            style={{ ...S.cardSm, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.15s', border: `1px solid ${filterRole === r ? `var(--accent-${ROLE_COLORS[r]}, #3b82f6)` : 'rgba(255,255,255,0.06)'}` }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            <div style={{ fontSize: 24 }}>{ROLE_ICONS[r]}</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>{ROW_COUNTS[r]}</div>
              <div style={{ fontSize: 11, color: '#475569' }}>{ROLE_LABELS[r]}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ ...S.card, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <SearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." />
        </div>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} style={{ ...S.select, width: 160 }}>
          <option value="all">All Roles</option>
          {ROLE_OPTS.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={S.card}>
        {filtered.length === 0
          ? <EmptyState icon="👥" title="No users found" />
          : (
            <Table
              heads={['User', 'Role', 'Email', 'Vendor Link', 'Actions']}
              rows={filtered.map(u => {
                const linkedVendor = u.vendorId ? db.vendors.find(v => v.id === u.vendorId) : null;
                const isSelf = u.id === currentUser.id;
                return (
                  <tr key={u.id} className="table-row-hover" onClick={() => setViewing(u)}>
                    <td style={S.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg,#1e40af,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                          {u.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{u.name} {isSelf && <span style={{ fontSize: 10, color: '#3b82f6', fontWeight: 700 }}>(You)</span>}</div>
                        </div>
                      </div>
                    </td>
                    <td style={S.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{ROLE_ICONS[u.role]}</span>
                        <Badge type={ROLE_COLORS[u.role]}>{ROLE_LABELS[u.role]}</Badge>
                      </div>
                    </td>
                    <td style={{ ...S.td, color: '#64748b', fontSize: 12.5 }}>{u.email}</td>
                    <td style={S.td}>{linkedVendor ? <Badge type="green">{linkedVendor.name}</Badge> : <span style={{ color: '#334155', fontSize: 12 }}>—</span>}</td>
                    <td style={S.td} onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Btn type="ghost" sm onClick={() => openEdit(u)}>✏ Edit</Btn>
                        {!isSelf && <Btn type="danger" sm onClick={() => deleteUser(u)}>Remove</Btn>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            />
          )}
      </div>

      {/* ── Add/Edit Modal */}
      {showAdd && (
        <Modal title={editing ? '✏ Edit User' : '＋ Add New User'} onClose={() => { setShowAdd(false); setEditing(null); }}>
          <Field label="Full Name *">
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
          </Field>
          <Field label="Email Address *">
            <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="user@company.com" />
          </Field>
          <Field label={editing ? 'New Password (leave blank to keep)' : 'Password *'}>
            <div style={{ position: 'relative' }}>
              <Input type={showPwdFor === 'form' ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder={editing ? '•••••• (optional)' : 'Min 6 chars'} style={{ paddingRight: 40 }} />
              <button type="button" onClick={() => setShowPwdFor(p => p === 'form' ? '' : 'form')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: 15 }}>
                {showPwdFor === 'form' ? '🙈' : '👁'}
              </button>
            </div>
          </Field>
          <Field label="Role *">
            <Select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              {ROLE_OPTS.map(r => <option key={r} value={r}>{ROLE_ICONS[r]} {ROLE_LABELS[r]}</option>)}
            </Select>
          </Field>
          {form.role === 'vendor' && (
            <Field label="Link to Vendor" hint="Select the vendor company this user represents">
              <Select value={form.vendorId} onChange={e => setForm({ ...form, vendorId: e.target.value })}>
                <option value="">-- Not linked --</option>
                {db.vendors.filter(v => v.status === 'active').map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </Select>
            </Field>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <Btn onClick={save}>💾 {editing ? 'Update User' : 'Create User'}</Btn>
            <Btn type="outline" onClick={() => { setShowAdd(false); setEditing(null); }}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* ── View User Modal */}
      {viewing && (
        <Modal title={viewing.name} subtitle={`${ROLE_ICONS[viewing.role]} ${ROLE_LABELS[viewing.role]}`} onClose={() => setViewing(null)}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{ width: 72, height: 72, borderRadius: 16, background: 'linear-gradient(135deg,#1e40af,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#fff', boxShadow: '0 0 20px rgba(59,130,246,0.4)' }}>
              {viewing.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
          </div>
          {[
            ['Name', viewing.name],
            ['Email', viewing.email],
            ['Role', ROLE_LABELS[viewing.role]],
            ['Linked Vendor', viewing.vendorId ? db.vendors.find(v => v.id === viewing.vendorId)?.name || '—' : '—'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13.5 }}>
              <span style={{ color: '#64748b', fontWeight: 500 }}>{k}</span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <Btn onClick={() => { setViewing(null); openEdit(viewing); }}>✏ Edit</Btn>
            {viewing.id !== currentUser.id && <Btn type="danger" onClick={() => { deleteUser(viewing); setViewing(null); }}>Remove</Btn>}
            <Btn type="outline" onClick={() => setViewing(null)}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
