import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRequestReset: (email: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose, onRequestReset }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await onRequestReset(email);
        setIsLoading(false);
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => setEmail(''), 300);
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Reset Password">
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
        </Modal>
    );
};