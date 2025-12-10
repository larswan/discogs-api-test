/**
 * Utility for checking if an album has a Wikipedia article
 */

/**
 * Check if an album has a Wikipedia article using the Wikipedia REST API
 * This is the faster/forgiving approach
 * @param {string} albumTitle - The album title
 * @param {string} artistName - The artist name
 * @returns {Promise<{hasArticle: boolean, url: string|null, title: string|null}>}
 */
export async function checkWikipediaArticleFast(albumTitle, artistName) {
  try {
    // First try: search with "album" keyword to prioritize album articles
    const searchQuery = `${albumTitle} ${artistName} album`;
    const url = `https://en.wikipedia.org/w/rest.php/v1/search/title?q=${encodeURIComponent(
      searchQuery
    )}&limit=5`;

    const response = await fetch(url);
    if (!response.ok) {
      console.error("Wikipedia API error:", response.status);
      return { hasArticle: false, url: null, title: null };
    }

    const data = await response.json();

    if (data.pages && data.pages.length > 0) {
      // Filter for album articles and exclude song pages
      const albumPage = data.pages.find((page) => {
        const desc = (page.description || "").toLowerCase();
        const title = (page.title || "").toLowerCase();

        // Prioritize pages with "(album)" in title
        if (title.includes("(album)")) {
          return true;
        }

        // Check description for album indicators
        const isAlbumInDesc =
          desc.includes("album by") ||
          desc.includes("studio album") ||
          desc.includes("compilation album") ||
          desc.includes("live album") ||
          desc.includes("ep by") ||
          desc.includes("mixtape by");

        // Exclude song pages explicitly
        const isSong =
          title.includes("(song)") ||
          desc.includes("song by") ||
          desc.includes("single by");

        return isAlbumInDesc && !isSong;
      });

      // Use the filtered album page if found, otherwise use the first result
      const page = albumPage || data.pages[0];

      return {
        hasArticle: true,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.key)}`,
        title: page.title,
        description: page.description || null,
      };
    }

    return { hasArticle: false, url: null, title: null };
  } catch (error) {
    console.error("Error checking Wikipedia:", error);
    return { hasArticle: false, url: null, title: null };
  }
}

/**
 * Check if an album has a Wikipedia article using Wikidata
 * This is the more precise approach but slower
 * @param {string} albumTitle - The album title
 * @param {string} artistName - The artist name
 * @returns {Promise<{hasArticle: boolean, url: string|null, title: string|null}>}
 */
export async function checkWikipediaArticlePrecise(albumTitle, artistName) {
  try {
    // Step 1: Search Wikidata for the item
    const searchQuery = `${albumTitle} ${artistName}`;
    const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(
      searchQuery
    )}&language=en&type=item&format=json&origin=*`;

    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      console.error("Wikidata search API error:", searchResponse.status);
      return { hasArticle: false, url: null, title: null };
    }

    const searchData = await searchResponse.json();

    if (!searchData.search || searchData.search.length === 0) {
      return { hasArticle: false, url: null, title: null };
    }

    // Try the top results to find an album
    for (const item of searchData.search.slice(0, 3)) {
      const entityId = item.id;

      // Step 2: Fetch entity details including sitelinks
      const entityUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&props=sitelinks|claims|labels&format=json&origin=*`;

      const entityResponse = await fetch(entityUrl);
      if (!entityResponse.ok) {
        continue;
      }

      const entityData = await entityResponse.json();
      const entity = entityData.entities[entityId];

      if (!entity) {
        continue;
      }

      // Check if this is an album (P31 = instance of)
      const claims = entity.claims;
      const instanceOfClaims = claims?.P31 || [];

      const isAlbum = instanceOfClaims.some((claim) => {
        const value = claim.mainsnak?.datavalue?.value?.id;
        // Q482994 = album, Q169930 = EP, Q208569 = studio album
        return ["Q482994", "Q169930", "Q208569"].includes(value);
      });

      // Check if it has an English Wikipedia article
      if (entity.sitelinks && entity.sitelinks.enwiki) {
        const enwikiTitle = entity.sitelinks.enwiki.title;
        return {
          hasArticle: true,
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(
            enwikiTitle
          )}`,
          title: enwikiTitle,
          description: item.description || null,
          isAlbum: isAlbum,
        };
      }
    }

    return { hasArticle: false, url: null, title: null };
  } catch (error) {
    console.error("Error checking Wikidata:", error);
    return { hasArticle: false, url: null, title: null };
  }
}

/**
 * Default export uses the fast method
 * @param {string} albumTitle - The album title
 * @param {string} artistName - The artist name
 * @returns {Promise<{hasArticle: boolean, url: string|null, title: string|null}>}
 */
export default async function checkWikipediaArticle(albumTitle, artistName) {
  return checkWikipediaArticleFast(albumTitle, artistName);
}
