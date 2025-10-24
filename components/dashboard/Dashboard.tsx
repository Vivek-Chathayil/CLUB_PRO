import React, { useEffect, useState } from 'react';
import { User, UserRole, Payment, Event } from '../../types';
import { api } from '../../services/api';
import { Spinner } from '../ui/Spinner';
import { StatCard } from './StatCard';
import { MembersIcon, FinanceIcon, EventsIcon, CheckCircleIcon } from '../ui/Icons';
import { Card } from '../ui/Card';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { PaymentVerificationPanel } from '../admin/PaymentVerificationPanel';

interface DashboardProps {
  user: User;
  setPage: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, setPage }) => {
  const [stats, setStats] = useState<any>(null);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, paymentsData, eventsData] = await Promise.all([
          api.getDashboardStats(user._id, user.role),
          user.role === UserRole.ADMIN ? api.getRecentPayments() : Promise.resolve([]),
          api.getUpcomingEvents(),
        ]);
        setStats(statsData);
        setRecentPayments(paymentsData);
        setUpcomingEvents(eventsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading || !stats) {
    return <Spinner />;
  }
  
  const isAdmin = user.role === UserRole.ADMIN;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h1>
        <p className="text-slate-400 mt-1">Here's what's happening in the club today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isAdmin ? (
              <>
                <StatCard title="Total Members" value={stats.totalMembers} icon={<MembersIcon className="w-6 h-6 text-white"/>} colorClass="bg-blue-500" />
                <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={<FinanceIcon className="w-6 h-6 text-white"/>} colorClass="bg-emerald-500" />
                <StatCard title="Pending Verifications" value={stats.pendingVerifications} icon={<CheckCircleIcon className="w-6 h-6 text-white"/>} colorClass="bg-amber-500" onClick={() => setPage('finance')} />
                <StatCard title="Upcoming Events" value={stats.upcomingEvents} icon={<EventsIcon className="w-6 h-6 text-white"/>} colorClass="bg-indigo-500" onClick={() => setPage('events')} />
              </>
          ) : (
              <>
                <StatCard title="Pending Payments" value={stats.pendingPayments} icon={<FinanceIcon className="w-6 h-6 text-white"/>} colorClass="bg-amber-500" onClick={() => setPage('finance')} />
                <StatCard title="Total Paid" value={formatCurrency(stats.totalPaid)} icon={<FinanceIcon className="w-6 h-6 text-white"/>} colorClass="bg-emerald-500" />
                <StatCard title="Upcoming Events" value={stats.upcomingEvents} icon={<EventsIcon className="w-6 h-6 text-white"/>} colorClass="bg-indigo-500" onClick={() => setPage('events')}/>
              </>
          )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {isAdmin && <PaymentVerificationPanel adminUser={user} />}
          </div>
          <div className="space-y-8">
            {isAdmin && recentPayments.length > 0 && (
                <Card title="Recent Payments">
                    <ul className="divide-y divide-slate-700">
                    {recentPayments.map(p => (
                        <li key={p._id} className="py-3 flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={p.userAvatar} alt={p.userName} className="w-8 h-8 rounded-full mr-3"/>
                                <div>
                                    <p className="font-medium text-sm text-slate-200">{p.userName}</p>
                                    <p className="text-xs text-slate-400 capitalize">{p.type}</p>
                                </div>
                            </div>
                            <span className="font-semibold text-sm text-emerald-400">{formatCurrency(p.amount)}</span>
                        </li>
                    ))}
                    </ul>
                </Card>
            )}

            <Card title="Upcoming Events">
                 {upcomingEvents.length > 0 ? (
                    <ul className="space-y-3">
                        {upcomingEvents.map(event => (
                            <li key={event._id} className="text-sm p-3 bg-slate-700/50 rounded-md">
                                <p className="font-semibold text-slate-200">{event.title}</p>
                                <p className="text-xs text-slate-400">{formatDate(event.date)} at {event.time}</p>
                            </li>
                        ))}
                    </ul>
                 ) : (
                    <p className="text-center text-slate-400 py-4">No upcoming events.</p>
                 )}
            </Card>
          </div>
      </div>
    </div>
  );
};