

export enum UserRole {
    ADMIN = 'admin',
    MEMBER = 'member',
}

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar: string;
    joinDate: string;
    status: UserStatus;
    phone: string;
}

export enum PaymentStatus {
    PAID = 'paid',
    PENDING = 'pending',
    OVERDUE = 'overdue',
    CANCELLED = 'cancelled',
}

export interface Payment {
    _id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    type: 'membership' | 'event' | 'fine' | string;
    amount: number;
    status: PaymentStatus;
    date: string; // date of creation
    dueDate: string;
    paymentMethod: string;
    proofDocument?: string;
    adminNotes?: string;
    verifiedBy?: string; // admin user id
    eventId?: string;
}

export interface Event {
    _id: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    description: string;
    type: 'tournament' | 'training' | 'social';
    attendees?: string[]; // user IDs
}

export interface Notification {
    id: number;
    title: string;
    message: string;
    read: boolean;
    date: string;
}

export interface Expense {
    _id: string;
    description: string;
    amount: number;
    category: 'equipment' | 'maintenance' | 'event' | 'other';
    date: string;
    addedBy: string; // admin user ID
}