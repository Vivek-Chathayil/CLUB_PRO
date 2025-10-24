
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { User } from '../../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  activePage: string;
  setPage: (page: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ user, onLogout, activePage, setPage, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={user} activePage={activePage} setPage={setPage} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={onLogout}/>

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header user={user} onLogout={onLogout} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
};
