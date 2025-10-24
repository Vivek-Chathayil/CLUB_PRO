

import React, { useEffect, useState } from 'react';
import { Payment, PaymentStatus, User } from '../../types';
import { api } from '../../services/api';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { Button } from '../ui/Button';
import { SubmitProofForm } from './SubmitProofForm';
import { CheckCircleIcon, XCircleIcon } from '../ui/Icons';
import { PaymentQRCode } from './PaymentQRCode';

interface PaymentHistoryProps {
  user: User;
}

const statusStyles: { [key in PaymentStatus]: string } = {
  [PaymentStatus.PAID]: 'bg-emerald-500/20 text-emerald-400',
  [PaymentStatus.PENDING]: 'bg-amber-500/20 text-amber-400',
  [PaymentStatus.OVERDUE]: 'bg-red-500/20 text-red-400',
  [PaymentStatus.CANCELLED]: 'bg-slate-500/20 text-slate-400',
};

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ user }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [qrPayment, setQrPayment] = useState<Payment | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await api.getPaymentsForUser(user._id);
      setPayments(data);
    } catch (error) {
      console.error("Failed to fetch payments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const handleOpenProofModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsProofModalOpen(true);
  };

  const handleProofSubmitted = (updatedPayment: Payment) => {
    setPayments(payments.map(p => p._id === updatedPayment._id ? updatedPayment : p));
    setIsProofModalOpen(false);
  };

  if (loading) return <Spinner />;

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Finance</h1>
        </div>
        <Card title="Payment History">
          {payments.length === 0 ? (
            <p className="text-center text-slate-400 py-8">You have no payment history.</p>
          ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-400">
                    <thead className="text-xs text-slate-300 uppercase bg-slate-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">Amount</th>
                            <th scope="col" className="px-6 py-3">Due Date</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((p) => (
                            <tr key={p._id} className="border-b border-slate-700 hover:bg-slate-800/20">
                                <td className="px-6 py-4 capitalize font-medium text-slate-200">{p.type}</td>
                                <td className="px-6 py-4">{formatCurrency(p.amount)}</td>
                                <td className="px-6 py-4">{formatDate(p.dueDate)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[p.status]}`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center space-x-2">
                                        {(p.status === PaymentStatus.PENDING || p.status === PaymentStatus.OVERDUE) && !p.proofDocument && (
                                            <>
                                                <Button variant="primary" className="px-2 py-1 text-xs" onClick={() => setQrPayment(p)}>QR Pay</Button>
                                                <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => handleOpenProofModal(p)}>Submit Proof</Button>
                                            </>
                                        )}
                                        {p.status === PaymentStatus.PENDING && p.proofDocument && (
                                            <span className="text-xs text-slate-500 italic">Proof Submitted</span>
                                        )}
                                        {p.status === PaymentStatus.PAID && (
                                            <span className="flex items-center text-emerald-400 text-xs"><CheckCircleIcon className="w-4 h-4 mr-1"/>Verified</span>
                                        )}
                                        {p.status === PaymentStatus.CANCELLED && (
                                            <span className="flex items-center text-red-400 text-xs"><XCircleIcon className="w-4 h-4 mr-1"/>Rejected</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
          )}
        </Card>
      </div>

      {isProofModalOpen && selectedPayment && (
        <SubmitProofForm
          isOpen={isProofModalOpen}
          onClose={() => setIsProofModalOpen(false)}
          payment={selectedPayment}
          onProofSubmitted={handleProofSubmitted}
        />
      )}
      <PaymentQRCode isOpen={!!qrPayment} onClose={() => setQrPayment(null)} payment={qrPayment} />
    </>
  );
};
