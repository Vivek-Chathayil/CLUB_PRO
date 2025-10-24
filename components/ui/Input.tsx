

import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './Icons';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  const isPassword = props.type === 'password';
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          {...props}
          type={isPassword ? (isPasswordVisible ? 'text' : 'password') : props.type}
          className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500 sm:text-sm"
        />
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          >
            {isPasswordVisible ? (
              <EyeOffIcon className="h-5 w-5 text-slate-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-slate-400" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};