import React, { useState } from 'react';
import { User, UserStatus } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/helpers';
import { Card } from '../ui/Card';
import { NotifyMemberModal } from './NotifyMemberModal';
import { EditMemberForm } from './EditMemberForm';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { api } from '../../services/api';

interface MemberProfileProps {
  isOpen: boolean;
  onClose: () => void;
  member: User | null;
  setNotification: (notification: { message: string; type: 'success' | 'error' } | null) => void;
  onDataChanged: () => void;
}

export const MemberProfile: React.FC<MemberProfileProps> = ({ isOpen, onClose, member, setNotification, onDataChanged }) => {
  const [isNotifyModalOpen, setNotifyModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeactivateModalOpen, setDeactivateModalOpen] = useState(false);

  if (!member) return null;
  
  const handleMemberUpdated = (updatedUser: User) => {
      setNotification({ message: 'Member updated successfully!', type: 'success' });
      onDataChanged(); // Notify list to refresh
      setEditModalOpen(false);
      onClose(); // Close main profile modal
  };

  const handleDeactivateToggle = async () => {
      const newStatus = member.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;
      try {
          await api.updateUser(member._id, { status: newStatus });
          setNotification({ message: `Member has been ${newStatus}.`, type: 'success' });
          onDataChanged();
      } catch (error) {
          setNotification({ message: 'Failed to update member status.', type: 'error' });
      } finally {
          setDeactivateModalOpen(false);
          onClose();
      }
  };

  const handleDeleteUser = async () => {
      try {
          await api.deleteUser(member._id);
          setNotification({ message: 'Member deleted successfully.', type: 'success' });
          onDataChanged();
      } catch (error) {
          setNotification({ message: 'Failed to delete member.', type: 'error' });
      } finally {
          setDeleteModalOpen(false);
          onClose();
      }
  };

  const handleNotificationSent = () => {
    setNotification({ message: `Notification sent to ${member.name}.`, type: 'success' });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Member Profile">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Panel: Info */}
          <div className="flex-grow">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-full mb-4"/>
                <h2 className="text-xl font-semibold text-slate-100">{member.name}</h2>
                <p className="text-sm text-slate-400 capitalize">{member.role}</p>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <div><p className="text-sm font-medium text-slate-400">Email</p><p className="text-slate-200 break-all">{member.email}</p></div>
                <div><p className="text-sm font-medium text-slate-400">Phone</p><p className="text-slate-200">{member.phone}</p></div>
                <div><p className="text-sm font-medium text-slate-400">Join Date</p><p className="text-slate-200">{formatDate(member.joinDate)}</p></div>
                <div><p className="text-sm font-medium text-slate-400">Status</p><span className={`px-2 py-1 rounded-full text-xs font-medium ${member.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>{member.status}</span></div>
            </div>
          </div>
          {/* Right Panel: Actions */}
          <div className="w-full md:w-48 flex-shrink-0 space-y-3">
             <h3 className="font-semibold text-slate-300 border-b border-slate-700 pb-2 mb-3">Actions</h3>
             <Button variant="primary" className="w-full" onClick={() => setEditModalOpen(true)}>Edit Member</Button>
             <Button variant="secondary" className="w-full" onClick={() => setNotifyModalOpen(true)}>Notify via Email</Button>
             <Button variant={member.status === UserStatus.ACTIVE ? 'danger' : 'success'} className="w-full" onClick={() => setDeactivateModalOpen(true)}>
                 {member.status === UserStatus.ACTIVE ? 'Deactivate' : 'Activate'} Member
             </Button>
             <div className="pt-3 mt-3 border-t border-slate-700">
                <Button variant="danger" className="w-full" onClick={() => setDeleteModalOpen(true)}>Delete Member</Button>
             </div>
          </div>
        </div>
      </Modal>

      {/* Child Modals */}
      <NotifyMemberModal isOpen={isNotifyModalOpen} onClose={() => setNotifyModalOpen(false)} member={member} onNotificationSent={handleNotificationSent} />
      <EditMemberForm isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} member={member} onMemberUpdated={handleMemberUpdated} />
      <ConfirmationModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setDeactivateModalOpen(false)}
        onConfirm={handleDeactivateToggle}
        title={`${member.status === UserStatus.ACTIVE ? 'Deactivate' : 'Activate'} Member`}
        message={`Are you sure you want to ${member.status === UserStatus.ACTIVE ? 'deactivate' : 'activate'} ${member.name}?`}
        confirmButtonVariant={member.status === UserStatus.ACTIVE ? 'danger' : 'success'}
        confirmButtonText={member.status === UserStatus.ACTIVE ? 'Deactivate' : 'Activate'}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        title="Delete Member"
        message={`Are you sure you want to permanently delete ${member.name}? This action cannot be undone.`}
      />
    </>
  );
};