# Wikipedia Article Indicator Feature

## Overview

This feature checks if albums in search results have Wikipedia articles and displays a visual indicator (green checkmark) for albums that do.

## How It Works

### 1. Wikipedia Checking (`src/utils/wikipediaChecker.js`)

Two methods are available for checking Wikipedia articles:

#### Fast Method (Default - Wikipedia REST API)

- Uses Wikipedia's REST API search endpoint
- Searches for: `{album title} {artist name} album`
- Returns up to 5 results and intelligently filters for album articles
- **Smart Disambiguation**: Filters results to prioritize:
  - Pages with "(album)" in the title
  - Pages with album-related descriptions ("album by", "studio album", etc.)
  - Excludes song pages ("(song)", "song by", "single by")
- Example: For "What's Going On", correctly returns the [album article](<https://en.wikipedia.org/wiki/What%27s_Going_On_(album)>) instead of the song
- Endpoint: `https://en.wikipedia.org/w/rest.php/v1/search/title`

#### Precise Method (Wikidata)

- Uses Wikidata API for higher accuracy
- Searches Wikidata for the album entity
- Verifies it's actually an album (checks P31 instance type)
- Confirms English Wikipedia sitelink exists
- More accurate but slower

### 2. Search Flow (`src/components/Navigation.jsx`)

When a user searches:

1. Fetch results from Discogs API
2. Display results immediately (with checking state)
3. Check Wikipedia for each result in parallel
4. Update results with Wikipedia data as checks complete

### 3. Visual Display (`src/components/ContentContainer.jsx`)

- Green circular checkmark (✓) appears next to album titles
- Checkmark is clickable and opens Wikipedia in new tab
- Hover shows tooltip with Wikipedia article title
- Does not interfere with clicking the album card itself

### 4. Styling (`src/index.scss`)

- **Light Mode**: Green checkmark (#28a745)
- **Dark Mode**: Brighter green checkmark (#2ecc71)
- Smooth hover effects with scale transform
- Responsive design maintained

## User Experience

1. User searches for an album (e.g., "Erykah Badu")
2. Results appear immediately from Discogs
3. Green checkmarks appear next to albums with Wikipedia articles
4. Click checkmark → Opens Wikipedia article in new tab
5. Click album card → Opens album details view (normal behavior)

## Performance

- Results show immediately (no blocking)
- Wikipedia checks happen in background
- All checks run in parallel (Promise.all)
- No impact on main search functionality if Wikipedia API fails

## API Usage

### Wikipedia REST API

```
GET https://en.wikipedia.org/w/rest.php/v1/search/title
  ?q={album title} {artist}
  &limit=1
```

### Wikidata API (Optional)

```
GET https://www.wikidata.org/w/api.php
  ?action=wbsearchentities
  &search={album title}
  &language=en
  &type=item
  &format=json
```

## Configuration

To switch to the more precise Wikidata method, update `src/components/Navigation.jsx`:

```javascript
import { checkWikipediaArticlePrecise } from "../utils/wikipediaChecker";
// Then replace checkWikipediaArticle with checkWikipediaArticlePrecise
```

## Troubleshooting

### Disambiguation Issues

Some albums and songs share the same name (e.g., "What's Going On" is both an album and a song by Marvin Gaye). The Wikipedia checker handles this by:

1. Adding "album" to the search query
2. Fetching multiple results (up to 5)
3. Filtering for pages with:
   - "(album)" in the title
   - Album-related descriptions
4. Excluding pages with:
   - "(song)" in the title
   - Song-related descriptions

If you find disambiguation is still returning the wrong article, consider switching to the Wikidata method for better accuracy.

## Future Enhancements

Potential improvements:

- Cache Wikipedia results in localStorage
- Add rate limiting for Wikipedia API calls
- Show loading spinner on individual cards while checking
- Add filter to show only albums with Wikipedia articles
- Display snippet from Wikipedia article on hover
- Handle more disambiguation cases (remixes, deluxe editions, etc.)
