/**
 * Safe wrappers for localStorage and sessionStorage to prevent security exceptions (SecurityError)
 * when accessed inside restricted environments like third-party iframe previews (e.g. Google AdSense preview).
 */

export const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn(`[storage] Failed to get item "${key}" from localStorage:`, e);
    }
    return null;
  },

  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn(`[storage] Failed to set item "${key}" in localStorage:`, e);
    }
  },

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`[storage] Failed to remove item "${key}" from localStorage:`, e);
    }
  },

  clear(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch (e) {
      console.warn('[storage] Failed to clear localStorage:', e);
    }
  },

  key(index: number): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.key(index);
      }
    } catch (e) {
      console.warn(`[storage] Failed to get key at index ${index} from localStorage:`, e);
    }
    return null;
  },

  getLength(): number {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.length;
      }
    } catch (e) {
      console.warn('[storage] Failed to get length of localStorage:', e);
    }
    return 0;
  }
};

export const safeSessionStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        return window.sessionStorage.getItem(key);
      }
    } catch (e) {
      console.warn(`[storage] Failed to get item "${key}" from sessionStorage:`, e);
    }
    return null;
  },

  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn(`[storage] Failed to set item "${key}" in sessionStorage:`, e);
    }
  },

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`[storage] Failed to remove item "${key}" from sessionStorage:`, e);
    }
  },

  clear(): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.clear();
      }
    } catch (e) {
      console.warn('[storage] Failed to clear sessionStorage:', e);
    }
  }
};
