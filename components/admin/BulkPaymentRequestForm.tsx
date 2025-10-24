
import React, { useState, useEffect } from 'react';
import { User, UserRole, UserStatus } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { api } from '../../services/api';
import { Spinner } from '../ui/Spinner';

interface BulkPaymentRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentsCreated: () => void;
}

export const BulkPaymentRequestForm: React.FC<BulkPaymentRequestFormProps> = ({ isOpen, onClose, onPaymentsCreated }) => {
  const [members, setMembers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [type, setType] = useState('Annual Membership Fee');
  const [amount, setAmount] = useState('5000');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.getAllUsers()
        .then(users => {
            const activeMembers = users.filter(u => u.role === UserRole.MEMBER && u.status === UserStatus.ACTIVE);
            setMembers(activeMembers);
            // Pre-select all active members
            setSelectedUserIds(activeMembers.map(m => m._id));
        })
        .catch(() => setError("Failed to load members list."))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleSelectUser = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };
  
  const handleSelectAll = () => {
      if (selectedUserIds.length === members.length) {
          setSelectedUserIds([]);
      } else {
          setSelectedUserIds(members.map(m => m._id));
      }
  }

  const handleSubmit = async () => {
    if (selectedUserIds.length === 0 || !type || !amount || !dueDate) {
      setError('Please fill in all fields and select at least one member.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.createBulkPaymentRequest({
        userIds: selectedUserIds,
        type,
        amount: parseFloat(amount),
        dueDate,
      });
      onPaymentsCreated();
    } catch (err) {
      setError('Failed to create bulk request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Bulk Payment Request">
      <div className="space-y-4">
        <Input id="type" label="Payment Type" type="text" value={type} onChange={(e) => setType(e.target.value)} required />
        <div className="grid grid-cols-2 gap-4">
            <Input id="amount" label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <Input id="dueDate" label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
        </div>

        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-300">Select Members ({selectedUserIds.length} selected)</label>
                <Button variant="secondary" className="px-2 py-1 text-xs" onClick={handleSelectAll}>
                    {selectedUserIds.length === members.length ? 'Deselect All' : 'Select All'}
                </Button>
            </div>
            {loading && !members.length ? <Spinner /> : (
                <div className="max-h-48 overflow-y-auto p-2 border border-slate-600 rounded-md bg-slate-900/50">
                    {members.map(member => (
                        <div key={member._id} className="flex items-center p-1">
                            <input
                                type="checkbox"
                                id={`member-checkbox-${member._id}`}
                                checked={selectedUserIds.includes(member._id)}
                                onChange={() => handleSelectUser(member._id)}
                                className="h-4 w-4 rounded border-gray-300 text-cricket-green-600 focus:ring-cricket-green-500"
                            />
                            <label htmlFor={`member-checkbox-${member._id}`} className="ml-3 text-sm text-slate-300">
                                {member.name}
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
        
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} isLoading={loading}>Send Requests</Button>
        </div>
      </div>
    </Modal>
  );
};
