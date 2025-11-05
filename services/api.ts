
import {
  User,
  UserRole,
  UserStatus,
  Payment,
  PaymentStatus,
  Event,
  Expense,
} from '../types';
import { mockData } from '../data/mockData';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);


// --- LocalStorage Database Implementation ---

const DB_KEYS = {
  USERS: 'clubpro_users',
  PAYMENTS: 'clubpro_payments',
  EVENTS: 'clubpro_events',
  EXPENSES: 'clubpro_expenses',
  QR_CODE: 'clubpro_qr_code',
  PASSWORDS: 'clubpro_passwords',
  RESET_TOKENS: 'clubpro_reset_tokens',
};

// Helper to get data from localStorage
const getData = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

// Helper to set data in localStorage
const setData = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
};

// Initialize the "database" if it doesn't exist
const initializeDatabase = () => {
  if (localStorage.getItem(DB_KEYS.USERS) === null) {
    console.log("Initializing database from mock data...");
    setData(DB_KEYS.USERS, mockData.users);
    setData(DB_KEYS.PAYMENTS, mockData.payments);
    setData(DB_KEYS.EVENTS, mockData.events);
    setData(DB_KEYS.EXPENSES, mockData.expenses);
    setData(DB_KEYS.QR_CODE, mockData.paymentQRCodeUrl);
    
    const initialPasswords: { [userId: string]: string } = {
        'admin1': 'password',
        'member1': 'password',
        'member2': 'password',
        'member3': 'password',
    };
    setData(DB_KEYS.PASSWORDS, initialPasswords);
    setData(DB_KEYS.RESET_TOKENS, {});
  }
};

// Run initialization on script load
initializeDatabase();


// --- Refactored API Service ---

export const api = {
  login: async (email: string, password: string): Promise<User> => {
    await delay(500);
    const users = getData<User[]>(DB_KEYS.USERS, []);
    const passwords = getData<{ [id: string]: string }>(DB_KEYS.PASSWORDS, {});
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && passwords[user._id] === password) {
      return Promise.resolve(user);
    }
    return Promise.reject(new Error('Invalid credentials'));
  },
  
  register: async (data: { name: string, email: string, phone: string, password: string }): Promise<User> => {
      await delay(700);
      const users = getData<User[]>(DB_KEYS.USERS, []);
      if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
          return Promise.reject(new Error("An account with this email already exists."));
      }
      
      const newUser: User = {
          _id: generateId(),
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: UserRole.MEMBER,
          status: UserStatus.ACTIVE,
          avatar: `https://i.pravatar.cc/150?u=${generateId()}`,
          joinDate: new Date().toISOString(),
      };
      
      setData(DB_KEYS.USERS, [newUser, ...users]);
      const passwords = getData<{ [id: string]: string }>(DB_KEYS.PASSWORDS, {});
      passwords[newUser._id] = data.password;
      setData(DB_KEYS.PASSWORDS, passwords);
      
      return Promise.resolve(newUser);
  },

  requestPasswordReset: async (email: string): Promise<string> => {
    await delay(1000);
    const users = getData<User[]>(DB_KEYS.USERS, []);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
        const token = `reset_${generateId()}`;
        const resetTokens = getData<{ [token: string]: string }>(DB_KEYS.RESET_TOKENS, {});
        resetTokens[token] = user._id;
        setData(DB_KEYS.RESET_TOKENS, resetTokens);
        return Promise.resolve(token);
    }
    return Promise.resolve("OK"); 
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
      await delay(1000);
      const resetTokens = getData<{ [token: string]: string }>(DB_KEYS.RESET_TOKENS, {});
      const userId = resetTokens[token];

      if (userId && getData<User[]>(DB_KEYS.USERS, []).some(u => u._id === userId)) {
          const passwords = getData<{ [id: string]: string }>(DB_KEYS.PASSWORDS, {});
          passwords[userId] = newPassword;
          setData(DB_KEYS.PASSWORDS, passwords);
          delete resetTokens[token];
          setData(DB_KEYS.RESET_TOKENS, resetTokens);
          return Promise.resolve();
      }
      return Promise.reject(new Error("Invalid or expired reset token."));
  },

  getAllUsers: async (): Promise<User[]> => {
    await delay(500);
    return Promise.resolve(getData<User[]>(DB_KEYS.USERS, []));
  },

  addUser: async (userData: Omit<User, '_id' | 'avatar' | 'joinDate'>): Promise<User> => {
    await delay(500);
    const newUser: User = {
      _id: generateId(),
      ...userData,
      avatar: `https://i.pravatar.cc/150?u=${generateId()}`,
      joinDate: new Date().toISOString(),
    };
    
    const users = getData<User[]>(DB_KEYS.USERS, []);
    setData(DB_KEYS.USERS, [newUser, ...users]);
    
    const passwords = getData<{ [id: string]: string }>(DB_KEYS.PASSWORDS, {});
    passwords[newUser._id] = 'password';
    setData(DB_KEYS.PASSWORDS, passwords);
    return Promise.resolve(newUser);
  },

  updateUser: async (userId: string, updates: Partial<User>): Promise<User> => {
    await delay(500);
    const users = getData<User[]>(DB_KEYS.USERS, []);
    let updatedUser: User | undefined;
    const updatedUsers = users.map(u => {
      if (u._id === userId) {
        updatedUser = { ...u, ...updates };
        return updatedUser;
      }
      return u;
    });

    if (updatedUser) {
      setData(DB_KEYS.USERS, updatedUsers);
      
      if (updates.name || updates.avatar) {
        const payments = getData<Payment[]>(DB_KEYS.PAYMENTS, []);
        const updatedPayments = payments.map(p => p.userId === userId ? {...p, userName: updatedUser!.name, userAvatar: updatedUser!.avatar} : p);
        setData(DB_KEYS.PAYMENTS, updatedPayments);
      }
      return Promise.resolve(updatedUser);
    }
    return Promise.reject(new Error('User not found'));
  },

  deleteUser: async (userId: string): Promise<void> => {
    await delay(500);
    const users = getData<User[]>(DB_KEYS.USERS, []);
    const userExists = users.some(u => u._id === userId);
    if (userExists) {
        setData(DB_KEYS.USERS, users.filter(u => u._id !== userId));
        const passwords = getData<{ [id: string]: string }>(DB_KEYS.PASSWORDS, {});
        delete passwords[userId];
        setData(DB_KEYS.PASSWORDS, passwords);
        return Promise.resolve();
    }
    return Promise.reject(new Error('User not found'));
  },

  getDashboardStats: async (userId: string, role: UserRole): Promise<any> => {
    await delay(500);
    const users = getData<User[]>(DB_KEYS.USERS, []);
    const payments = getData<Payment[]>(DB_KEYS.PAYMENTS, []);
    const events = getData<Event[]>(DB_KEYS.EVENTS, []);

    if (role === UserRole.ADMIN) {
      const totalRevenue = payments.filter(p => p.status === PaymentStatus.PAID).reduce((sum, p) => sum + p.amount, 0);
      const pendingVerifications = payments.filter(p => p.status === PaymentStatus.PENDING && p.proofDocument).length;
      return {
        totalMembers: users.filter(u => u.role === UserRole.MEMBER).length,
        totalRevenue,
        pendingVerifications,
        upcomingEvents: events.length,
      };
    } else {
      const userPayments = payments.filter(p => p.userId === userId);
      const pendingPayments = userPayments.filter(p => p.status === PaymentStatus.PENDING || p.status === PaymentStatus.OVERDUE).length;
      const totalPaid = userPayments.filter(p => p.status === PaymentStatus.PAID).reduce((sum, p) => sum + p.amount, 0);
      return {
        pendingPayments,
        totalPaid,
        upcomingEvents: events.length,
      };
    }
  },
  
  getPaymentsForUser: async (userId: string): Promise<Payment[]> => {
    await delay(500);
    const payments = getData<Payment[]>(DB_KEYS.PAYMENTS, []);
    return Promise.resolve(payments.filter(p => p.userId === userId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  },

  getAllPayments: async (): Promise<Payment[]> => {
      await delay(500);
      const payments = getData<Payment[]>(DB_KEYS.PAYMENTS, []);
      return Promise.resolve(payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  },

  getRecentPayments: async (): Promise<Payment[]> => {
      await delay(500);
      const payments = getData<Payment[]>(DB_KEYS.PAYMENTS, []);
      return Promise.resolve(
          payments
              .filter(p => p.status === PaymentStatus.PAID)
              .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
      );
  },

  getPendingPayments: async (): Promise<Payment[]> => {
      await delay(500);
      const payments = getData<Payment[]>(DB_KEYS.PAYMENTS, []);
      return Promise.resolve(payments.filter(p => p.status === PaymentStatus.PENDING && p.proofDocument));
  },

  submitPaymentProof: async (paymentId: string, proofDocument: string): Promise<Payment> => {
      await delay(500);
      const payments = getData<Payment[]>(DB_KEYS.PAYMENTS, []);
      let updatedPayment: Payment | undefined;
      const updatedPayments = payments.map(p => {
          if (p._id === paymentId) {
              updatedPayment = { ...p, proofDocument };
              return updatedPayment;
          }
          return p;
      });
      if (updatedPayment) {
        setData(DB_KEYS.PAYMENTS, updatedPayments);
        return Promise.resolve(updatedPayment);
      }
      return Promise.reject(new Error('Payment not found'));
  },

  verifyPayment: async (paymentId: string, status: PaymentStatus, adminNotes: string, verifiedBy: string): Promise<Payment> => {
      await delay(500);
      const payments = getData<Payment[]>(DB_KEYS.PAYMENTS, []);
      let updatedPayment: Payment | undefined;
      const updatedPayments = payments.map(p => {
          if (p._id === paymentId) {
              updatedPayment = { ...p, status, adminNotes, verifiedBy };
              return updatedPayment;
          }
          return p;
      });
      if (updatedPayment) {
        setData(DB_KEYS.PAYMENTS, updatedPayments);
        return Promise.resolve(updatedPayment);
      }
      return Promise.reject(new Error('Payment not found'));
  },
  
  createPaymentRequest: async (data: { userId: string; type: string; amount: number; dueDate: string }): Promise<Payment> => {
      await delay(500);
      const users = getData<User[]>(DB_KEYS.USERS, []);
      const user = users.find(u => u._id === data.userId);
      if (!user) return Promise.reject(new Error('User not found'));

      const newPayment: Payment = {
          _id: generateId(),
          userId: user._id,
          userName: user.name,
          userAvatar: user.avatar,
          type: data.type,
          amount: data.amount,
          status: PaymentStatus.PENDING,
          date: new Date().toISOString(),
          dueDate: new Date(data.dueDate).toISOString(),
          paymentMethod: '',
      };
      
      const payments = getData<Payment[]>(DB_KEYS.PAYMENTS, []);
      setData(DB_KEYS.PAYMENTS, [newPayment, ...payments]);
      return Promise.resolve(newPayment);
  },
  
  createBulkPaymentRequest: async (data: { userIds: string[]; type: string; amount: number; dueDate: string }): Promise<void> => {
      await delay(1000);
      const users = getData<User[]>(DB_KEYS.USERS, []);
      const payments = getData<Payment[]>(DB_KEYS.PAYMENTS, []);
      const newPayments: Payment[] = [];
      for (const userId of data.userIds) {
          const user = users.find(u => u._id === userId);
          if (user) {
              newPayments.push({
                  _id: generateId(),
                  userId: user._id,
                  userName: user.name,
                  userAvatar: user.avatar,
                  type: data.type,
                  amount: data.amount,
                  status: PaymentStatus.PENDING,
                  date: new Date().toISOString(),
                  dueDate: new Date(data.dueDate).toISOString(),
                  paymentMethod: '',
              });
          }
      }
      setData(DB_KEYS.PAYMENTS, [...newPayments, ...payments]);
      return Promise.resolve();
  },

  getUpcomingEvents: async (): Promise<Event[]> => {
      await delay(500);
      const events = getData<Event[]>(DB_KEYS.EVENTS, []);
      return Promise.resolve(events.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  },

  addEvent: async (eventData: Omit<Event, '_id'>): Promise<Event> => {
      await delay(500);
      const newEvent: Event = {
          _id: generateId(),
          ...eventData,
          attendees: [],
      };
      const events = getData<Event[]>(DB_KEYS.EVENTS, []);
      setData(DB_KEYS.EVENTS, [newEvent, ...events]);
      return Promise.resolve(newEvent);
  },

  getEventPaymentStatus: async (eventId: string): Promise<any[]> => {
      await delay(700);
      const events = getData<Event[]>(DB_KEYS.EVENTS, []);
      const users = getData<User[]>(DB_KEYS.USERS, []);
      const payments = getData<Payment[]>(DB_KEYS.PAYMENTS, []);
      const event = events.find(e => e._id === eventId);
      if (!event) return Promise.reject(new Error("Event not found"));
      
      const allMembers = users.filter(u => u.role === UserRole.MEMBER);
      const eventPayments = payments.filter(p => p.eventId === eventId);

      const statuses = allMembers.map(member => {
          const payment = eventPayments.find(p => p.userId === member._id);
          const status = payment ? payment.status : 'Not Paid';
          return {
              memberId: member._id,
              memberName: member.name,
              status: status as PaymentStatus | 'Not Paid',
          }
      });
      return Promise.resolve(statuses);
  },
  
  notifyUnpaidMembersForEvent: async (eventId: string): Promise<void> => {
      await delay(1000);
      // Simulate sending notifications
      console.log(`Simulating sending notifications for event ${eventId}`);
      return Promise.resolve();
  },
  
  sendEmailNotification: async (data: { userId: string, subject: string, message: string}): Promise<void> => {
      await delay(800);
      console.log(`Simulating email to user ${data.userId} with subject "${data.subject}"`);
      return Promise.resolve();
  },

  getAllExpenses: async (): Promise<Expense[]> => {
    await delay(500);
    return Promise.resolve(getData<Expense[]>(DB_KEYS.EXPENSES, []));
  },

  addExpense: async (expenseData: Omit<Expense, '_id'>): Promise<Expense> => {
    await delay(500);
    const newExpense: Expense = {
      _id: generateId(),
      ...expenseData,
    };
    const expenses = getData<Expense[]>(DB_KEYS.EXPENSES, []);
    setData(DB_KEYS.EXPENSES, [newExpense, ...expenses]);
    return Promise.resolve(newExpense);
  },

  getFinancialSummary: async (): Promise<{ totalRevenue: number, totalExpenses: number, netProfit: number }> => {
    await delay(600);
    const payments = getData<Payment[]>(DB_KEYS.PAYMENTS, []);
    const expenses = getData<Expense[]>(DB_KEYS.EXPENSES, []);
    const totalRevenue = payments
      .filter(p => p.status === PaymentStatus.PAID)
      .reduce((sum, p) => sum + p.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    return Promise.resolve({
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
    });
  },

  setPaymentQRCode: async(url: string): Promise<void> => {
    await delay(500);
    setData(DB_KEYS.QR_CODE, url);
    return Promise.resolve();
  },

  getPaymentQRCode: async(): Promise<string> => {
    await delay(300);
    return Promise.resolve(getData<string>(DB_KEYS.QR_CODE, ''));
  },
};
