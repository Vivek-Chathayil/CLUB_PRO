import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { api } from '../../services/api';

interface NotifyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: User | null;
  onNotificationSent: () => void;
}

export const NotifyMemberModal: React.FC<NotifyMemberModalProps> = ({ isOpen, onClose, member, onNotificationSent }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (member) {
      // Pre-fill with a template
      setSubject('Regarding Your Account');
      setMessage(`Dear ${member.name},\n\nWe are writing to you regarding your account at ClubPro.\n\nBest Regards,\nClubPro Administration`);
    }
  }, [member]);
  
  if (!member) return null;

  const handleSubmit = async () => {
    if (!subject || !message) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.sendEmailNotification({
        userId: member._id,
        subject,
        message,
      });
      onNotificationSent();
      onClose();
    } catch (err) {
      setError('Failed to send notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Notify ${member.name}`}>
      <div className="space-y-4">
        <Input
          id="subject"
          label="Subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">Message</label>
            <textarea
                id="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500"
                required
            />
        </div>
        
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} isLoading={loading}>Send Notification</Button>
        </div>
      </div>
    </Modal>
  );
};