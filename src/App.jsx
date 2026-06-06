// VendorBridge ERP — Root Application
import { useState, useEffect } from 'react';
import { SEED } from './data/seed';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import RFQMgmt from './pages/RFQMgmt';
import Quotations from './pages/Quotations';
import Compare from './pages/Compare';
import Approvals from './pages/Approvals';
import PurchaseOrders from './pages/PurchaseOrders';
import Invoices from './pages/Invoices';
import ActivityLogs from './pages/ActivityLogs';
import Reports from './pages/Reports';
import UserMgmt from './pages/UserMgmt';
import { ROLE_NAV } from './utils/helpers';

// ── LocalStorage helpers
const STORAGE_KEY_DB   = 'vb_db_v2';
const STORAGE_KEY_USER = 'vb_user_v2';

function loadDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DB);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with seed to add any new seed fields
      return {
        ...SEED,
        ...parsed,
        monthlySpend:  SEED.monthlySpend,   // always use fresh spend data
        categorySpend: SEED.categorySpend,  // always use fresh category data
        topVendors:    SEED.topVendors,     // always use fresh top vendors
      };
    }
  } catch {}
  return { ...SEED };
}

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export default function App() {
  const [db,   setDbState] = useState(() => loadDB());
  const [user, setUser]    = useState(() => loadUser());
  const [page, setPageRaw] = useState('dashboard');

  // Persist DB on every change
  const setDb = (updater) => {
    setDbState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { localStorage.setItem(STORAGE_KEY_DB, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // Gated page setter — enforces role access
  const setPage = (p) => {
    const allowed = user ? (ROLE_NAV[user.role] || []) : [];
    if (!allowed.includes(p)) { setPageRaw('dashboard'); return; }
    setPageRaw(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // On login
  const handleLogin = (u) => {
    setUser(u);
    try { localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(u)); } catch {}
    // Always revert to dashboard on login
    setPageRaw('dashboard');
  };

  // On logout
  const handleLogout = () => {
    setUser(null);
    setPageRaw('dashboard');
    try { localStorage.removeItem(STORAGE_KEY_USER); } catch {}
  };

  // ── Auth gate
  if (!user) {
    return <AuthPage db={db} setDb={setDb} onLogin={handleLogin} />;
  }

  // ── Route to page
  const pageProps = { db, setDb, user, setPage };

  const PAGES = {
    dashboard:  <Dashboard    {...pageProps} />,
    vendors:    <Vendors      {...pageProps} />,
    rfq:        <RFQMgmt      {...pageProps} />,
    quotations: <Quotations   {...pageProps} />,
    compare:    <Compare      {...pageProps} />,
    approvals:  <Approvals    {...pageProps} />,
    po:         <PurchaseOrders {...pageProps} />,
    invoices:   <Invoices     {...pageProps} />,
    reports:    <Reports      {...pageProps} />,
    logs:       <ActivityLogs {...pageProps} />,
    users:      <UserMgmt     {...pageProps} />,
  };

  const allowed = ROLE_NAV[user.role] || [];
  const safePage = allowed.includes(page) ? page : 'dashboard';

  return (
    <Layout user={user} page={safePage} setPage={setPage} onLogout={handleLogout} db={db}>
      {PAGES[safePage] || PAGES['dashboard']}
    </Layout>
  );
}
