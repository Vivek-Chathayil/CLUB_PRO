
import React, { useState, useEffect } from 'react';
import { User, UserStatus } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { api } from '../../services/api';

interface EditMemberFormProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberUpdated: (updatedUser: User) => void;
  member: User | null;
}

export const EditMemberForm: React.FC<EditMemberFormProps> = ({ isOpen, onClose, onMemberUpdated, member }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<UserStatus>(UserStatus.ACTIVE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (member) {
      setName(member.name);
      setEmail(member.email);
      setPhone(member.phone);
      setStatus(member.status);
    }
  }, [member]);

  const handleSubmit = async () => {
    if (!member) return;
    if (!name || !email) {
      setError('Name and email are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const updatedUser = await api.updateUser(member._id, { name, email, phone, status });
      onMemberUpdated(updatedUser);
      onClose();
    } catch (err) {
      setError('Failed to update member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Member">
      <div className="space-y-4">
        <Input
          id="name"
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          id="email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="phone"
          label="Phone Number"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div>
          <label htmlFor="status-select" className="block text-sm font-medium text-slate-300 mb-1">Status</label>
          <select
            id="status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value as UserStatus)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500"
          >
            <option value={UserStatus.ACTIVE}>Active</option>
            <option value={UserStatus.INACTIVE}>Inactive</option>
          </select>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} isLoading={loading}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
};
