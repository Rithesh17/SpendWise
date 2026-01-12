// Expense Manager - Budgets Store

import { writable, derived, get } from 'svelte/store';
import type { Budget, BudgetProgress, BudgetPeriod } from '$lib/types';
import { loadFromStorage, saveBudgets } from '$lib/utils/storage';
import { 
  generateId, 
  getCurrentTimestamp,
  startOfMonth,
  startOfWeek,
  startOfYear,
  calculateBudgetProgress
} from '$lib/utils';
import { browser } from '$app/environment';
import { expenses } from './expenses';

// ============================================
// Store Creation
// ============================================

function createBudgetsStore() {
  // Initialize from localStorage
  const initialData = browser ? loadFromStorage().budgets : [];
  const { subscribe, set, update } = writable<Budget[]>(initialData);
  
  // Auto-save on changes
  if (browser) {
    subscribe(budgets => {
      saveBudgets(budgets);
    });
  }
  
  return {
    subscribe,
    set,
    update,
    
    /**
     * Initialize store from storage (call on mount)
     */
    init: () => {
      if (browser) {
        const data = loadFromStorage();
        set(data.budgets);
      }
    },
    
    /**
     * Add a new budget
     */
    add: (data: {
      categoryId: string | null;
      amount: number;
      period: BudgetPeriod;
      startDate?: string;
      endDate?: string;
    }, userId: string = 'local'): Budget => {
      const now = getCurrentTimestamp();
      
      // Calculate default start date based on period
      let startDate = data.startDate;
      if (!startDate) {
        switch (data.period) {
          case 'weekly':
            startDate = startOfWeek().toISOString();
            break;
          case 'yearly':
            startDate = startOfYear().toISOString();
            break;
          case 'monthly':
          default:
            startDate = startOfMonth().toISOString();
        }
      }
      
      const budget: Budget = {
        id: generateId('bgt'),
        userId,
        categoryId: data.categoryId,
        amount: data.amount,
        period: data.period,
        startDate,
        endDate: data.endDate,
        spent: 0,
        createdAt: now,
        updatedAt: now
      };
      
      update(budgets => [...budgets, budget]);
      return budget;
    },
    
    /**
     * Update an existing budget
     */
    updateBudget: (id: string, updates: Partial<Budget>): boolean => {
      let found = false;
      update(budgets => {
        return budgets.map(budget => {
          if (budget.id === id) {
            found = true;
            return { 
              ...budget, 
              ...updates, 
              updatedAt: getCurrentTimestamp() 
            };
          }
          return budget;
        });
      });
      return found;
    },
    
    /**
     * Delete a budget
     */
    delete: (id: string): boolean => {
      let found = false;
      update(budgets => {
        return budgets.filter(budget => {
          if (budget.id === id) {
            found = true;
            return false;
          }
          return true;
        });
      });
      return found;
    },
    
    /**
     * Get budget by ID
     */
    getById: (id: string): Budget | undefined => {
      const budgets = get({ subscribe });
      return budgets.find(b => b.id === id);
    },
    
    /**
     * Get budget for a category
     */
    getByCategory: (categoryId: string | null): Budget | undefined => {
      const budgets = get({ subscribe });
      return budgets.find(b => b.categoryId === categoryId);
    },
    
    /**
     * Clear all budgets
     */
    clear: (): void => {
      set([]);
    },
    
    /**
     * Replace all budgets (for import)
     */
    replaceAll: (newBudgets: Budget[]): void => {
      set(newBudgets);
    }
  };
}

// Create the store
export const budgets = createBudgetsStore();

// ============================================
// Derived Stores
// ============================================

// Overall budget (categoryId === null)
export const overallBudget = derived(budgets, $budgets =>
  $budgets.find(b => b.categoryId === null)
);

// Category budgets
export const categoryBudgets = derived(budgets, $budgets =>
  $budgets.filter(b => b.categoryId !== null)
);

// Budget progress with spent calculations
export const budgetProgress = derived(
  [budgets, expenses],
  ([$budgets, $expenses]) => {
    return $budgets.map(budget => {
      // Calculate spent for this budget
      let spent = 0;
      const startDate = new Date(budget.startDate);
      const endDate = budget.endDate ? new Date(budget.endDate) : new Date();
      
      $expenses.forEach(exp => {
        const expDate = new Date(exp.date);
        if (expDate >= startDate && expDate <= endDate) {
          if (budget.categoryId === null || exp.categoryId === budget.categoryId) {
            spent += exp.amount;
          }
        }
      });
      
      return calculateBudgetProgress(budget, spent);
    });
  }
);

// Overall budget progress
export const overallBudgetProgress = derived(budgetProgress, $progress =>
  $progress.find(p => p.budget.categoryId === null)
);

// Category budget progress
export const categoryBudgetProgress = derived(budgetProgress, $progress =>
  $progress.filter(p => p.budget.categoryId !== null)
);

// Budgets at warning level or above
export const budgetAlerts = derived(budgetProgress, $progress =>
  $progress.filter(p => p.status === 'warning' || p.status === 'danger')
);

// Budget count
export const budgetCount = derived(budgets, $budgets =>
  $budgets.length
);

// ============================================
// Actions (for external use)
// ============================================

export const budgetActions = {
  add: budgets.add,
  update: budgets.updateBudget,
  delete: budgets.delete,
  getById: budgets.getById,
  getByCategory: budgets.getByCategory,
  clear: budgets.clear,
  init: budgets.init
};
