import { Payment } from '../types';

export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return dateString;
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const exportPaymentsToCSV = (payments: Payment[], filename: string = 'financial-report.csv') => {
    if (payments.length === 0) {
        alert("No data to export.");
        return;
    }

    const headers = ['Payment ID', 'Member Name', 'Type', 'Amount', 'Status', 'Date', 'Due Date', 'Payment Method'];
    const csvRows = [headers.join(',')];

    for (const payment of payments) {
        const row = [
            payment._id,
            `"${payment.userName || 'N/A'}"`,
            payment.type,
            payment.amount,
            payment.status,
            formatDate(payment.date),
            formatDate(payment.dueDate),
            payment.paymentMethod
        ].join(',');
        csvRows.push(row);
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
