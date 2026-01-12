// Expense Manager - LocalStorage Persistence Layer

import type { StorageData, Expense, Category, Budget, UserPreferences } from '$lib/types';
import { STORAGE_KEY, STORAGE_VERSION } from '$lib/types';
import { browser } from '$app/environment';

// ============================================
// Default Data
// ============================================

const DEFAULT_PREFERENCES: UserPreferences = {
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  theme: 'dark',
  language: 'en'
};

const DEFAULT_STORAGE: StorageData = {
  expenses: [],
  categories: [],
  budgets: [],
  preferences: DEFAULT_PREFERENCES,
  version: STORAGE_VERSION,
  lastUpdated: new Date().toISOString()
};

// ============================================
// Storage Operations
// ============================================

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  if (!browser) return false;
  
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Load all data from localStorage
 */
export function loadFromStorage(): StorageData {
  if (!isStorageAvailable()) {
    console.warn('LocalStorage not available, using defaults');
    return { ...DEFAULT_STORAGE };
  }
  
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_STORAGE };
    }
    
    const data = JSON.parse(raw) as StorageData;
    
    // Handle version migrations if needed
    if (data.version < STORAGE_VERSION) {
      return migrateData(data);
    }
    
    return data;
  } catch (error) {
    console.error('Error loading from storage:', error);
    return { ...DEFAULT_STORAGE };
  }
}

/**
 * Save all data to localStorage
 */
export function saveToStorage(data: StorageData): boolean {
  if (!isStorageAvailable()) {
    console.warn('LocalStorage not available, cannot save');
    return false;
  }
  
  try {
    const toSave: StorageData = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    return true;
  } catch (error) {
    console.error('Error saving to storage:', error);
    return false;
  }
}

/**
 * Clear all data from localStorage
 */
export function clearStorage(): boolean {
  if (!isStorageAvailable()) return false;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
}

// ============================================
// Migration Functions
// ============================================

/**
 * Migrate data from older versions
 */
function migrateData(data: StorageData): StorageData {
  let migrated = { ...data };
  
  // Add migration logic for future versions here
  // Example:
  // if (data.version < 2) {
  //   migrated = migrateV1toV2(migrated);
  // }
  
  migrated.version = STORAGE_VERSION;
  saveToStorage(migrated);
  
  return migrated;
}

// ============================================
// Partial Save Operations
// ============================================

/**
 * Save only expenses
 */
export function saveExpenses(expenses: Expense[]): boolean {
  const data = loadFromStorage();
  data.expenses = expenses;
  return saveToStorage(data);
}

/**
 * Save only categories
 */
export function saveCategories(categories: Category[]): boolean {
  const data = loadFromStorage();
  data.categories = categories;
  return saveToStorage(data);
}

/**
 * Save only budgets
 */
export function saveBudgets(budgets: Budget[]): boolean {
  const data = loadFromStorage();
  data.budgets = budgets;
  return saveToStorage(data);
}

/**
 * Save only preferences
 */
export function savePreferences(preferences: UserPreferences): boolean {
  const data = loadFromStorage();
  data.preferences = preferences;
  return saveToStorage(data);
}

// ============================================
// Export / Import
// ============================================

/**
 * Export data as JSON string
 */
export function exportAsJSON(): string {
  const data = loadFromStorage();
  return JSON.stringify(data, null, 2);
}

/**
 * Export data as downloadable file
 */
export function downloadAsJSON(filename: string = 'expense-manager-backup.json'): void {
  if (!browser) return;
  
  const json = exportAsJSON();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export expenses as CSV
 */
export function exportAsCSV(): string {
  const data = loadFromStorage();
  const expenses = data.expenses;
  
  if (expenses.length === 0) {
    return 'No expenses to export';
  }
  
  const headers = [
    'Date',
    'Description',
    'Amount',
    'Category',
    'Payment Method',
    'Merchant',
    'Notes',
    'Tags'
  ];
  
  const rows = expenses.map(exp => {
    const category = data.categories.find(c => c.id === exp.categoryId);
    return [
      exp.date,
      `"${exp.description.replace(/"/g, '""')}"`,
      exp.amount.toFixed(2),
      category?.name || '',
      exp.paymentMethod || '',
      exp.merchant || '',
      `"${(exp.notes || '').replace(/"/g, '""')}"`,
      `"${(exp.tags || []).join(', ')}"`
    ].join(',');
  });
  
  return [headers.join(','), ...rows].join('\n');
}

/**
 * Download expenses as CSV
 */
export function downloadAsCSV(filename: string = 'expenses.csv'): void {
  if (!browser) return;
  
  const csv = exportAsCSV();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import data from JSON string
 */
export function importFromJSON(jsonString: string): { success: boolean; message: string } {
  try {
    const imported = JSON.parse(jsonString) as StorageData;
    
    // Validate structure
    if (!imported.expenses || !imported.categories || !imported.preferences) {
      return { success: false, message: 'Invalid data format' };
    }
    
    // Merge or replace - for now, we replace
    imported.version = STORAGE_VERSION;
    imported.lastUpdated = new Date().toISOString();
    
    const saved = saveToStorage(imported);
    
    if (saved) {
      return { success: true, message: `Imported ${imported.expenses.length} expenses, ${imported.categories.length} categories` };
    } else {
      return { success: false, message: 'Failed to save imported data' };
    }
  } catch (error) {
    return { success: false, message: `Import failed: ${error}` };
  }
}

/**
 * Import from file input
 */
export function importFromFile(file: File): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        resolve(importFromJSON(content));
      } else {
        resolve({ success: false, message: 'Could not read file' });
      }
    };
    
    reader.onerror = () => {
      resolve({ success: false, message: 'Error reading file' });
    };
    
    reader.readAsText(file);
  });
}

// ============================================
// Storage Size
// ============================================

/**
 * Get storage size in bytes
 */
export function getStorageSize(): number {
  if (!isStorageAvailable()) return 0;
  
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? new Blob([data]).size : 0;
}

/**
 * Get formatted storage size
 */
export function getFormattedStorageSize(): string {
  const bytes = getStorageSize();
  
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
