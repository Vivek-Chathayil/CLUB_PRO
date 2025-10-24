
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { api } from '../../services/api';

interface CreatePaymentRequestProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentCreated: () => void;
}

export const CreatePaymentRequest: React.FC<CreatePaymentRequestProps> = ({ isOpen, onClose, onPaymentCreated }) => {
  const [members, setMembers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [type, setType] = useState('membership');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      api.getAllUsers()
        .then(users => setMembers(users.filter(u => u.role === UserRole.MEMBER)))
        .catch(() => setError("Failed to load members list."));
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!selectedUserId || !type || !amount || !dueDate) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.createPaymentRequest({
        userId: selectedUserId,
        type,
        amount: parseFloat(amount),
        dueDate,
      });
      onPaymentCreated();
      // Reset form
      setSelectedUserId('');
      setType('membership');
      setAmount('');
      setDueDate('');
    } catch (err) {
      setError('Failed to create payment request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Payment Request">
      <div className="space-y-4">
        <div>
          <label htmlFor="member-select" className="block text-sm font-medium text-slate-300 mb-1">Select Member</label>
          <select
            id="member-select"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500"
          >
            <option value="">-- Choose a member --</option>
            {members.map(member => (
              <option key={member._id} value={member._id}>{member.name}</option>
            ))}
          </select>
        </div>
        <Input id="type" label="Payment Type" type="text" value={type} onChange={(e) => setType(e.target.value)} required />
        <Input id="amount" label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <Input id="dueDate" label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
        
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} isLoading={loading}>Send Request</Button>
        </div>
      </div>
    </Modal>
  );
};
