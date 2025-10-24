
import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './components/auth/Login';
import { Layout } from './components/layout/Layout';
import { Spinner } from './components/ui/Spinner';
import { Dashboard } from './components/dashboard/Dashboard';
import { MembersList } from './components/admin/MembersList';
import { EventsPage } from './components/events/EventsPage';
import { PaymentHistory } from './components/finance/PaymentHistory';
import SettingsPage from './components/settings/SettingsPage';
import { UserRole } from './types';
import AdminFinancePage from './components/admin/AdminFinancePage';

function App() {
  const { user, loading, logout, onProfileUpdated } = useAuth();
  const [page, setPage] = useState('dashboard');
  
  if (loading) {
    return (
      <div className="bg-slate-900 h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }
  
  const renderContent = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard user={user} setPage={setPage} />;
      case 'members':
        return user.role === UserRole.ADMIN ? <MembersList /> : null;
      case 'finance':
        return user.role === UserRole.ADMIN ? <AdminFinancePage user={user} /> : <PaymentHistory user={user}/>;
      case 'events':
        return <EventsPage user={user} />;
      case 'settings':
          return <SettingsPage user={user} onProfileUpdated={onProfileUpdated}/>;
      default:
        return <Dashboard user={user} setPage={setPage} />;
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200">
      <Layout user={user} onLogout={logout} activePage={page} setPage={setPage}>
        {renderContent()}
      </Layout>
    </div>
  );
}

export default App;
