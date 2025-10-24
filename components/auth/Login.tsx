import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('admin@cricket.com');
  const [password, setPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password, rememberMe);
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4" style={{ backgroundImage: `url('https://source.unsplash.com/1600x900/?cricket,stadium')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative z-10 w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white">ClubPro</h1>
                <p className="text-slate-300 mt-2">Your Cricket Club Management Suite</p>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-md rounded-lg shadow-xl border border-slate-700/50 p-8">
              <h2 className="text-2xl font-bold text-slate-100 text-center mb-6">Login</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-cricket-green-600 focus:ring-cricket-green-500"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <button type="button" onClick={() => setForgotPasswordOpen(true)} className="font-medium text-cricket-green-400 hover:text-cricket-green-300">
                      Forgot your password?
                    </button>
                  </div>
                </div>

                <div>
                  <Button type="submit" className="w-full" isLoading={isLoading}>
                    Sign in
                  </Button>
                </div>
                 <p className="mt-4 text-center text-sm text-slate-400">
                  Don't have an account?{' '}
                  <button type="button" onClick={onSwitchToRegister} className="font-medium text-cricket-green-400 hover:text-cricket-green-300">
                    Sign Up
                  </button>
                </p>
              </form>
            </div>
          </div>
      </div>
      <ForgotPasswordModal isOpen={isForgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)} />
    </>
  );
};