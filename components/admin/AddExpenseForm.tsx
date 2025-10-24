
import React, { useState } from 'react';
import { User } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { api } from '../../services/api';

interface AddExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onExpenseAdded: () => void;
  adminUser: User;
}

export const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ isOpen, onClose, onExpenseAdded, adminUser }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'equipment' | 'maintenance' | 'event' | 'other'>('equipment');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!description || !amount || !category || !date) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.addExpense({
        description,
        amount: parseFloat(amount),
        category,
        date,
        addedBy: adminUser._id,
      });
      onExpenseAdded();
      // Reset form
      setDescription('');
      setAmount('');
      setCategory('equipment');
      setDate(new Date().toISOString().split('T')[0]);
    } catch (err) {
      setError('Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Expense">
      <div className="space-y-4">
        <Input id="description" label="Description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <div className="grid grid-cols-2 gap-4">
            <Input id="amount" label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <Input id="date" label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
            <label htmlFor="category-select" className="block text-sm font-medium text-slate-300 mb-1">Category</label>
            <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as 'equipment' | 'maintenance' | 'event' | 'other')}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500"
            >
                <option value="equipment">Equipment</option>
                <option value="maintenance">Maintenance</option>
                <option value="event">Event</option>
                <option value="other">Other</option>
            </select>
        </div>
        
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} isLoading={loading}>Add Expense</Button>
        </div>
      </div>
    </Modal>
  );
};
