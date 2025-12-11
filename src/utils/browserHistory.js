// Browser History Management Utility
// Handles integration with browser History API for back/forward navigation

/**
 * Generate URL hash from state type and metadata
 * @param {string} type - State type: 'search', 'album', 'person'
 * @param {object} metadata - Metadata object with IDs/queries
 * @returns {string} URL hash (e.g., '#/search?q=beatles', '#/album/123')
 */
export const generateUrlHash = (type, metadata = {}) => {
  switch (type) {
    case "search":
      const query = metadata.searchQuery || "";
      return query ? `#/search?q=${encodeURIComponent(query)}` : "#/";
    case "album":
      const albumId = metadata.albumId || metadata.masterId || "";
      return albumId ? `#/album/${albumId}` : "#/";
    case "person":
      const contributorId = metadata.contributorId || "";
      return contributorId ? `#/person/${contributorId}` : "#/";
    default:
      return "#/";
  }
};

/**
 * Parse URL hash to extract type and metadata
 * @returns {object|null} Object with type and metadata, or null if invalid
 */
export const parseUrlHash = () => {
  const hash = window.location.hash;
  if (!hash || hash === "#" || hash === "#/") {
    return { type: "search", metadata: {} };
  }

  // Parse search: #/search?q=query
  const searchMatch = hash.match(/^#\/search\?q=(.+)$/);
  if (searchMatch) {
    return {
      type: "search",
      metadata: { searchQuery: decodeURIComponent(searchMatch[1]) },
    };
  }

  // Parse album: #/album/123
  const albumMatch = hash.match(/^#\/album\/(.+)$/);
  if (albumMatch) {
    return {
      type: "album",
      metadata: { albumId: albumMatch[1], masterId: albumMatch[1] },
    };
  }

  // Parse person: #/person/456
  const personMatch = hash.match(/^#\/person\/(.+)$/);
  if (personMatch) {
    return {
      type: "person",
      metadata: { contributorId: personMatch[1] },
    };
  }

  return null;
};

/**
 * Push new state to browser history
 * @param {string} type - State type
 * @param {object} data - State data
 * @param {object} metadata - Metadata
 * @param {object} cachedData - Cached fetched data (albumDetails, contributorData, etc.)
 */
export const pushHistoryState = (type, data, metadata = {}, cachedData = {}) => {
  const urlHash = generateUrlHash(type, metadata);
  const state = {
    type,
    data,
    metadata,
    cachedData,
    timestamp: Date.now(),
  };

  window.history.pushState(state, "", urlHash);
};

/**
 * Replace current state in browser history
 * @param {string} type - State type
 * @param {object} data - State data
 * @param {object} metadata - Metadata
 * @param {object} cachedData - Cached fetched data
 */
export const replaceHistoryState = (
  type,
  data,
  metadata = {},
  cachedData = {}
) => {
  const urlHash = generateUrlHash(type, metadata);
  const state = {
    type,
    data,
    metadata,
    cachedData,
    timestamp: Date.now(),
  };

  window.history.replaceState(state, "", urlHash);
};

/**
 * Get state from current browser history state
 * @returns {object|null} Current state or null
 */
export const getStateFromHistory = () => {
  return window.history.state;
};
