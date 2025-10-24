import React, { useState } from 'react';
import { User } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/helpers';
import { Card } from '../ui/Card';
import { NotifyMemberModal } from './NotifyMemberModal';

interface MemberProfileProps {
  isOpen: boolean;
  onClose: () => void;
  member: User | null;
  setNotification: (notification: { message: string; type: 'success' | 'error' } | null) => void;
}

export const MemberProfile: React.FC<MemberProfileProps> = ({ isOpen, onClose, member, setNotification }) => {
  const [isNotifyModalOpen, setNotifyModalOpen] = useState(false);

  if (!member) return null;

  const handleNotificationSent = () => {
    setNotification({ message: `Notification sent to ${member.name}.`, type: 'success' });
  };

  return (
    <>
        <Modal isOpen={isOpen} onClose={onClose} title="Member Profile">
        <div>
            <Card className="!bg-transparent !shadow-none !border-0">
                <div className="flex flex-col items-center">
                    <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-full mb-4"/>
                    <h2 className="text-xl font-semibold text-slate-100">{member.name}</h2>
                    <p className="text-sm text-slate-400 capitalize">{member.role}</p>
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                        <p className="text-sm font-medium text-slate-400">Email Address</p>
                        <p className="text-slate-200">{member.email}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-400">Phone Number</p>
                        <p className="text-slate-200">{member.phone}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-400">Join Date</p>
                        <p className="text-slate-200">{formatDate(member.joinDate)}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-400">Status</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            member.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                        }`}>
                            {member.status}
                        </span>
                    </div>
                </div>
            </Card>
            <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-700">
                <Button variant="primary" onClick={() => setNotifyModalOpen(true)}>Notify via Email</Button>
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </div>
        </div>
        </Modal>

        <NotifyMemberModal
            isOpen={isNotifyModalOpen}
            onClose={() => setNotifyModalOpen(false)}
            member={member}
            onNotificationSent={handleNotificationSent}
        />
    </>
  );
};