import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { api } from '../../services/api';
import { Notification } from '../ui/Notification';

interface ResetPasswordFormProps {
    token: string;
    onResetSuccess: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token, onResetSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    try {
        await api.resetPassword(token, password);
        setNotification("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
            onResetSuccess();
        }, 2000);
    } catch (err: any) {
        setError(err.message || "Failed to reset password.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
        {notification && <Notification message={notification} type="success" onClose={() => setNotification(null)} />}
        <div className="w-full max-w-md">
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg shadow-xl border border-slate-700/50 p-8">
            <h1 className="text-2xl font-bold text-slate-100 text-center mb-6">Reset Your Password</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
            <Input
                id="new-password"
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <Input
                id="confirm-password"
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <div>
                <Button type="submit" className="w-full" isLoading={isLoading}>
                Reset Password
                </Button>
            </div>
            </form>
        </div>
        </div>
    </>
  );
};

export default ResetPasswordForm;