import {
  User,
  Payment,
  Event,
  UserRole,
  UserStatus,
  PaymentStatus,
  Expense,
  Payment as TPayment,
} from '../types';
import { mockData } from '../data/mockData';

// Simulate a database
let db = {
  users: [...mockData.users],
  payments: [...mockData.payments],
  events: [...mockData.events],
  expenses: [...mockData.expenses],
  paymentQRCodeUrl: mockData.paymentQRCodeUrl,
};

// Helper to simulate API delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const generateId = () => Math.random().toString(36).substr(2, 9);


export const api = {
  login: async (email: string, password: string): Promise<User> => {
    await delay(500);
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    // In a real app, you'd check a hashed password. Here we allow any password for a found user.
    if (user && password) {
      return user;
    }
    throw new Error('Invalid credentials');
  },
  
  getAllUsers: async (): Promise<User[]> => {
    await delay(300);
    return [...db.users];
  },

  addUser: async (userData: Omit<User, '_id' | 'joinDate' | 'avatar'>): Promise<User> => {
    await delay(500);
    const newUser: User = {
      _id: generateId(),
      ...userData,
      joinDate: new Date().toISOString(),
      avatar: `https://i.pravatar.cc/150?u=${generateId()}`,
    };
    db.users.push(newUser);
    return newUser;
  },

  updateUser: async (userId: string, updates: Partial<User>): Promise<User> => {
      await delay(500);
      let userToUpdate = db.users.find(u => u._id === userId);
      if (!userToUpdate) throw new Error('User not found');
      
      const originalName = userToUpdate.name;
      const updatedUser = { ...userToUpdate, ...updates };
      db.users = db.users.map(u => u._id === userId ? updatedUser : u);
      
      // If name changed, update it in payments for consistency
      if (updates.name && updates.name !== originalName) {
        db.payments = db.payments.map(p => p.userId === userId ? { ...p, userName: updates.name as string } : p);
      }
      if (updates.avatar) {
        db.payments = db.payments.map(p => p.userId === userId ? { ...p, userAvatar: updates.avatar as string } : p);
      }

      return updatedUser;
  },

  deleteUser: async (userId: string): Promise<void> => {
      await delay(500);
      db.users = db.users.filter(u => u._id !== userId);
      // Also delete related payments
      db.payments = db.payments.filter(p => p.userId !== userId);
  },

  getDashboardStats: async (userId: string, role: UserRole) => {
    await delay(400);
    if (role === UserRole.ADMIN) {
      return {
        totalMembers: db.users.filter(u => u.role === UserRole.MEMBER).length,
        totalRevenue: db.payments.filter(p => p.status === PaymentStatus.PAID).reduce((sum, p) => sum + p.amount, 0),
        pendingVerifications: db.payments.filter(p => p.status === PaymentStatus.PENDING && p.proofDocument).length,
        upcomingEvents: db.events.length,
      };
    } else {
      const userPayments = db.payments.filter(p => p.userId === userId);
      return {
        pendingPayments: userPayments.filter(p => p.status === PaymentStatus.PENDING || p.status === PaymentStatus.OVERDUE).length,
        totalPaid: userPayments.filter(p => p.status === PaymentStatus.PAID).reduce((sum, p) => sum + p.amount, 0),
        upcomingEvents: db.events.length,
      };
    }
  },

  getRecentPayments: async (): Promise<Payment[]> => {
      await delay(300);
      return [...db.payments]
          .filter(p => p.status === PaymentStatus.PAID)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
  },
  
  getUpcomingEvents: async (): Promise<Event[]> => {
    await delay(300);
    return [...db.events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },
  
  getPaymentsForUser: async (userId: string): Promise<Payment[]> => {
      await delay(500);
      return [...db.payments]
          .filter(p => p.userId === userId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  
  submitPaymentProof: async (paymentId: string, proofUrl: string): Promise<Payment> => {
      await delay(800);
      const payment = db.payments.find(p => p._id === paymentId);
      if (!payment) throw new Error('Payment not found');
      payment.proofDocument = proofUrl;
      return { ...payment };
  },
  
  getPendingPayments: async (): Promise<Payment[]> => {
      await delay(500);
      return db.payments.filter(p => p.status === PaymentStatus.PENDING && !!p.proofDocument);
  },
  
  verifyPayment: async (paymentId: string, newStatus: PaymentStatus, adminNotes: string, verifiedBy: string): Promise<Payment> => {
      await delay(600);
      const payment = db.payments.find(p => p._id === paymentId);
      if (!payment) throw new Error('Payment not found');
      payment.status = newStatus;
      payment.adminNotes = adminNotes;
      payment.verifiedBy = verifiedBy;
      return { ...payment };
  },

  createPaymentRequest: async (req: { userId: string, type: string, amount: number, dueDate: string }): Promise<Payment> => {
      await delay(500);
      const user = db.users.find(u => u._id === req.userId);
      if (!user) throw new Error('User not found');
      const newPayment: TPayment = {
        _id: generateId(),
        userId: user._id,
        userName: user.name,
        userAvatar: user.avatar,
        type: req.type,
        amount: req.amount,
        status: PaymentStatus.PENDING,
        date: new Date().toISOString(),
        dueDate: new Date(req.dueDate).toISOString(),
        paymentMethod: 'UPI', // Default
      };
      db.payments.unshift(newPayment);
      return newPayment;
  },

  createBulkPaymentRequest: async (req: { userIds: string[], type: string, amount: number, dueDate: string }): Promise<void> => {
      await delay(1000);
      const users = db.users.filter(u => req.userIds.includes(u._id));
      const newPayments: TPayment[] = users.map(user => ({
         _id: generateId(),
        userId: user._id,
        userName: user.name,
        userAvatar: user.avatar,
        type: req.type,
        amount: req.amount,
        status: PaymentStatus.PENDING,
        date: new Date().toISOString(),
        dueDate: new Date(req.dueDate).toISOString(),
        paymentMethod: 'UPI', // Default
      }));
      db.payments.unshift(...newPayments);
  },

  addEvent: async (eventData: Omit<Event, '_id'>): Promise<Event> => {
      await delay(500);
      const newEvent: Event = {
          _id: generateId(),
          ...eventData,
      };
      db.events.push(newEvent);
      return newEvent;
  },
  
  getPaymentQRCode: async (): Promise<string> => {
      await delay(100);
      return db.paymentQRCodeUrl;
  },

  setPaymentQRCode: async (newUrl: string): Promise<void> => {
      await delay(400);
      db.paymentQRCodeUrl = newUrl;
  },
  
  addExpense: async (expenseData: Omit<Expense, '_id'>): Promise<Expense> => {
      await delay(500);
      const newExpense: Expense = {
          _id: generateId(),
          ...expenseData,
      };
      db.expenses.push(newExpense);
      return newExpense;
  },

  getAllExpenses: async (): Promise<Expense[]> => {
      await delay(300);
      return [...db.expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  
  getAllPayments: async (): Promise<Payment[]> => {
      await delay(500);
      return [...db.payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  
  getEventPaymentStatus: async (eventId: string): Promise<any[]> => {
      await delay(700);
      const eventPayments = db.payments.filter(p => p.eventId === eventId);
      const members = db.users.filter(u => u.role === UserRole.MEMBER && u.status === UserStatus.ACTIVE);
      
      return members.map(member => {
          const payment = eventPayments.find(p => p.userId === member._id);
          const status: PaymentStatus | 'Not Paid' = payment ? payment.status : 'Not Paid';
          return {
              memberId: member._id,
              memberName: member.name,
              status: status,
          };
      });
  },
  
  notifyUnpaidMembersForEvent: async (eventId: string): Promise<void> => {
      await delay(1000);
      console.log(`Simulating sending notifications for event ${eventId}`);
      // In a real app, this would trigger an email or push notification service.
      return;
  },

  getFinancialSummary: async () => {
    await delay(400);
    const totalRevenue = db.payments
        .filter(p => p.status === PaymentStatus.PAID)
        .reduce((sum, p) => sum + p.amount, 0);
    const totalExpenses = db.expenses.reduce((sum, e) => sum + e.amount, 0);
    return {
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
    };
  },
  
  sendEmailNotification: async (payload: { userId: string, subject: string, message: string }): Promise<void> => {
    await delay(1000);
    const user = db.users.find(u => u._id === payload.userId);
    if (!user) throw new Error("User not found to send email to.");
    console.log(`
      ========================================
      == SIMULATING EMAIL NOTIFICATION ==
      ========================================
      TO: ${user.name} <${user.email}>
      SUBJECT: ${payload.subject}
      ----------------------------------------
      MESSAGE:
      ${payload.message}
      ========================================
    `);
  },
};