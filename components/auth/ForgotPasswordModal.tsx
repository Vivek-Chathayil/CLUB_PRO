import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(res => setTimeout(res, 1000));
        setIsLoading(false);
        setIsSent(true);
    };

    const handleClose = () => {
        onClose();
        // Reset state after modal closes
        setTimeout(() => {
            setEmail('');
            setIsSent(false);
        }, 300);
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Reset Password">
            {isSent ? (
                <div className="text-center">
                    <h3 className="text-lg font-medium text-slate-200">Check your email</h3>
                    <p className="mt-2 text-sm text-slate-400">
                        We've sent a password reset link to <span className="font-semibold text-slate-200">{email}</span>. Please check your inbox and spam folder.
                    </p>
                    <div className="mt-4">
                        <Button onClick={handleClose}>Close</Button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-sm text-slate-400">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                    <Input
                        id="reset-email"
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                    />
                    <div className="flex justify-end space-x-2 pt-2">
                        <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button type="submit" isLoading={isLoading}>Send Reset Link</Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
