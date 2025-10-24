import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    paymentReminders: true,
    eventUpdates: true,
    clubNews: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = () => {
      setIsSaving(true);
      setTimeout(() => {
          setIsSaving(false);
          // In a real app, you'd show a success notification here.
      }, 1000)
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-slate-200">Notification Preferences</h2>
      <p className="text-slate-400 text-sm mt-1">Manage how you receive notifications from the club.</p>
      
      <div className="mt-6 space-y-4">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <span className="text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            <button
              onClick={() => handleToggle(key as keyof typeof settings)}
              className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                value ? 'bg-cricket-green-600' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform ease-in-out duration-200 ${
                  value ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
      </div>
    </Card>
  );
};

export default NotificationSettings;
