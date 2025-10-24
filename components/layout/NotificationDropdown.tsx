import React, { useState, useEffect, useRef } from 'react';
import { BellIcon } from '../ui/Icons';
import { Notification } from '../../types';
import { mockData } from '../../data/mockData';

export const NotificationDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(mockData.notifications);
    
    const unreadCount = notifications.filter(n => !n.read).length;
    const trigger = useRef<HTMLButtonElement>(null);
    const dropdown = useRef<HTMLDivElement>(null);

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
        if (!dropdown.current) return;
        if (
            !isOpen ||
            dropdown.current.contains(target as Node) ||
            trigger.current?.contains(target as Node)
        )
            return;
        setIsOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    }, [isOpen]);

    const handleRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    }

    return (
        <div className="relative inline-flex">
            <button
                ref={trigger}
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-600/50"
            >
                <BellIcon className="w-5 h-5 text-slate-300" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                 <div
                    ref={dropdown}
                    className="origin-top-right absolute top-full right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden z-20"
                 >
                     <div className="px-4 py-2 font-semibold text-slate-200 border-b border-slate-700">Notifications</div>
                     <ul className="divide-y divide-slate-700 max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? notifications.map(notification => (
                             <li key={notification.id} className={`p-3 hover:bg-slate-700/50 ${!notification.read ? 'bg-slate-700' : ''}`} onClick={() => handleRead(notification.id)}>
                                 <p className="font-semibold text-sm text-slate-200">{notification.title}</p>
                                 <p className="text-xs text-slate-400">{notification.message}</p>
                             </li>
                        )) : (
                            <li className="p-4 text-sm text-slate-400 text-center">No new notifications</li>
                        )}
                     </ul>
                 </div>
            )}
        </div>
    );
}