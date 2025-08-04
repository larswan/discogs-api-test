/**
 * Cleans role data by removing common suffixes and standardizing format
 * @param {string} role - The raw role string from the API
 * @returns {string} - The cleaned role string
 */
export const cleanRole = (role) => {
  if (!role || typeof role !== "string") {
    return role || "";
  }

  // Convert to title case and trim whitespace
  let cleaned = role.trim();

  // Remove common suffixes
  const suffixesToRemove = [
    " By",
    " Written By",
    " Composed By",
    " Arranged By",
    " Produced By",
    " Mixed By",
    " Mastered By",
    " Recorded By",
    " Engineered By",
    " Performed By",
    " Played By",
    " Featuring",
    " Feat.",
    " Ft.",
    " &",
    " And",
  ];

  suffixesToRemove.forEach((suffix) => {
    if (cleaned.endsWith(suffix)) {
      cleaned = cleaned.slice(0, -suffix.length);
    }
  });

  // Handle special cases
  const roleMappings = {
    "Lyrics By": "Lyrics",
    "Music By": "Music",
    "Vocals By": "Vocals",
    "Guitar By": "Guitar",
    "Bass By": "Bass",
    "Drums By": "Drums",
    "Piano By": "Piano",
    "Keyboards By": "Keyboards",
    "Synthesizer By": "Synthesizer",
    "Saxophone By": "Saxophone",
    "Trumpet By": "Trumpet",
    "Trombone By": "Trombone",
    "Violin By": "Violin",
    "Cello By": "Cello",
    "Flute By": "Flute",
    "Clarinet By": "Clarinet",
    "Harmonica By": "Harmonica",
    "Percussion By": "Percussion",
    "Background Vocals By": "Background Vocals",
    "Backing Vocals By": "Backing Vocals",
    "Lead Vocals By": "Lead Vocals",
    "Co-Producer": "Producer",
    "Executive Producer": "Producer",
    "Associate Producer": "Producer",
    "Assistant Producer": "Producer",
    "Co-Arranger": "Arranger",
    "Assistant Engineer": "Engineer",
    "Recording Engineer": "Engineer",
    "Mixing Engineer": "Engineer",
    "Mastering Engineer": "Engineer",
    Main: "Main Artist",
  };

  // Check for exact matches first
  if (roleMappings[cleaned]) {
    return roleMappings[cleaned];
  }

  // Check for partial matches
  for (const [key, value] of Object.entries(roleMappings)) {
    if (cleaned.includes(key)) {
      return value;
    }
  }

  return cleaned;
};

/**
 * Logs role data for analysis
 * @param {string} originalRole - The original role string
 * @param {string} cleanedRole - The cleaned role string
 * @param {string} context - Where this role was found (e.g., "contributor_page", "search_results")
 */
export const logRoleData = (originalRole, cleanedRole, context = "unknown") => {
  if (typeof window !== "undefined") {
    const logEntry = {
      timestamp: new Date().toISOString(),
      context,
      original: originalRole,
      cleaned: cleanedRole,
      changed: originalRole !== cleanedRole,
    };

    // Store in localStorage for analysis
    const existingLogs = JSON.parse(localStorage.getItem("roleLogs") || "[]");
    existingLogs.push(logEntry);

    // Keep only last 1000 entries to prevent localStorage overflow
    if (existingLogs.length > 1000) {
      existingLogs.splice(0, existingLogs.length - 1000);
    }

    localStorage.setItem("roleLogs", JSON.stringify(existingLogs));

    // Also log to console for immediate feedback
    console.log("Role cleaning:", logEntry);
  }
};
