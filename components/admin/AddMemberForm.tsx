
import React, { useState } from 'react';
import { User, UserRole, UserStatus } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { api } from '../../services/api';

interface AddMemberFormProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberAdded: (newUser: User) => void;
}

export const AddMemberForm: React.FC<AddMemberFormProps> = ({ isOpen, onClose, onMemberAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name || !email) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const newUser = await api.addUser({
        name,
        email,
        role: UserRole.MEMBER,
        status: UserStatus.ACTIVE,
        phone: 'N/A',
      });
      onMemberAdded(newUser);
      // Reset form on success
      setName('');
      setEmail('');
    } catch (err) {
      setError('Failed to add member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Member">
      <div className="space-y-4">
        <Input
          id="name"
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
        />
        <Input
          id="email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john.doe@example.com"
          required
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} isLoading={loading}>Add Member</Button>
        </div>
      </div>
    </Modal>
  );
};
