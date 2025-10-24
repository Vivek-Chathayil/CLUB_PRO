import React, { useState } from 'react';
import { api } from '../../services/api';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Notification } from '../ui/Notification';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
      await api.register({ name, email, phone, password });
      setNotification("Registration successful! You can now log in.");
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {notification && <Notification message={notification} type="success" onClose={() => setNotification(null)} />}
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4" style={{ backgroundImage: `url('https://source.unsplash.com/1600x900/?cricket,stadium')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative z-10 w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white">ClubPro</h1>
                <p className="text-slate-300 mt-2">Member Registration</p>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-md rounded-lg shadow-xl border border-slate-700/50 p-8">
              <h2 className="text-2xl font-bold text-slate-100 text-center mb-6">Create Your Account</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input id="name" label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input id="email" label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input id="phone" label="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Input id="confirmPassword" label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <div>
                  <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                    Sign Up
                  </Button>
                </div>

                <p className="mt-4 text-center text-sm text-slate-400">
                  Already have an account?{' '}
                  <button type="button" onClick={onSwitchToLogin} className="font-medium text-cricket-green-400 hover:text-cricket-green-300">
                    Sign In
                  </button>
                </p>
              </form>
            </div>
          </div>
      </div>
    </>
  );
};
