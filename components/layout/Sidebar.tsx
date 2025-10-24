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
                <path d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16A16 16 0 010 16C0 7.938 5.965 1.267 13.723.16 13.723.16 13.73.001 14.28.001h3.444c.55 0 .556.159.556.159z" fill="url(#logo-a)"></path>
                <path d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16A16 16 0 010 16C0 7.938 5.965 1.267 13.723.16 13.723.16 13.73.001 14.28.001h3.444c.55 0 .556.159.556.159z" fill="url(#logo-b)" transform="rotate(180 16 16)"></path>
            </svg>
            <span className="text-2xl font-bold text-white lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">ClubPro</span>
          </a>
        </div>
        
        {/* Links */}
        <div className="space-y-2 flex-grow">
          {navLinks.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setPage(id);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-150 flex items-center ${
                activePage === id ? 'bg-cricket-green-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Icon className="w-6 h-6 shrink-0" />
              <span className="ml-4 font-medium text-sm lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">{label}</span>
            </button>
          ))}
        </div>
        
        {/* Bottom actions */}
        <div className="pt-3 mt-3 border-t border-slate-700">
             <button
              onClick={() => {
                setPage('settings');
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-150 flex items-center mb-2 ${
                activePage === 'settings' ? 'bg-cricket-green-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <SettingsIcon className="w-6 h-6 shrink-0" />
              <span className="ml-4 font-medium text-sm lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">Settings</span>
            </button>
            <button
              onClick={onLogout}
              className="w-full text-left px-3 py-2 rounded-lg transition-colors duration-150 flex items-center text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
                <LogoutIcon className="w-6 h-6 shrink-0"/>
                <span className="ml-4 font-medium text-sm lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">Logout</span>
            </button>
        </div>
      </div>
    </div>
  );
};