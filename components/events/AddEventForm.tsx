
import React, { useState } from 'react';
import { Event } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { api } from '../../services/api';

interface AddEventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onEventAdded: (newEvent: Event) => void;
}

export const AddEventForm: React.FC<AddEventFormProps> = ({ isOpen, onClose, onEventAdded }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'tournament' | 'training' | 'social'>('training');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title || !date || !time || !venue || !description) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const newEvent = await api.addEvent({
        title,
        date,
        time,
        venue,
        description,
        type,
      });
      onEventAdded(newEvent);
      onClose(); // Close modal on success
    } catch (err) {
      setError('Failed to add event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Event">
      <div className="space-y-4">
        <Input id="title" label="Event Title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <div className="grid grid-cols-2 gap-4">
            <Input id="date" label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <Input id="time" label="Time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>
        <Input id="venue" label="Venue" type="text" value={venue} onChange={(e) => setVenue(e.target.value)} required />
        <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500"
            />
        </div>
        <div>
            <label htmlFor="type-select" className="block text-sm font-medium text-slate-300 mb-1">Event Type</label>
            <select
                id="type-select"
                value={type}
                onChange={(e) => setType(e.target.value as 'tournament' | 'training' | 'social')}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500"
            >
                <option value="training">Training</option>
                <option value="tournament">Tournament</option>
                <option value="social">Social</option>
            </select>
        </div>
        
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} isLoading={loading}>Add Event</Button>
        </div>
      </div>
    </Modal>
  );
};
