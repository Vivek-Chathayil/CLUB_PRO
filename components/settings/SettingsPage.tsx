import React, { useState } from 'react';
import { User } from '../../types';
import ProfileSettings from './ProfileSettings';
import NotificationSettings from './NotificationSettings';
import SecuritySettings from './SecuritySettings';

interface SettingsPageProps {
  user: User;
  onProfileUpdated: (user: User) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, onProfileUpdated }) => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Password & Security' },
  ];
  
  const renderContent = () => {
      switch (activeTab) {
          case 'profile':
              return <ProfileSettings user={user} onProfileUpdated={onProfileUpdated} />;
          case 'notifications':
              return <NotificationSettings />;
          case 'security':
              return <SecuritySettings />;
          default:
              return null;
      }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="flex border-b border-slate-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-cricket-green-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="pt-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default SettingsPage;
