import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Payment } from '../../types';
import { Spinner } from '../ui/Spinner';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';

interface PaymentQRCodeProps {
    isOpen: boolean;
    onClose: () => void;
    payment: Payment | null;
}

export const PaymentQRCode: React.FC<PaymentQRCodeProps> = ({ isOpen, onClose, payment }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            api.getPaymentQRCode()
              .then(url => {
                setQrCodeUrl(url);
              })
              .catch(() => setQrCodeUrl(''))
              .finally(() => setLoading(false));
        }
    }, [isOpen]);

    if (!payment) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Pay with QR Code">
            <div className="flex flex-col items-center space-y-4">
                <p className="text-slate-300 text-center">Scan the QR code with your UPI app to pay.</p>
                <div className="w-48 h-48 bg-white p-2 rounded-lg flex items-center justify-center">
                    {loading ? <Spinner /> : qrCodeUrl ? 
                        <img src={qrCodeUrl} alt="Club Payment QR Code" /> :
                        <p className="text-center text-sm text-slate-600 p-4">The administrator has not set a payment QR code yet.</p>
                    }
                </div>
                {qrCodeUrl && (
                    <div className="text-center bg-amber-900/50 text-amber-300 border border-amber-800 rounded-lg p-3 w-full">
                        <p className="font-bold text-sm">IMPORTANT:</p>
                        <p className="text-sm">You must manually enter the amount below in your payment app.</p>
                        <p className="font-semibold text-white text-2xl mt-1">{formatCurrency(payment.amount)}</p>
                    </div>
                )}
                <p className="text-xs text-slate-500 text-center pt-2">After paying, remember to upload the payment proof for verification.</p>
            </div>
        </Modal>
    );
};