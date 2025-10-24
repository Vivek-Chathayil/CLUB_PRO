

import React, { useState, useEffect } from 'react';
import { Event, User, UserRole } from '../../types';
import { api } from '../../services/api';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/helpers';
import { AddEventForm } from './AddEventForm';
import { EventDetailsModal } from './EventDetailsModal';
import { Notification } from '../ui/Notification';

interface EventsPageProps {
  user: User;
}

const eventTypeStyles = {
    tournament: 'bg-red-500/20 text-red-400 border-red-500/30',
    training: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    social: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
};

export const EventsPage: React.FC<EventsPageProps> = ({ user }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await api.getUpcomingEvents();
            setEvents(data);
        } catch (error) {
            console.error("Failed to fetch events", error);
            setNotification({ message: 'Failed to load events.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleEventAdded = (newEvent: Event) => {
        setEvents([newEvent, ...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        setNotification({ message: 'Event added successfully!', type: 'success' });
    };

    if (loading) return <Spinner />;

    return (
        <>
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Club Events</h1>
                    {user.role === UserRole.ADMIN && (
                        <Button onClick={() => setAddModalOpen(true)}>Add New Event</Button>
                    )}
                </div>
                {events.length === 0 ? (
                    <Card><p className="text-center text-slate-400 py-8">No upcoming events.</p></Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <Card key={event._id} className="flex flex-col">
                                <div className="p-5 flex-grow">
                                    <div className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 border ${eventTypeStyles[event.type]}`}>
                                        {event.type}
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-100 mb-1">{event.title}</h3>
                                    <p className="text-sm text-slate-400 mb-3">{event.venue}</p>
                                    <p className="text-sm text-slate-300">{formatDate(event.date)} at {event.time}</p>
                                </div>
                                <div className="px-5 py-3 border-t border-slate-700">
                                    <Button variant="secondary" className="w-full" onClick={() => setSelectedEvent(event)}>View Details</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <AddEventForm
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                onEventAdded={handleEventAdded}
            />

            <EventDetailsModal
                isOpen={!!selectedEvent}
                onClose={() => setSelectedEvent(null)}
                event={selectedEvent}
                user={user}
                setNotification={setNotification}
            />
        </>
    );
};