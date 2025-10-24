
import React, { useState, useEffect } from 'react';
import { Payment, PaymentStatus, User, UserRole } from '../../types';
import { api } from '../../services/api';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { CheckCircleIcon, XCircleIcon } from '../ui/Icons';
import { Notification } from '../ui/Notification';

interface VerificationModalState {
    isOpen: boolean;
    payment: Payment | null;
    action: 'approve' | 'reject' | null;
}

export const PaymentVerificationPanel: React.FC<{ adminUser: User }> = ({ adminUser }) => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState<VerificationModalState>({ isOpen: false, payment: null, action: null });
    const [adminNotes, setAdminNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const fetchPendingPayments = async () => {
        try {
            setLoading(true);
            const data = await api.getPendingPayments();
            setPayments(data);
        } catch (error) {
            console.error("Failed to fetch pending payments", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchPendingPayments();
    }, []);

    const openModal = (payment: Payment, action: 'approve' | 'reject') => {
        setModalState({ isOpen: true, payment, action });
        setAdminNotes('');
    };

    const closeModal = () => {
        setModalState({ isOpen: false, payment: null, action: null });
    };

    const handleVerification = async () => {
        if (!modalState.payment || !modalState.action) return;
        
        setIsSubmitting(true);
        const newStatus = modalState.action === 'approve' ? PaymentStatus.PAID : PaymentStatus.CANCELLED;
        
        try {
            await api.verifyPayment(modalState.payment._id, newStatus, adminNotes, adminUser._id);
            setPayments(payments.filter(p => p._id !== modalState.payment?._id));
            setNotification({ message: `Payment ${modalState.action === 'approve' ? 'approved' : 'rejected'} successfully.`, type: 'success' });
            closeModal();
        } catch(error) {
            console.error("Verification failed", error);
            setNotification({ message: 'Verification failed. Please try again.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <>
        {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
        <Card title="Pending Payment Verifications">
            {payments.length === 0 ? (
                <p className="text-center text-slate-400 py-8">No pending payments to verify.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Member</th>
                                <th scope="col" className="px-6 py-3">Amount</th>
                                <th scope="col" className="px-6 py-3">Due Date</th>
                                <th scope="col" className="px-6 py-3">Proof</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((p) => (
                                <tr key={p._id} className="border-b border-slate-700 hover:bg-slate-800/20">
                                    <td className="px-6 py-4 flex items-center">
                                        <img src={p.userAvatar} alt={p.userName} className="w-8 h-8 rounded-full mr-3" />
                                        <span className="font-medium text-slate-200">{p.userName}</span>
                                    </td>
                                    <td className="px-6 py-4">{formatCurrency(p.amount)}</td>
                                    <td className="px-6 py-4">{formatDate(p.dueDate)}</td>
                                    <td className="px-6 py-4">
                                        {p.proofDocument ? (
                                            <a href={p.proofDocument} target="_blank" rel="noopener noreferrer" className="text-cricket-green-400 hover:underline">View Proof</a>
                                        ) : (
                                            <span className="text-slate-500">None</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 flex space-x-2">
                                        <Button variant="success" onClick={() => openModal(p, 'approve')}><CheckCircleIcon className="w-5 h-5" /></Button>
                                        <Button variant="danger" onClick={() => openModal(p, 'reject')}><XCircleIcon className="w-5 h-5" /></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>

        {modalState.isOpen && modalState.payment && (
            <Modal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                title={`${modalState.action === 'approve' ? 'Approve' : 'Reject'} Payment`}
            >
                <div className="space-y-4">
                    <p>You are about to {modalState.action} a payment of <span className="font-bold">{formatCurrency(modalState.payment.amount)}</span> from <span className="font-bold">{modalState.payment.userName}</span>.</p>
                    <div>
                        <label htmlFor="adminNotes" className="block text-sm font-medium text-slate-300 mb-1">Admin Notes (Optional)</label>
                        <textarea
                            id="adminNotes"
                            rows={3}
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500"
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                        <Button
                            variant={modalState.action === 'approve' ? 'success' : 'danger'}
                            onClick={handleVerification}
                            isLoading={isSubmitting}
                        >
                            Confirm {modalState.action === 'approve' ? 'Approval' : 'Rejection'}
                        </Button>
                    </div>
                </div>
            </Modal>
        )}
        </>
    );
};
