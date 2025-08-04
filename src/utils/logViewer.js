import {
  getFetchLogs,
  getRoleLogs,
  exportLogs,
  clearLogs,
} from "./responseLogger";

/**
 * Utility functions to view and analyze logged data
 * These can be called from the browser console
 */

// Make these available globally for console access
if (typeof window !== "undefined") {
  window.logViewer = {
    // View all role logs
    viewRoleLogs: () => {
      const logs = getRoleLogs();
      console.log("Role Logs:", logs);
      return logs;
    },

    // View all fetch logs
    viewFetchLogs: () => {
      const logs = getFetchLogs();
      console.log("Fetch Logs:", logs);
      return logs;
    },

    // Get unique roles found
    getUniqueRoles: () => {
      const logs = getRoleLogs();
      const uniqueRoles = new Set();

      logs.forEach((log) => {
        uniqueRoles.add(log.original);
        uniqueRoles.add(log.cleaned);
      });

      const sortedRoles = Array.from(uniqueRoles).sort();
      console.log("Unique Roles Found:", sortedRoles);
      return sortedRoles;
    },

    // Get role transformation statistics
    getRoleStats: () => {
      const logs = getRoleLogs();
      const stats = {
        total: logs.length,
        changed: logs.filter((log) => log.changed).length,
        unchanged: logs.filter((log) => !log.changed).length,
        contexts: {},
      };

      logs.forEach((log) => {
        if (!stats.contexts[log.context]) {
          stats.contexts[log.context] = 0;
        }
        stats.contexts[log.context]++;
      });

      console.log("Role Cleaning Statistics:", stats);
      return stats;
    },

    // Export logs to file
    exportLogs: () => {
      exportLogs();
    },

    // Clear all logs
    clearLogs: () => {
      clearLogs();
      console.log("All logs cleared");
    },

    // Analyze role patterns
    analyzeRoles: () => {
      const logs = getRoleLogs();
      const patterns = {};

      logs.forEach((log) => {
        if (log.changed) {
          if (!patterns[log.original]) {
            patterns[log.original] = [];
          }
          patterns[log.original].push(log.cleaned);
        }
      });

      console.log("Role Transformation Patterns:", patterns);
      return patterns;
    },
  };

  console.log("Log viewer utilities available. Use:");
  console.log("- window.logViewer.viewRoleLogs() - View all role logs");
  console.log("- window.logViewer.viewFetchLogs() - View all fetch logs");
  console.log("- window.logViewer.getUniqueRoles() - Get unique roles found");
  console.log(
    "- window.logViewer.getRoleStats() - Get role cleaning statistics"
  );
  console.log(
    "- window.logViewer.analyzeRoles() - Analyze role transformation patterns"
  );
  console.log("- window.logViewer.exportLogs() - Export logs to file");
  console.log("- window.logViewer.clearLogs() - Clear all logs");
}
