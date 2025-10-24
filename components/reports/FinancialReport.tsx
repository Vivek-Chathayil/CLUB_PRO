import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { exportPaymentsToCSV, formatCurrency } from '../../utils/helpers';
import { Notification } from '../ui/Notification';
import { Spinner } from '../ui/Spinner';
import { FinanceIcon } from '../ui/Icons';

const FinancialReport: React.FC = () => {
    const [downloading, setDownloading] = useState(false);
    const [loadingSummary, setLoadingSummary] = useState(true);
    const [summary, setSummary] = useState({ totalRevenue: 0, totalExpenses: 0, netProfit: 0 });
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoadingSummary(true);
                const data = await api.getFinancialSummary();
                setSummary(data);
            } catch (error) {
                console.error("Failed to fetch financial summary", error);
                setNotification({ message: "Failed to load summary.", type: 'error' });
            } finally {
                setLoadingSummary(false);
            }
        };
        fetchSummary();
    }, []);

    const handleGenerateReport = async () => {
        setDownloading(true);
        try {
            const allPayments = await api.getAllPayments();
            if (allPayments.length > 0) {
                exportPaymentsToCSV(allPayments, `financial-report-${new Date().toISOString().split('T')[0]}.csv`);
                setNotification({ message: "Report downloaded successfully!", type: 'success'});
            } else {
                setNotification({ message: "No payment data to export.", type: 'error' });
            }
        } catch (error) {
            console.error("Failed to generate report", error);
            setNotification({ message: "Failed to download report.", type: 'error' });
        } finally {
            setDownloading(false);
        }
    };

    return (
        <>
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <Card title="Financial Summary & Reports">
                {loadingSummary ? <Spinner /> : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-slate-700/50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-slate-400">Total Revenue</h3>
                            <p className="text-2xl font-bold text-emerald-400">{formatCurrency(summary.totalRevenue)}</p>
                        </div>
                        <div className="bg-slate-700/50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-slate-400">Total Expenses</h3>
                            <p className="text-2xl font-bold text-red-400">{formatCurrency(summary.totalExpenses)}</p>
                        </div>
                        <div className="bg-slate-700/50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-slate-400">Net Profit / Loss</h3>
                            <p className={`text-2xl font-bold ${summary.netProfit >= 0 ? 'text-slate-200' : 'text-amber-400'}`}>
                                {formatCurrency(summary.netProfit)}
                            </p>
                        </div>
                    </div>
                )}
                <div className="space-y-4 pt-6 border-t border-slate-700">
                    <p className="text-slate-400">
                        Download a complete financial report of all payment transactions recorded in the system.
                    </p>
                    <div className="flex justify-start">
                        <Button onClick={handleGenerateReport} isLoading={downloading}>
                            Download Full Payment Report (CSV)
                        </Button>
                    </div>
                </div>
            </Card>
        </>
    );
};

export default FinancialReport;