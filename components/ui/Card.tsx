import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div className={`bg-slate-800/60 backdrop-blur-sm rounded-lg shadow-xl border border-slate-700/50 ${className}`}>
      {title && (
        <div className="px-5 py-4 border-b border-slate-700">
          <h2 className="font-semibold text-slate-200">{title}</h2>
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};