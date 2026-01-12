// Expense Manager - Categories Store

import { writable, derived, get } from 'svelte/store';
import type { Category } from '$lib/types';
import { loadFromStorage, saveCategories } from '$lib/utils/storage';
import { generateId, getCurrentTimestamp } from '$lib/utils';
import { browser } from '$app/environment';
import { SEED_CATEGORIES } from './seed-data';

// ============================================
// Store Creation
// ============================================

function createCategoriesStore() {
  // Initialize from localStorage or use seed data
  let initialData: Category[] = [];
  if (browser) {
    const stored = loadFromStorage().categories;
    initialData = stored.length > 0 ? stored : SEED_CATEGORIES;
  }
  
  const { subscribe, set, update } = writable<Category[]>(initialData);
  
  // Auto-save on changes
  if (browser) {
    subscribe(categories => {
      saveCategories(categories);
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
        const categories = data.categories.length > 0 ? data.categories : SEED_CATEGORIES;
        set(categories);
      }
    },
    
    /**
     * Add a new category
     */
    add: (data: Omit<Category, 'id' | 'createdAt'>): Category => {
      const category: Category = {
        id: generateId('cat'),
        userId: data.userId,
        name: data.name.trim(),
        icon: data.icon,
        color: data.color,
        createdAt: getCurrentTimestamp(),
        parentId: data.parentId,
        budget: data.budget,
        budgetPeriod: data.budgetPeriod
      };
      
      update(categories => [...categories, category]);
      return category;
    },
    
    /**
     * Update an existing category
     */
    updateCategory: (id: string, updates: Partial<Category>): boolean => {
      let found = false;
      update(categories => {
        return categories.map(cat => {
          if (cat.id === id) {
            found = true;
            return { ...cat, ...updates };
          }
          return cat;
        });
      });
      return found;
    },
    
    /**
     * Delete a category
     */
    delete: (id: string): boolean => {
      let found = false;
      update(categories => {
        return categories.filter(cat => {
          if (cat.id === id) {
            found = true;
            return false;
          }
          return true;
        });
      });
      return found;
    },
    
    /**
     * Get category by ID
     */
    getById: (id: string): Category | undefined => {
      const categories = get({ subscribe });
      return categories.find(cat => cat.id === id);
    },
    
    /**
     * Get category by name
     */
    getByName: (name: string): Category | undefined => {
      const categories = get({ subscribe });
      return categories.find(cat => 
        cat.name.toLowerCase() === name.toLowerCase()
      );
    },
    
    /**
     * Reset to default categories
     */
    resetToDefaults: (): void => {
      set(SEED_CATEGORIES);
    },
    
    /**
     * Replace all categories (for import)
     */
    replaceAll: (newCategories: Category[]): void => {
      set(newCategories);
    }
  };
}

// Create the store
export const categories = createCategoriesStore();

// ============================================
// Derived Stores
// ============================================

// User categories (non-system)
export const userCategories = derived(categories, $categories =>
  $categories.filter(cat => cat.userId !== null)
);

// System categories
export const systemCategories = derived(categories, $categories =>
  $categories.filter(cat => cat.userId === null)
);

// Categories with budgets
export const categoriesWithBudgets = derived(categories, $categories =>
  $categories.filter(cat => cat.budget !== undefined && cat.budget > 0)
);

// Category count
export const categoryCount = derived(categories, $categories =>
  $categories.length
);

// Category map for quick lookups
export const categoryMap = derived(categories, $categories => {
  const map = new Map<string, Category>();
  $categories.forEach(cat => map.set(cat.id, cat));
  return map;
});

// ============================================
// Actions (for external use)
// ============================================

export const categoryActions = {
  add: categories.add,
  update: categories.updateCategory,
  delete: categories.delete,
  getById: categories.getById,
  getByName: categories.getByName,
  resetToDefaults: categories.resetToDefaults,
  init: categories.init
};
