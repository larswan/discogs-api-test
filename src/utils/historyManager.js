// History Management Utility
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_HISTORY_ITEMS = 100;

// Generate unique ID for history items
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Cache management
export const cacheManager = {
  // Get cached data
  get: (key) => {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const data = JSON.parse(cached);
      if (Date.now() - data.timestamp > CACHE_DURATION) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return data.data;
    } catch (error) {
      console.error("Error reading from cache:", error);
      return null;
    }
  },

  // Set cached data
  set: (key, data) => {
    try {
      const cacheItem = {
        data,
        timestamp: Date.now(),
        size: JSON.stringify(data).length,
      };

      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));

      // Clean up old cache items if storage is getting full
      cacheManager.cleanup();
    } catch (error) {
      console.error("Error writing to cache:", error);
      // If storage is full, try to clean up and retry
      if (error.name === "QuotaExceededError") {
        cacheManager.cleanup();
        try {
          localStorage.setItem(
            `cache_${key}`,
            JSON.stringify({
              data,
              timestamp: Date.now(),
              size: JSON.stringify(data).length,
            })
          );
        } catch (retryError) {
          console.error("Failed to cache after cleanup:", retryError);
        }
      }
    }
  },

  // Clean up old cache items
  cleanup: () => {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter((key) => key.startsWith("cache_"));

      if (cacheKeys.length === 0) return;

      // Get cache items with their sizes and timestamps
      const cacheItems = cacheKeys
        .map((key) => {
          try {
            const item = JSON.parse(localStorage.getItem(key));
            return {
              key,
              timestamp: item.timestamp,
              size: item.size,
            };
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      // Sort by timestamp (oldest first)
      cacheItems.sort((a, b) => a.timestamp - b.timestamp);

      // Calculate total size
      let totalSize = cacheItems.reduce((sum, item) => sum + item.size, 0);

      // Remove oldest items until we're under the limit
      for (const item of cacheItems) {
        if (totalSize <= MAX_CACHE_SIZE) break;

        localStorage.removeItem(item.key);
        totalSize -= item.size;
      }
    } catch (error) {
      console.error("Error during cache cleanup:", error);
    }
  },

  // Clear all cache
  clear: () => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith("cache_")) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  },
};

// History management
export const historyManager = {
  // Save history to localStorage
  saveHistory: (history) => {
    try {
      localStorage.setItem("app_history", JSON.stringify(history));
    } catch (error) {
      console.error("Error saving history:", error);
    }
  },

  // Load history from localStorage
  loadHistory: () => {
    try {
      const saved = localStorage.getItem("app_history");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error loading history:", error);
      return [];
    }
  },

  // Create history item
  createHistoryItem: (type, name, data, metadata = {}) => {
    return {
      id: generateId(),
      type,
      name,
      timestamp: Date.now(),
      data,
      metadata,
    };
  },

  // Add item to history
  addToHistory: (history, item) => {
    const newHistory = [...history, item];

    // Limit history size
    if (newHistory.length > MAX_HISTORY_ITEMS) {
      newHistory.shift(); // Remove oldest item
    }

    return newHistory;
  },

  // Navigate to specific history index
  navigateToIndex: (history, index) => {
    if (index < 0 || index >= history.length) {
      return { history: [], currentIndex: -1 };
    }

    // Clear forward history
    const newHistory = history.slice(0, index + 1);
    return { history: newHistory, currentIndex: index };
  },

  // Get cache key for item
  getCacheKey: (type, id) => {
    return `${type}_${id}`;
  },
};
