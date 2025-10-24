import { User, UserRole, UserStatus, Payment, PaymentStatus, Event, Notification, Expense } from '../types';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock Users
const users: User[] = [
  {
    _id: 'admin1',
    name: 'Admin User',
    email: 'admin@cricket.com',
    role: UserRole.ADMIN,
    avatar: `https://i.pravatar.cc/150?u=admin1`,
    joinDate: '2022-01-15T10:00:00Z',
    status: UserStatus.ACTIVE,
    phone: '123-456-7890',
  },
  {
    _id: 'member1',
    name: 'John Doe',
    email: 'member@cricket.com',
    role: UserRole.MEMBER,
    avatar: `https://i.pravatar.cc/150?u=member1`,
    joinDate: '2022-03-20T14:30:00Z',
    status: UserStatus.ACTIVE,
    phone: '987-654-3210',
  },
  {
    _id: 'member2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: UserRole.MEMBER,
    avatar: `https://i.pravatar.cc/150?u=member2`,
    joinDate: '2023-05-10T09:00:00Z',
    status: UserStatus.ACTIVE,
    phone: '555-123-4567',
  },
  {
    _id: 'member3',
    name: 'Peter Jones',
    email: 'peter.jones@example.com',
    role: UserRole.MEMBER,
    avatar: `https://i.pravatar.cc/150?u=member3`,
    joinDate: '2023-06-01T11:45:00Z',
    status: UserStatus.INACTIVE,
    phone: '555-987-6543',
  },
];

// Mock Payments
const payments: Payment[] = [
  {
    _id: 'payment1',
    userId: 'member1',
    userName: 'John Doe',
    userAvatar: `https://i.pravatar.cc/150?u=member1`,
    type: 'membership',
    amount: 5000,
    status: PaymentStatus.PAID,
    date: '2024-05-01T10:00:00Z',
    dueDate: '2024-05-15T10:00:00Z',
    paymentMethod: 'Credit Card',
    verifiedBy: 'admin1',
  },
  {
    _id: 'payment2',
    userId: 'member1',
    userName: 'John Doe',
    userAvatar: `https://i.pravatar.cc/150?u=member1`,
    type: 'event',
    eventId: 'event1',
    amount: 500,
    status: PaymentStatus.PENDING,
    date: '2024-06-10T11:00:00Z',
    dueDate: '2024-06-25T11:00:00Z',
    paymentMethod: 'UPI',
  },
  {
    _id: 'payment3',
    userId: 'member2',
    userName: 'Jane Smith',
    userAvatar: `https://i.pravatar.cc/150?u=member2`,
    type: 'membership',
    amount: 5000,
    status: PaymentStatus.OVERDUE,
    date: '2024-05-01T10:00:00Z',
    dueDate: '2024-05-15T10:00:00Z',
    paymentMethod: 'Bank Transfer',
  },
  {
    _id: 'payment4',
    userId: 'member2',
    userName: 'Jane Smith',
    userAvatar: `https://i.pravatar.cc/150?u=member2`,
    type: 'fine',
    amount: 200,
    status: PaymentStatus.PENDING,
    date: '2024-06-15T15:00:00Z',
    dueDate: '2024-06-30T15:00:00Z',
    paymentMethod: 'UPI',
    proofDocument: 'https://res.cloudinary.com/demo/image/upload/receipt.jpg',
  },
];

// Mock Events
const upcomingEvents: Event[] = [
  {
    _id: 'event1',
    title: 'Club Championship Tournament',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    time: '09:00 AM',
    venue: 'Main Cricket Ground',
    description: 'Annual club championship. All members are invited to participate.',
    type: 'tournament',
    attendees: ['member1', 'member2'],
  },
  {
    _id: 'event2',
    title: 'Weekly Training Session',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    time: '05:00 PM',
    venue: 'Practice Nets',
    description: 'Regular training session focusing on batting techniques.',
    type: 'training',
    attendees: ['member1'],
  },
];

// Mock Notifications
const notifications: Notification[] = [
  {
    id: 1,
    title: 'New Payment Request',
    message: 'A new payment request for Membership Fee has been created.',
    read: false,
    date: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Upcoming Event',
    message: 'The Club Championship is just a week away!',
    read: false,
    date: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Payment Verified',
    message: 'Your payment for the event has been successfully verified.',
    read: true,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Expenses
const expenses: Expense[] = [
    {
        _id: 'expense1',
        description: 'New set of cricket balls',
        amount: 2500,
        category: 'equipment',
        date: '2024-06-10T00:00:00.000Z',
        addedBy: 'admin1',
    },
    {
        _id: 'expense2',
        description: 'Pitch maintenance',
        amount: 3000,
        category: 'maintenance',
        date: '2024-06-05T00:00:00.000Z',
        addedBy: 'admin1',
    },
];

let paymentQRCodeUrl = '';

export const mockData = {
  users,
  payments,
  events: upcomingEvents,
  notifications,
  expenses,
  paymentQRCodeUrl,
};