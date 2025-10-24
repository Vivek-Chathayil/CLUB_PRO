import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ForgotPasswordModal } from './ForgotPasswordModal';

const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@cricket.com');
  const [password, setPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotModalOpen, setForgotModalOpen] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password, rememberMe);
      // The parent component will handle redirect on user state change
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
            <div className="flex justify-center mb-8">
                <a href="#0" className="flex items-center space-x-2">
                    <svg width="48" height="48" viewBox="0 0 32 32">
                        <defs>
                            <linearGradient x1="28.538%" y1="20.229%" x2="100%" y2="108.156%" id="logo-a">
                                <stop stopColor="#34D399" stopOpacity="0" offset="0%"></stop>
                                <stop stopColor="#34D399" offset="100%"></stop>
                            </linearGradient>
                            <linearGradient x1="88.638%" y1="29.267%" x2="22.42%" y2="100%" id="logo-b">
                                <stop stopColor="#10B981" stopOpacity="0" offset="0%"></stop>
                                <stop stopColor="#10B981" offset="100%"></stop>
                            </linearGradient>
                        </defs>
                        <rect fill="#10B981" width="32" height="32" rx="16"></rect>
                        <path d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16A16 16 0 010 16C0 7.938 5.965 1.267 13.723.16 13.723.16 13.73.001 14.28.001h3.444c.55 0 .556.159.556.159z" fill="url(#logo-a)"></path>
                        <path d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16A16 16 0 010 16C0 7.938 5.965 1.267 13.723.16 13.723.16 13.73.001 14.28.001h3.444c.55 0 .556.159.556.159z" fill="url(#logo-b)" transform="rotate(180 16 16)"></path>
                    </svg>
                    <span className="text-4xl font-bold text-white">ClubPro</span>
                </a>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg shadow-xl border border-slate-700/50 p-8">
                <h1 className="text-2xl font-bold text-slate-100 text-center mb-1">Sign in to your account</h1>
                <p className="text-center text-slate-400 mb-6">Welcome back!</p>
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
                            className="h-4 w-4 rounded border-slate-500 text-cricket-green-600 focus:ring-cricket-green-500"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
                            Remember me
                        </label>
                    </div>

                    <div className="text-sm">
                    <button type="button" onClick={() => setForgotModalOpen(true)} className="font-medium text-cricket-green-400 hover:text-cricket-green-500">
                        Forgot your password?
                    </button>
                    </div>
                </div>

                <div>
                    <Button type="submit" className="w-full" isLoading={isLoading}>
                    Sign in
                    </Button>
                </div>
                </form>
            </div>
            <p className="text-center text-sm text-slate-500 mt-6">
                Admin Login: admin@cricket.com / password
            </p>
             <p className="text-center text-sm text-slate-500 mt-1">
                Member Login: member@cricket.com / password
            </p>
        </div>
      </div>
      <ForgotPasswordModal isOpen={isForgotModalOpen} onClose={() => setForgotModalOpen(false)} />
    </>
  );
};

export default Login;