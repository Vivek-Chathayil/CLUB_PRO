import React, { useState, useEffect } from 'react';
import { Payment, User } from '../../types';
import { api } from '../../services/api';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { BulkPaymentRequestForm } from './BulkPaymentRequestForm';
import FinancialReport from '../reports/FinancialReport';
import { ExpensesList } from './ExpensesList';
import { Notification } from '../ui/Notification';
import { SetPaymentQRModal } from './SetPaymentQRModal';

interface AdminFinancePageProps {
  user: User;
}

const statusStyles: { [key: string]: string } = {
  paid: 'bg-emerald-500/20 text-emerald-400',
  pending: 'bg-amber-500/20 text-amber-400',
  overdue: 'bg-red-500/20 text-red-400',
  cancelled: 'bg-slate-500/20 text-slate-400',
};

const AdminFinancePage: React.FC<AdminFinancePageProps> = ({ user }) => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isBulkModalOpen, setBulkModalOpen] = useState(false);
    const [isSetQRModalOpen, setSetQRModalOpen] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [activeTab, setActiveTab] = useState('payments');

    // State to force re-render of child components
    const [dataVersion, setDataVersion] = useState(0);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await api.getAllPayments();
            setPayments(data);
        } catch (error) {
            console.error("Failed to fetch payments", error);
            setNotification({ message: 'Failed to load financial data.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [dataVersion]);

    const handleSuccess = () => {
        setDataVersion(v => v + 1); // Trigger re-fetch in main component and children
        setBulkModalOpen(false);
        setNotification({ message: 'Action completed successfully!', type: 'success' });
    };
    
    const renderContent = () => {
        if (loading) return <Spinner />;
        
        switch (activeTab) {
            case 'payments':
                return (
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-400">
                            <thead className="text-xs text-slate-300 uppercase bg-slate-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Member</th>
                                    <th scope="col" className="px-6 py-3">Expense</th>
                                    <th scope="col" className="px-6 py-3">Amount</th>
                                    <th scope="col" className="px-6 py-3">Due Date</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((p) => (
                                    <tr key={p._id} className="border-b border-slate-700 hover:bg-slate-800/20">
                                        <td className="px-6 py-4 flex items-center">
                                            <img src={p.userAvatar} alt={p.userName} className="w-8 h-8 rounded-full mr-3" />
                                            <span className="font-medium text-slate-200">{p.userName}</span>
                                        </td>
                                        <td className="px-6 py-4 capitalize">{p.type}</td>
                                        <td className="px-6 py-4">{formatCurrency(p.amount)}</td>
                                        <td className="px-6 py-4">{formatDate(p.dueDate)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[p.status]}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                );
            case 'expenses':
                return <ExpensesList key={dataVersion} />; // Use key to force re-render
            case 'reports':
                return <FinancialReport />;
            default:
                return null;
        }
    }

    return (
        <>
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Finance Management</h1>
                    <div className="space-x-2">
                        <Button onClick={() => setBulkModalOpen(true)}>Request</Button>
                        <Button variant="secondary" onClick={() => setSetQRModalOpen(true)}>Set QR</Button>
                    </div>
                </div>
                
                 <div className="flex border-b border-slate-700">
                    <button onClick={() => setActiveTab('payments')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'payments' ? 'border-b-2 border-cricket-green-500 text-white' : 'text-slate-400 hover:text-white'}`}>All Payments</button>
                    <button onClick={() => setActiveTab('expenses')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'expenses' ? 'border-b-2 border-cricket-green-500 text-white' : 'text-slate-400 hover:text-white'}`}>Expenses</button>
                    <button onClick={() => setActiveTab('reports')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'reports' ? 'border-b-2 border-cricket-green-500 text-white' : 'text-slate-400 hover:text-white'}`}>Reports</button>
                 </div>

                <Card>
                    {renderContent()}
                </Card>
            </div>
            
            <BulkPaymentRequestForm isOpen={isBulkModalOpen} onClose={() => setBulkModalOpen(false)} onPaymentsCreated={handleSuccess} />
            <SetPaymentQRModal isOpen={isSetQRModalOpen} onClose={() => setSetQRModalOpen(false)} onSave={() => setNotification({ message: 'QR Code updated!', type: 'success' })} />
        </>
    );
};

export default AdminFinancePage;