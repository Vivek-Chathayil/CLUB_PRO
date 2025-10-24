import React from 'react';
import { User } from '../../types';
import { LogoutIcon } from '../ui/Icons';
import { NotificationDropdown } from './NotificationDropdown';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, toggleSidebar }) => {
  return (
    <header className="sticky top-0 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">

          {/* Hamburger button for mobile */}
          <div className="lg:hidden">
            <button className="text-slate-400 hover:text-slate-200" onClick={toggleSidebar}>
              <span className="sr-only">Open sidebar</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Spacer to push content to the right */}
          <div className="flex-grow"></div>

          <div className="flex items-center space-x-4">
            <NotificationDropdown />

            <div className="h-8 w-px bg-slate-700 hidden sm:block"></div>

            {/* User menu */}
            <div className="flex items-center">
                <div className="text-right mr-3 hidden sm:block">
                    <span className="font-semibold text-slate-200 text-sm">{user.name}</span>
                    <span className="block text-xs text-slate-400 capitalize">{user.role}</span>
                </div>
                <img className="w-10 h-10 rounded-full" src={user.avatar} alt={user.name} />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
