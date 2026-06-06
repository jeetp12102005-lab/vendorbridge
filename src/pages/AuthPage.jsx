// Auth Page — Login / Signup / Forgot Password
import { useState } from 'react';
import S from '../styles/theme';
import { Alert, Btn, Field, Input, Select } from '../components/shared';
import { useTheme } from '../context/ThemeContext';
import { VENDOR_CATEGORIES, genId, today, ROLE_LABELS } from '../utils/helpers';

const DEMO_ACCOUNTS = [
  { label: 'Admin',   email: 'admin@vb.com',    pass: 'admin123',   role: 'admin' },
  { label: 'Officer', email: 'officer@vb.com',  pass: 'officer123', role: 'officer' },
  { label: 'Manager', email: 'manager@vb.com',  pass: 'manager123', role: 'manager' },
  { label: 'Vendor',  email: 'vendor@vb.com',   pass: 'vendor123',  role: 'vendor' },
];

const ROLE_COLORS_DEMO = { admin: '#dc2626', officer: '#2563eb', manager: '#ca8a04', vendor: '#16a34a' };

export default function AuthPage({ db, setDb, onLogin }) {
  const { theme, toggleTheme } = useTheme();
  const [tab, setTab]           = useState('login');
  const [email, setEmail]       = useState('');
  const [pass, setPass]         = useState('');
  const [showPass, setShowPass] = useState(false);
  const [err, setErr]           = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Sign up form
  const [su, setSu] = useState({ name: '', email: '', password: '', confirm: '', role: 'officer', vendorName: '' });
  const [suErr, setSuErr] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setErr('');
    const u = db.users.find(u => u.email === email && u.password === pass);
    if (!u) { setErr('Invalid email or password. Please try again.'); return; }
    onLogin(u);
  };

  const quickLogin = (e, p) => { setEmail(e); setPass(p); };

  const handleSignup = (e) => {
    e.preventDefault();
    setSuErr('');
    if (!su.name.trim() || !su.email.trim() || !su.password) { setSuErr('All fields are required.'); return; }
    if (su.password !== su.confirm) { setSuErr('Passwords do not match.'); return; }
    if (su.password.length < 6) { setSuErr('Password must be at least 6 characters.'); return; }
    if (db.users.find(u => u.email === su.email)) { setSuErr('Email already registered.'); return; }
    if (su.role === 'vendor' && !su.vendorName.trim()) { setSuErr('Please enter your company name.'); return; }

    const newUser = { id: genId('u'), name: su.name, email: su.email, password: su.password, role: su.role };
    let newVendor = null;
    if (su.role === 'vendor') {
      newVendor = { id: genId('v'), name: su.vendorName, category: 'Other', gst: '', email: su.email, phone: '', address: '', status: 'active', rating: 4.0, createdAt: today(), website: '', contactPerson: su.name };
      newUser.vendorId = newVendor.id;
    }

    setDb(d => ({
      ...d,
      users: [...d.users, newUser],
      vendors: newVendor ? [...d.vendors, newVendor] : d.vendors,
      logs: [...d.logs, { id: genId('log'), action: 'User Registered', detail: `${su.name} signed up as ${ROLE_LABELS[su.role]}`, timestamp: new Date().toISOString(), userId: newUser.id, type: 'user' }],
    }));
    setSuccessMsg('Account created! You can now log in.');
    setTab('login');
    setEmail(su.email);
    setPass(su.password);
  };

  const handleForgot = (e) => {
    e.preventDefault();
    const found = db.users.find(u => u.email === forgotEmail);
    setForgotSent(true);
    // In real app: send email. Here just show success.
  };

  return (
    <div style={S.authPage}>
      {/* Subtle geometric decorations */}
      <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: 300, height: 300, borderRadius: '50%', background: 'var(--accent-dim)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: 350, height: 350, borderRadius: '50%', background: 'var(--accent-dim)', pointerEvents: 'none', opacity: 0.5 }} />

      {/* Theme toggle — top right */}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        style={{ position: 'absolute', top: '20px', right: '20px' }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div style={S.authCard}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ ...S.logoMark, width: 36, height: 36, fontSize: 15, borderRadius: 9 }}>VB</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>VendorBridge</div>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.3px' }}>Enterprise Procurement Platform</div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: '8px', padding: '3px', marginBottom: '22px', border: '1px solid var(--border)' }}>
          {['login', 'signup'].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setErr(''); setSuErr(''); setSuccessMsg(''); }}
              style={{
                flex: 1, padding: '7px 0',
                borderRadius: '6px', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: 600, fontFamily: 'inherit',
                transition: 'all 0.15s',
                background: tab === t ? 'var(--bg-card)' : 'transparent',
                color: tab === t ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {t === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {successMsg && <Alert type="success" msg={successMsg} />}

        {/* ── LOGIN */}
        {tab === 'login' && (
          <form onSubmit={handleLogin}>
            <Alert type="danger" msg={err} />
            <Field label="Email Address">
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required autoComplete="email" />
            </Field>
            <Field label="Password">
              <div style={{ position: 'relative' }}>
                <Input type={showPass ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)} placeholder="Enter your password" required autoComplete="current-password" style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: 16 }}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </Field>
            <div style={{ textAlign: 'right', marginBottom: '14px' }}>
              <button type="button" onClick={() => setShowForgot(true)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit', fontWeight: 500 }}>
                Forgot password?
              </button>
            </div>
            <button type="submit" style={{ ...S.btn('primary'), width: '100%', justifyContent: 'center', padding: '10px', fontSize: '13px', fontWeight: 700 }}>
              Sign In →
            </button>
          </form>
        )}

        {/* ── SIGNUP */}
        {tab === 'signup' && (
          <form onSubmit={handleSignup}>
            <Alert type="danger" msg={suErr} />
            <Field label="Full Name">
              <Input value={su.name} onChange={e => setSu({ ...su, name: e.target.value })} placeholder="Your full name" required />
            </Field>
            <Field label="Email Address">
              <Input type="email" value={su.email} onChange={e => setSu({ ...su, email: e.target.value })} placeholder="your@email.com" required />
            </Field>
            <Field label="Role">
              <Select value={su.role} onChange={e => setSu({ ...su, role: e.target.value })}>
                <option value="officer">Procurement Officer</option>
                <option value="manager">Manager / Approver</option>
                <option value="vendor">Vendor</option>
              </Select>
            </Field>
            {su.role === 'vendor' && (
              <Field label="Company Name">
                <Input value={su.vendorName} onChange={e => setSu({ ...su, vendorName: e.target.value })} placeholder="Your company name" required />
              </Field>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Password">
                <Input type="password" value={su.password} onChange={e => setSu({ ...su, password: e.target.value })} placeholder="Min 6 chars" required />
              </Field>
              <Field label="Confirm Password">
                <Input type="password" value={su.confirm} onChange={e => setSu({ ...su, confirm: e.target.value })} placeholder="Repeat password" required />
              </Field>
            </div>
            <button type="submit" style={{ ...S.btn('primary'), width: '100%', justifyContent: 'center', padding: '10px', fontSize: '13px', fontWeight: 700, marginTop: '4px' }}>
              Create Account →
            </button>
          </form>
        )}

        {/* ── Quick demo logins */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0 14px' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Quick Demo</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {DEMO_ACCOUNTS.map(d => (
            <button
              key={d.label}
              onClick={() => { setTab('login'); quickLogin(d.email, d.pass); }}
              style={{
                background: `${ROLE_COLORS_DEMO[d.role]}10`,
                border: `1px solid ${ROLE_COLORS_DEMO[d.role]}28`,
                color: ROLE_COLORS_DEMO[d.role],
                borderRadius: '6px', padding: '5px 13px',
                fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${ROLE_COLORS_DEMO[d.role]}20`; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${ROLE_COLORS_DEMO[d.role]}10`; }}
            >
              {d.label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '10px' }}>
          Click a role above to auto-fill credentials, then Sign In
        </div>
      </div>

      {/* ── Forgot Password Modal */}
      {showForgot && (
        <div style={S.overlay} onClick={e => e.target === e.currentTarget && setShowForgot(false)}>
          <div style={{ ...S.modal, maxWidth: 400 }}>
            <div style={S.modalHeader}>
              <div style={S.modalTitle}>Reset Password</div>
              <button onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(''); }} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', color: 'var(--text-muted)', padding: '3px 9px' }}>×</button>
            </div>
            {forgotSent ? (
              <div>
                <Alert type="success" msg={`Password reset instructions sent to ${forgotEmail}`} />
                <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>
                  Please check your email inbox. If registered, you'll receive a password reset link within a few minutes.
                </p>
                <Btn onClick={() => { setShowForgot(false); setForgotSent(false); }} style={{ marginTop: 16 }}>Back to Login</Btn>
              </div>
            ) : (
              <form onSubmit={handleForgot}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px', lineHeight: 1.6 }}>
                  Enter your registered email address and we'll send password reset instructions.
                </p>
                <Field label="Email Address">
                  <Input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="your@email.com" required />
                </Field>
                <Btn style={{ width: '100%', justifyContent: 'center' }}>Send Reset Link</Btn>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
