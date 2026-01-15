// Expense Manager - Seed Data
// Default categories and demo expenses for new users

import type { Category, Expense, Budget } from '$lib/types';

// ============================================
// Default Categories
// ============================================

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat_groceries',
    userId: null, // System category
    name: 'Groceries',
    icon: '🛒',
    color: '#10B981',
    createdAt: '2024-01-01T00:00:00.000Z',
    budget: 400,
    budgetPeriod: 'monthly'
  },
  {
    id: 'cat_food',
    userId: null,
    name: 'Food & Dining',
    icon: '🍔',
    color: '#F97316',
    createdAt: '2024-01-01T00:00:00.000Z',
    budget: 300,
    budgetPeriod: 'monthly'
  },
  {
    id: 'cat_travel',
    userId: null,
    name: 'Travel',
    icon: '✈️',
    color: '#06B6D4',
    createdAt: '2024-01-01T00:00:00.000Z',
    budget: 250,
    budgetPeriod: 'monthly'
  },
  {
    id: 'cat_shopping',
    userId: null,
    name: 'Shopping',
    icon: '🛍️',
    color: '#EC4899',
    createdAt: '2024-01-01T00:00:00.000Z',
    budget: 200,
    budgetPeriod: 'monthly'
  },
  {
    id: 'cat_entertainment',
    userId: null,
    name: 'Entertainment',
    icon: '🎬',
    color: '#8B5CF6',
    createdAt: '2024-01-01T00:00:00.000Z',
    budget: 150,
    budgetPeriod: 'monthly'
  },
  {
    id: 'cat_housing',
    userId: null,
    name: 'Housing',
    icon: '🏠',
    color: '#6366F1',
    createdAt: '2024-01-01T00:00:00.000Z',
    budget: 1200,
    budgetPeriod: 'monthly'
  },
  {
    id: 'cat_health',
    userId: null,
    name: 'Health',
    icon: '💊',
    color: '#10B981',
    createdAt: '2024-01-01T00:00:00.000Z',
    budget: 150,
    budgetPeriod: 'monthly'
  },
  {
    id: 'cat_subscriptions',
    userId: null,
    name: 'Subscriptions',
    icon: '📺',
    color: '#A855F7',
    createdAt: '2024-01-01T00:00:00.000Z',
    budget: 50,
    budgetPeriod: 'monthly'
  },
  {
    id: 'cat_other',
    userId: null,
    name: 'Other',
    icon: '📋',
    color: '#64748B',
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

// ============================================
// Demo Expenses (for development/testing)
// ============================================

// Helper to get dates relative to today
function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

export const DEMO_EXPENSES: Expense[] = [
  // Today
  {
    id: 'exp_demo_001',
    userId: 'local',
    amount: 12.50,
    description: 'Coffee & Snacks',
    categoryId: 'cat_food',
    date: daysAgo(0),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    merchant: 'Starbucks',
    paymentMethod: 'card',
    tags: ['coffee', 'work']
  },
  {
    id: 'exp_demo_002',
    userId: 'local',
    amount: 18.75,
    description: 'Uber Ride',
    categoryId: 'cat_travel',
    date: daysAgo(0),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    merchant: 'Uber',
    paymentMethod: 'digital'
  },
  // Yesterday
  {
    id: 'exp_demo_003',
    userId: 'local',
    amount: 15.99,
    description: 'Netflix Subscription',
    categoryId: 'cat_subscriptions',
    date: daysAgo(1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    merchant: 'Netflix',
    paymentMethod: 'card',
    notes: 'Monthly subscription'
  },
  {
    id: 'exp_demo_004',
    userId: 'local',
    amount: 67.30,
    description: 'Grocery Shopping',
    categoryId: 'cat_groceries',
    date: daysAgo(1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    merchant: 'Whole Foods',
    paymentMethod: 'card',
    tags: ['groceries', 'weekly']
  },
  // 2 days ago
  {
    id: 'exp_demo_005',
    userId: 'local',
    amount: 124.00,
    description: 'Electric Bill',
    categoryId: 'cat_housing',
    date: daysAgo(2),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paymentMethod: 'bank',
    notes: 'January electric bill'
  },
  {
    id: 'exp_demo_006',
    userId: 'local',
    amount: 49.99,
    description: 'Gym Membership',
    categoryId: 'cat_health',
    date: daysAgo(2),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    merchant: 'Planet Fitness',
    paymentMethod: 'card'
  },
  // 3 days ago
  {
    id: 'exp_demo_007',
    userId: 'local',
    amount: 24.99,
    description: 'Book Purchase',
    categoryId: 'cat_other',
    date: daysAgo(3),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    merchant: 'Amazon',
    paymentMethod: 'digital',
    tags: ['books', 'learning']
  },
  {
    id: 'exp_demo_008',
    userId: 'local',
    amount: 35.00,
    description: 'Gas Station',
    categoryId: 'cat_travel',
    date: daysAgo(3),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    merchant: 'Shell',
    paymentMethod: 'card'
  },
  // 4 days ago
  {
    id: 'exp_demo_009',
    userId: 'local',
    amount: 85.50,
    description: 'Restaurant Dinner',
    categoryId: 'cat_food',
    date: daysAgo(4),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    merchant: 'Olive Garden',
    paymentMethod: 'card',
    notes: 'Dinner with friends',
    tags: ['dining', 'social']
  },
  {
    id: 'exp_demo_010',
    userId: 'local',
    amount: 45.00,
    description: 'Movie Theater',
    categoryId: 'cat_entertainment',
    date: daysAgo(4),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    merchant: 'AMC Theaters',
    paymentMethod: 'card',
    notes: 'Tickets + popcorn'
  },
  // 5 days ago
  {
    id: 'exp_demo_011',
    userId: 'local',
    amount: 89.99,
    description: 'New Shoes',
    categoryId: 'cat_shopping',
    date: daysAgo(5),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    merchant: 'Nike Store',
    paymentMethod: 'card'
  },
  // 6 days ago
  {
    id: 'exp_demo_012',
    userId: 'local',
    amount: 22.50,
    description: 'Lunch',
    categoryId: 'cat_food',
    date: daysAgo(6),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    merchant: 'Chipotle',
    paymentMethod: 'card'
  },
  {
    id: 'exp_demo_013',
    userId: 'local',
    amount: 9.99,
    description: 'Spotify Subscription',
    categoryId: 'cat_subscriptions',
    date: daysAgo(6),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    merchant: 'Spotify',
    paymentMethod: 'card'
  },
  // Last week
  {
    id: 'exp_demo_014',
    userId: 'local',
    amount: 150.00,
    description: 'Internet Bill',
    categoryId: 'cat_housing',
    date: daysAgo(10),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paymentMethod: 'bank'
  },
  {
    id: 'exp_demo_015',
    userId: 'local',
    amount: 75.00,
    description: 'Haircut',
    categoryId: 'cat_health',
    date: daysAgo(12),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paymentMethod: 'card'
  },
  // Two weeks ago
  {
    id: 'exp_demo_016',
    userId: 'local',
    amount: 200.00,
    description: 'Concert Tickets',
    categoryId: 'cat_entertainment',
    date: daysAgo(14),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paymentMethod: 'digital',
    notes: 'Summer music festival'
  },
  {
    id: 'exp_demo_017',
    userId: 'local',
    amount: 55.00,
    description: 'Phone Case',
    categoryId: 'cat_shopping',
    date: daysAgo(15),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    merchant: 'Apple Store',
    paymentMethod: 'card'
  },
  // Three weeks ago
  {
    id: 'exp_demo_018',
    userId: 'local',
    amount: 1200.00,
    description: 'Rent',
    categoryId: 'cat_housing',
    date: daysAgo(20),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paymentMethod: 'bank',
    notes: 'January rent'
  },
  {
    id: 'exp_demo_019',
    userId: 'local',
    amount: 40.00,
    description: 'Prescription Medication',
    categoryId: 'cat_health',
    date: daysAgo(22),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    merchant: 'CVS Pharmacy',
    paymentMethod: 'card'
  },
  // Last month
  {
    id: 'exp_demo_020',
    userId: 'local',
    amount: 350.00,
    description: 'Weekend Trip',
    categoryId: 'cat_travel',
    date: daysAgo(28),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: 'Hotel + activities',
    tags: ['vacation', 'weekend']
  },
  // Additional sample expenses for better coverage
  {
    id: 'exp_demo_021',
    userId: 'local',
    amount: 125.50,
    description: 'Weekly Groceries',
    categoryId: 'cat_groceries',
    date: daysAgo(7),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    merchant: 'Trader Joe\'s',
    paymentMethod: 'card',
    tags: ['groceries']
  },
  {
    id: 'exp_demo_022',
    userId: 'local',
    amount: 29.99,
    description: 'Amazon Prime',
    categoryId: 'cat_subscriptions',
    date: daysAgo(8),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    merchant: 'Amazon',
    paymentMethod: 'card',
    notes: 'Annual subscription'
  },
  {
    id: 'exp_demo_023',
    userId: 'local',
    amount: 450.00,
    description: 'Flight Tickets',
    categoryId: 'cat_travel',
    date: daysAgo(25),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    merchant: 'Delta Airlines',
    paymentMethod: 'card',
    tags: ['vacation']
  }
];

// ============================================
// Demo Budgets
// ============================================

export const DEMO_BUDGETS: Budget[] = [
  {
    id: 'bgt_overall',
    userId: 'local',
    categoryId: null, // Overall budget
    amount: 3000,
    period: 'monthly',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    spent: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bgt_groceries',
    userId: 'local',
    categoryId: 'cat_groceries',
    amount: 400,
    period: 'monthly',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    spent: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bgt_food',
    userId: 'local',
    categoryId: 'cat_food',
    amount: 300,
    period: 'monthly',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    spent: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bgt_travel',
    userId: 'local',
    categoryId: 'cat_travel',
    amount: 250,
    period: 'monthly',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    spent: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bgt_entertainment',
    userId: 'local',
    categoryId: 'cat_entertainment',
    amount: 150,
    period: 'monthly',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    spent: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ============================================
// Load Demo Data Function
// ============================================

import { loadFromStorage, saveToStorage } from '$lib/utils/storage';

/**
 * Load demo data into storage (for first-time users or reset)
 */
export function loadDemoData(): void {
  const currentData = loadFromStorage();
  
  saveToStorage({
    ...currentData,
    expenses: DEMO_EXPENSES,
    categories: SEED_CATEGORIES,
    budgets: DEMO_BUDGETS,
    version: 1,
    lastUpdated: new Date().toISOString()
  });
}

/**
 * Check if demo data should be loaded
 */
export function shouldLoadDemoData(): boolean {
  const data = loadFromStorage();
  return data.expenses.length === 0;
}
