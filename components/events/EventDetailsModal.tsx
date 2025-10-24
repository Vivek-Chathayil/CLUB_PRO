

import React, { useState, useEffect } from 'react';
import { Event, User, UserRole, PaymentStatus } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/helpers';
import { api } from '../../services/api';
import { Spinner } from '../ui/Spinner';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  user: User;
  setNotification: (notification: { message: string, type: 'success' | 'error' } | null) => void;
}

type MemberPaymentStatus = {
    memberId: string;
    memberName: string;
    status: PaymentStatus | 'Not Paid';
};

const statusStyles: { [key: string]: string } = {
  [PaymentStatus.PAID]: 'bg-emerald-500/20 text-emerald-400',
  [PaymentStatus.PENDING]: 'bg-amber-500/20 text-amber-400',
  'Not Paid': 'bg-slate-500/20 text-slate-400',
};


export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ isOpen, onClose, event, user, setNotification }) => {
    const [paymentStatuses, setPaymentStatuses] = useState<MemberPaymentStatus[]>([]);
    const [loading, setLoading] = useState(false);
    const [notifying, setNotifying] = useState(false);

    const isAdmin = user.role === UserRole.ADMIN;

    useEffect(() => {
        if (isOpen && event && isAdmin) {
            const fetchStatuses = async () => {
                setLoading(true);
                try {
                    const data = await api.getEventPaymentStatus(event._id);
                    setPaymentStatuses(data);
                } catch (error) {
                    console.error("Failed to fetch payment statuses", error);
                    setNotification({ message: 'Could not load member payment status.', type: 'error' });
                } finally {
                    setLoading(false);
                }
            };
            fetchStatuses();
        }
    }, [isOpen, event, isAdmin, setNotification]);
    
    const handleNotify = async () => {
        if (!event) return;
        setNotifying(true);
        try {
            await api.notifyUnpaidMembersForEvent(event._id);
            setNotification({ message: 'Notifications sent to unpaid members!', type: 'success'});
        } catch (error) {
            setNotification({ message: 'Failed to send notifications.', type: 'error'});
        } finally {
            setNotifying(false);
        }
    };


    if (!event) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={event.title}>
            <div className="space-y-4 text-slate-300">
                <div>
                    <p className="text-sm font-medium text-slate-400">Date & Time</p>
                    <p>{formatDate(event.date)} at {event.time}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-400">Venue</p>
                    <p>{event.venue}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-400">Description</p>
                    <p className="whitespace-pre-wrap">{event.description}</p>
                </div>
                
                {isAdmin && (
                    <div className="pt-4 mt-4 border-t border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="text-lg font-semibold text-slate-200">Member Payment Status</h3>
                             <Button onClick={handleNotify} isLoading={notifying}>Notify Unpaid</Button>
                        </div>
                        {loading ? <Spinner /> : (
                             <div className="max-h-64 overflow-y-auto pr-2">
                                <ul className="space-y-2">
                                    {paymentStatuses.map(ps => (
                                        <li key={ps.memberId} className="flex justify-between items-center p-2 bg-slate-700/50 rounded-md">
                                            <span className="text-slate-200">{ps.memberName}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[ps.status]}`}>
                                                {ps.status}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <div className={`flex justify-end pt-4 ${!isAdmin ? 'mt-4 border-t border-slate-700' : ''}`}>
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                </div>
            </div>
        </Modal>
    );
};