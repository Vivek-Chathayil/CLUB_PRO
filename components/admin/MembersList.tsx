import React, { useState, useEffect, useMemo } from 'react';
import { User } from '../../types';
import { api } from '../../services/api';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate } from '../../utils/helpers';
import { AddMemberForm } from './AddMemberForm';
import { EditMemberForm } from './EditMemberForm';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { MemberProfile } from './MemberProfile';
import { Notification } from '../ui/Notification';

export const MembersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);


  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getAllUsers();
      setUsers(data.filter(u => u.role !== 'admin')); // Only show members
    } catch (error) {
      console.error("Failed to fetch users", error);
      setNotification({ message: 'Failed to load members.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [users, debouncedSearchTerm]);

  const handleMemberAdded = (newUser: User) => {
    setUsers([newUser, ...users]);
    setAddModalOpen(false);
    setNotification({ message: 'Member added successfully!', type: 'success' });
  };
  
  const handleMemberUpdated = (updatedUser: User) => {
      setUsers(users.map(u => u._id === updatedUser._id ? updatedUser : u));
      setEditModalOpen(false);
      setNotification({ message: 'Member updated successfully!', type: 'success' });
  };
  
  const handleDeleteUser = async () => {
      if (!selectedUser) return;
      try {
          await api.deleteUser(selectedUser._id);
          setUsers(users.filter(u => u._id !== selectedUser._id));
          setDeleteModalOpen(false);
          setNotification({ message: 'Member deleted successfully.', type: 'success' });
      } catch (error) {
          console.error("Failed to delete user", error);
          setNotification({ message: 'Failed to delete member.', type: 'error' });
      }
  };

  const openEditModal = (user: User) => {
      setSelectedUser(user);
      setEditModalOpen(true);
  };
  
  const openDeleteModal = (user: User) => {
      setSelectedUser(user);
      setDeleteModalOpen(true);
  };

  const openProfileModal = (user: User) => {
    setSelectedUser(user);
    setProfileModalOpen(true);
  }

  if (loading) return <Spinner />;

  return (
    <>
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Members Management</h1>
          <Button onClick={() => setAddModalOpen(true)}>Add New Member</Button>
        </div>

        <Card>
            <div className="p-4">
                <Input
                    id="search"
                    label="Search Members"
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-400">
                    <thead className="text-xs text-slate-300 uppercase bg-slate-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Join Date</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="border-b border-slate-700 hover:bg-slate-800/20">
                                <td className="px-6 py-4 flex items-center">
                                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-3" />
                                    <span className="font-medium text-slate-200">{user.name}</span>
                                </td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{formatDate(user.joinDate)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        user.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                                    }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <Button variant="secondary" className="!p-2" onClick={() => openProfileModal(user)}>View</Button>
                                        <Button variant="primary" className="!p-2" onClick={() => openEditModal(user)}>Edit</Button>
                                        <Button variant="danger" className="!p-2" onClick={() => openDeleteModal(user)}>Delete</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </Card>
      </div>

      <AddMemberForm 
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onMemberAdded={handleMemberAdded}
      />
      <EditMemberForm
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onMemberUpdated={handleMemberUpdated}
        member={selectedUser}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        title="Delete Member"
        message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
      />
      <MemberProfile
        isOpen={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        member={selectedUser}
        setNotification={setNotification}
      />
    </>
  );
};