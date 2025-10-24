
import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Notification } from '../ui/Notification';

const SecuritySettings = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

    const handleSave = async () => {
        setError('');
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setIsSaving(true);
        // Simulate API call
        await new Promise(res => setTimeout(res, 1000));
        
        // This is where you would call api.changePassword(...)
        if (oldPassword === 'password') { // Mock check
            setNotification({message: "Password updated successfully!", type: 'success'});
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setError("Incorrect old password.");
            setNotification({message: "Failed to update password.", type: 'error'});
        }
        
        setIsSaving(false);
    };

    return (
        <>
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <Card>
                <h2 className="text-xl font-semibold text-slate-200">Change Password</h2>
                <p className="text-slate-400 text-sm mt-1">Update your password for better security.</p>
                <div className="mt-6 space-y-4 max-w-sm">
                    <Input 
                        id="old-password"
                        label="Old Password"
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <Input 
                        id="new-password"
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input 
                        id="confirm-password"
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
                <div className="mt-6 flex justify-end">
                    <Button onClick={handleSave} isLoading={isSaving}>Update Password</Button>
                </div>
            </Card>
        </>
    );
};

export default SecuritySettings;
