// Expense Manager - Type Definitions
// All data models and interfaces for the application

// ============================================
// Expense Types
// ============================================

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  description: string;
  categoryId: string;
  date: string; // ISO date string
  createdAt: string;
  updatedAt: string;
  
  // Optional fields
  merchant?: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
  tags?: string[];
  receiptUrl?: string;
  location?: ExpenseLocation;
  
  // Sharing fields
  isShared?: boolean;
  sharedWith?: string[];
  shareable?: boolean;
  shareableId?: string;
  groupId?: string;
  
  // Split fields
  splitType?: SplitType;
  splits?: Record<string, number>;
}

export type PaymentMethod = 'cash' | 'card' | 'digital' | 'bank' | 'other';

export type SplitType = 'equal' | 'custom' | 'percentage' | null;

export interface ExpenseLocation {
  latitude: number;
  longitude: number;
  name?: string;
}

export interface ExpenseFormData {
  amount: string;
  description: string;
  categoryId: string;
  date: string;
  merchant?: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
  tags?: string;
}

// ============================================
// Category Types
// ============================================

export interface Category {
  id: string;
  userId: string | null; // null for system categories
  name: string;
  icon: string;
  color: string;
  createdAt: string;
  
  // Optional fields
  parentId?: string;
  budget?: number;
  budgetPeriod?: BudgetPeriod;
}

export type BudgetPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

// ============================================
// Budget Types
// ============================================

export interface Budget {
  id: string;
  userId: string;
  categoryId: string | null; // null for overall budget
  amount: number;
  period: BudgetPeriod;
  startDate: string;
  endDate?: string;
  spent: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetProgress {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'safe' | 'warning' | 'danger';
}

// ============================================
// User Types
// ============================================

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  createdAt: string;
  lastLoginAt: string;
  
  // Public profile
  publicProfile?: boolean;
  shareableId?: string;
  showEmail?: boolean;
  bio?: string;
}

export interface UserPreferences {
  currency: string;
  dateFormat: DateFormat;
  theme: Theme;
  language: string;
}

export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
export type Theme = 'light' | 'dark' | 'system';

// ============================================
// Group Types
// ============================================

export interface Group {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  
  members: string[];
  memberRoles?: Record<string, GroupRole>;
  
  shareable?: boolean;
  shareableId?: string;
  description?: string;
  defaultSplitType?: SplitType;
}

export type GroupRole = 'admin' | 'member';

// ============================================
// Friend Types
// ============================================

export interface FriendRelationship {
  id: string;
  userId: string;
  friendId: string;
  status: FriendStatus;
  createdAt: string;
  updatedAt: string;
}

export type FriendStatus = 'pending' | 'accepted' | 'blocked';

// ============================================
// Filter & Sort Types
// ============================================

export interface ExpenseFilters {
  search?: string;
  categoryId?: string | 'all';
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  paymentMethod?: PaymentMethod | 'all';
  tags?: string[];
  isShared?: boolean;
  groupId?: string;
}

export type ExpenseSortField = 'date' | 'amount' | 'description' | 'category';
export type SortDirection = 'asc' | 'desc';

export interface ExpenseSort {
  field: ExpenseSortField;
  direction: SortDirection;
}

// ============================================
// Stats & Report Types
// ============================================

export interface ExpenseStats {
  total: number;
  count: number;
  average: number;
  highest: number;
  lowest: number;
}

export interface CategoryStats {
  categoryId: string;
  categoryName: string;
  total: number;
  count: number;
  percentage: number;
  color: string;
}

export interface PeriodStats {
  period: string;
  total: number;
  count: number;
}

// ============================================
// App State Types
// ============================================

export interface AppState {
  isOnline: boolean;
  isLoading: boolean;
  lastSyncAt?: string;
  error?: string;
}

// ============================================
// Storage Types
// ============================================

export interface StorageData {
  expenses: Expense[];
  categories: Category[];
  budgets: Budget[];
  preferences: UserPreferences;
  version: number;
  lastUpdated: string;
}

export const STORAGE_VERSION = 1;
export const STORAGE_KEY = 'expense-manager-data';
