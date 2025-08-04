/**
 * Logs fetch responses to localStorage for analysis
 * @param {string} endpoint - The API endpoint that was called
 * @param {Object} response - The response data
 * @param {string} context - Additional context about the request
 */
export const logFetchResponse = (endpoint, response, context = "") => {
  if (typeof window !== "undefined") {
    const logEntry = {
      timestamp: new Date().toISOString(),
      endpoint,
      context,
      response: response,
      // Extract role data if present for easier analysis
      roles: extractRolesFromResponse(response),
    };

    // Store in localStorage
    const existingLogs = JSON.parse(localStorage.getItem("fetchLogs") || "[]");
    existingLogs.push(logEntry);

    // Keep only last 500 entries to prevent localStorage overflow
    if (existingLogs.length > 500) {
      existingLogs.splice(0, existingLogs.length - 500);
    }

    localStorage.setItem("fetchLogs", JSON.stringify(existingLogs));

    // Log to console for immediate feedback
    console.log("Fetch response logged:", {
      endpoint,
      context,
      rolesFound: logEntry.roles.length,
    });
  }
};

/**
 * Extracts all role data from a response for analysis
 * @param {Object} response - The API response
 * @returns {Array} - Array of unique role strings found
 */
const extractRolesFromResponse = (response) => {
  const roles = new Set();

  if (!response) return [];

  // Recursively search for role properties
  const findRoles = (obj, path = "") => {
    if (!obj || typeof obj !== "object") return;

    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (key === "role" && typeof value === "string") {
        roles.add(value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          findRoles(item, `${currentPath}[${index}]`);
        });
      } else if (typeof value === "object") {
        findRoles(value, currentPath);
      }
    }
  };

  findRoles(response);
  return Array.from(roles);
};

/**
 * Gets all logged fetch responses
 * @returns {Array} - Array of logged responses
 */
export const getFetchLogs = () => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("fetchLogs") || "[]");
  }
  return [];
};

/**
 * Gets all logged role data
 * @returns {Array} - Array of logged role entries
 */
export const getRoleLogs = () => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("roleLogs") || "[]");
  }
  return [];
};

/**
 * Clears all logged data
 */
export const clearLogs = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("fetchLogs");
    localStorage.removeItem("roleLogs");
  }
};

/**
 * Exports logged data as JSON file (for download)
 */
export const exportLogs = () => {
  if (typeof window !== "undefined") {
    const fetchLogs = getFetchLogs();
    const roleLogs = getRoleLogs();

    const exportData = {
      timestamp: new Date().toISOString(),
      fetchLogs,
      roleLogs,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `discogs-logs-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
