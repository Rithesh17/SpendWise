// Expense Manager - User Preferences Store

import { writable, get } from 'svelte/store';
import type { UserPreferences, DateFormat, Theme } from '$lib/types';
import { loadFromStorage, savePreferences } from '$lib/utils/storage';
import { browser } from '$app/environment';

// ============================================
// Default Preferences
// ============================================

const DEFAULT_PREFERENCES: UserPreferences = {
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  theme: 'dark',
  language: 'en'
};

// ============================================
// Store Creation
// ============================================

function createPreferencesStore() {
  // Initialize from localStorage
  const initialData = browser ? loadFromStorage().preferences : DEFAULT_PREFERENCES;
  const { subscribe, set, update } = writable<UserPreferences>(initialData);
  
  // Auto-save on changes
  if (browser) {
    subscribe(prefs => {
      savePreferences(prefs);
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
        set(data.preferences || DEFAULT_PREFERENCES);
      }
    },
    
    /**
     * Update specific preferences
     */
    updatePrefs: (updates: Partial<UserPreferences>): void => {
      update(prefs => ({ ...prefs, ...updates }));
    },
    
    /**
     * Set currency
     */
    setCurrency: (currency: string): void => {
      update(prefs => ({ ...prefs, currency }));
    },
    
    /**
     * Set date format
     */
    setDateFormat: (dateFormat: DateFormat): void => {
      update(prefs => ({ ...prefs, dateFormat }));
    },
    
    /**
     * Set theme
     */
    setTheme: (theme: Theme): void => {
      update(prefs => ({ ...prefs, theme }));
      
      // Apply theme to document
      if (browser) {
        applyTheme(theme);
      }
    },
    
    /**
     * Set language
     */
    setLanguage: (language: string): void => {
      update(prefs => ({ ...prefs, language }));
    },
    
    /**
     * Reset to defaults
     */
    resetToDefaults: (): void => {
      set(DEFAULT_PREFERENCES);
    },
    
    /**
     * Get current preferences
     */
    getCurrent: (): UserPreferences => {
      return get({ subscribe });
    }
  };
}

// Create the store
export const preferences = createPreferencesStore();

// ============================================
// Theme Application
// ============================================

/**
 * Apply theme to document
 */
function applyTheme(theme: Theme): void {
  if (!browser) return;
  
  const root = document.documentElement;
  
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('light-mode', !prefersDark);
  } else {
    root.classList.toggle('light-mode', theme === 'light');
  }
}

/**
 * Initialize theme on load
 */
export function initializeTheme(): void {
  if (!browser) return;
  
  const prefs = preferences.getCurrent();
  applyTheme(prefs.theme);
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const currentPrefs = preferences.getCurrent();
    if (currentPrefs.theme === 'system') {
      applyTheme('system');
    }
  });
}

// ============================================
// Actions (for external use)
// ============================================

export const preferenceActions = {
  update: preferences.updatePrefs,
  setCurrency: preferences.setCurrency,
  setDateFormat: preferences.setDateFormat,
  setTheme: preferences.setTheme,
  setLanguage: preferences.setLanguage,
  resetToDefaults: preferences.resetToDefaults,
  init: preferences.init,
  initTheme: initializeTheme
};
