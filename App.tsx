import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Layout } from './components/layout/Layout';
import { Spinner } from './components/ui/Spinner';
import { Dashboard } from './components/dashboard/Dashboard';
import { MembersList } from './components/admin/MembersList';
import { UserRole } from './types';
import AdminFinancePage from './components/admin/AdminFinancePage';
import { PaymentHistory } from './components/finance/PaymentHistory';
import { EventsPage } from './components/events/EventsPage';
import SettingsPage from './components/settings/SettingsPage';

function App() {
  const { user, loading, logout, onProfileUpdated } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  
  const renderPage = () => {
    if (!user) return null;
    switch(activePage) {
      case 'dashboard':
        return <Dashboard user={user} setPage={setActivePage} />;
      case 'members':
        return user.role === UserRole.ADMIN ? <MembersList /> : null;
      case 'finance':
        return user.role === UserRole.ADMIN ? <AdminFinancePage user={user} /> : <PaymentHistory user={user} />;
      case 'events':
        return <EventsPage user={user} />;
      case 'settings':
        return <SettingsPage user={user} onProfileUpdated={onProfileUpdated} />;
      default:
        return <Dashboard user={user} setPage={setActivePage} />;
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-900">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-slate-200">
      {user ? (
        <Layout user={user} onLogout={logout} activePage={activePage} setPage={setActivePage}>
          {renderPage()}
        </Layout>
      ) : (
        authView === 'login' 
          ? <Login onSwitchToRegister={() => setAuthView('register')} /> 
          : <Register onSwitchToLogin={() => setAuthView('login')} />
      )}
    </div>
  );
}

export default App;