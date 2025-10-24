import React, { useState, useRef } from 'react';
import { User } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/helpers';
import EditProfileForm from '../profile/EditProfileForm';
import { api } from '../../services/api';
import { Notification } from '../ui/Notification';

interface ProfileSettingsProps {
  user: User;
  onProfileUpdated: (user: User) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onProfileUpdated }) => {
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [newAvatar, setNewAvatar] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveAvatar = async () => {
        if (!newAvatar) return;
        setIsUploading(true);
        try {
            // In a real app, you'd upload the file and get back a URL.
            // Here, we're using the base64 data URL directly.
            const updatedUser = await api.updateUser(user._id, { avatar: newAvatar });
            onProfileUpdated(updatedUser);
            setNewAvatar(null);
            setNotification({ message: "Profile photo updated!", type: 'success' });
        } catch (error) {
            setNotification({ message: "Failed to update photo.", type: 'error' });
        } finally {
            setIsUploading(false);
        }
    };
    
    return (
        <>
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <Card>
                <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-slate-200">Personal Information</h2>
                    <Button variant="secondary" onClick={() => setEditModalOpen(true)}>Edit Profile</Button>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Full Name</p>
                            <p className="text-slate-100">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">Email Address</p>
                            <p className="text-slate-100">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">Phone Number</p>
                            <p className="text-slate-100">{user.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">Role</p>
                            <p className="text-slate-100 capitalize">{user.role}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">Join Date</p>
                            <p className="text-slate-100">{formatDate(user.joinDate)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">Status</p>
                            <p className="text-slate-100 capitalize">{user.status}</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-4">
                         <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                        <div className="relative group">
                            <img src={newAvatar || user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover"/>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 w-full h-full bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <span className="text-white text-xs font-semibold">Change</span>
                            </button>
                        </div>
                        {newAvatar && (
                            <div className="flex space-x-2">
                                <Button onClick={handleSaveAvatar} isLoading={isUploading} variant="success" className="!px-3 !py-1 text-xs">Save</Button>
                                <Button onClick={() => setNewAvatar(null)} variant="secondary" className="!px-3 !py-1 text-xs">Cancel</Button>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            <EditProfileForm 
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                user={user}
                onProfileUpdated={onProfileUpdated}
            />
        </>
    );
}

export default ProfileSettings;