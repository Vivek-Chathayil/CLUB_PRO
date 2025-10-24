

import React from 'react';
import { Card } from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass, onClick }) => {
  const isClickable = !!onClick;
  return (
    <div onClick={onClick} className={isClickable ? 'cursor-pointer' : ''}>
      <Card className={`flex items-center p-5 ${isClickable ? 'hover:bg-slate-700/80 transition-colors' : ''}`}>
        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full mr-4 ${colorClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-slate-100">{value}</p>
        </div>
      </Card>
    </div>
  );
};