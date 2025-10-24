
import React, { useState, useEffect } from 'react';
import { Expense } from '../../types';
import { api } from '../../services/api';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { Notification } from '../ui/Notification';

export const ExpensesList: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState<{ message: string; type: 'error' } | null>(null);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                setLoading(true);
                const data = await api.getAllExpenses();
                setExpenses(data);
            } catch (error) {
                console.error("Failed to fetch expenses", error);
                setNotification({ message: "Failed to load expenses.", type: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchExpenses();
    }, []);

    if (loading) return <Spinner />;

    return (
        <>
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <Card title="Club Expenses">
                {expenses.length === 0 ? (
                    <p className="text-center text-slate-400 py-8">No expenses have been recorded.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-400">
                            <thead className="text-xs text-slate-300 uppercase bg-slate-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Description</th>
                                    <th scope="col" className="px-6 py-3">Category</th>
                                    <th scope="col" className="px-6 py-3">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((expense) => (
                                    <tr key={expense._id} className="border-b border-slate-700 hover:bg-slate-800/20">
                                        <td className="px-6 py-4">{formatDate(expense.date)}</td>
                                        <td className="px-6 py-4 font-medium text-slate-200">{expense.description}</td>
                                        <td className="px-6 py-4 capitalize">{expense.category}</td>
                                        <td className="px-6 py-4 font-semibold">{formatCurrency(expense.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </>
    );
};
