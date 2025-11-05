import React, { useEffect, useRef } from 'react';
import { User, UserRole } from '../../types';
import {
  DashboardIcon,
  MembersIcon,
  FinanceIcon,
  EventsIcon,
  ReportsIcon,
  SettingsIcon,
  LogoutIcon,
} from '../ui/Icons';

interface SidebarProps {
  user: User;
  activePage: string;
  setPage: (page: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}

const adminNavLinks = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'members', label: 'Members', icon: MembersIcon },
  { id: 'finance', label: 'Finance', icon: FinanceIcon },
  { id: 'events', label: 'Events', icon: EventsIcon },
];

const memberNavLinks = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'finance', label: 'My Finance', icon: FinanceIcon },
  { id: 'events', label: 'Events', icon: EventsIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ user, activePage, setPage, sidebarOpen, setSidebarOpen, onLogout }) => {
  const sidebar = useRef<HTMLDivElement>(null);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen, setSidebarOpen]);
  
  const navLinks = user.role === UserRole.ADMIN ? adminNavLinks : memberNavLinks;

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-auto w-64 lg:w-20 lg:hover:w-64 shrink-0 bg-slate-900 p-4 transition-all duration-300 ease-in-out group ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Logo */}
          <a href="#0" className="flex items-center space-x-2">
            <svg width="32" height="32" viewBox="0 0 32 32">
                <defs>
                    <linearGradient x1="28.538%" y1="20.229%" x2="100%" y2="108.156%" id="logo-a">
                        <stop stopColor="#34D399" stopOpacity="0" offset="0%"></stop>
                        <stop stopColor="#34D399" offset="100%"></stop>
                    </linearGradient>
                    <linearGradient x1="88.638%" y1="29.267%" x2="22.42%" y2="100%" id="logo-b">
                        <stop stopColor="#10B981" stopOpacity="0" offset="0%"></stop>
                        <stop stopColor="#10B981" offset="100%"></stop>
                    </linearGradient>
                </defs>
                <rect fill="#10B981" width="32" height="32" rx="16"></rect>
                <path d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16S0 24.837 0 16c0-7.245 4.814-13.448 11.523-15.402l-1.35-2.295C4.245.962 0 7.85 0 16c0 9.925 8.075 18 18 18s18-8.075 18-18c0-8.73-6.24-16.113-14.534-17.653l-1.189 2.813z" fill="url(#logo-a)"></path>
                <path d="M14.03-2.223C5.23-.236 0 7.065 0 16c0 8.837 7.163 16 16 16s16-7.163 16-16c0-7.94-5.738-14.593-13.35-16.03l-1.62 2.65C23.23 4.14 28 9.53 28 16c0 7.73-6.27 14-14 14S4 23.73 4 16c0-6.17 3.947-11.443 9.48-13.344l-1.45-2.879z" fill="url(#logo-b)"></path>
            </svg>
            <div className="text-white font-bold text-xl opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">ClubPro</div>
          </a>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">Menu</h3>
          <ul className="space-y-2">
            {navLinks.map(link => (
              <li key={link.id}>
                <button
                  onClick={() => setPage(link.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-150 ${
                    activePage === link.id ? 'bg-cricket-green-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <link.icon className="w-6 h-6 shrink-0" />
                    <span className="ml-3 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">{link.label}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Sidebar Footer */}
        <div className="mt-auto">
            <ul className="space-y-2">
                <li>
                    <button onClick={() => setPage('settings')} className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-150 ${activePage === 'settings' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <div className="flex items-center">
                            <SettingsIcon className="w-6 h-6 shrink-0" />
                            <span className="ml-3 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">Settings</span>
                        </div>
                    </button>
                </li>
                 <li>
                    <button onClick={onLogout} className="w-full text-left px-3 py-2 rounded-lg transition-colors duration-150 text-slate-400 hover:bg-slate-800 hover:text-white">
                        <div className="flex items-center">
                            <LogoutIcon className="w-6 h-6 shrink-0" />
                            <span className="ml-3 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">Logout</span>
                        </div>
                    </button>
                </li>
            </ul>
        </div>
      </div>
    </div>
  );
};