# 🎵 **Music Preview API Research**

## **Available APIs for Music Previews:**

1. **Spotify Web Playback SDK** - Requires Spotify Premium, limited to 30-second previews
2. **Apple Music API** - Requires Apple Music subscription, 30-second previews
3. **YouTube Music API** - Unofficial, requires scraping
4. **SoundCloud API** - Free tier available, full tracks
5. **Discogs** - No audio previews, but has track listings

### **Best Options:**

- **Spotify** - Most comprehensive, good documentation
- **Apple Music** - Good integration, but requires subscription
- **SoundCloud** - Free tier, but less comprehensive catalog

## **What We Need from Discogs**

### **Current Discogs Data Available:**

- ✅ Track titles
- ✅ Artist names
- ✅ Album titles
- ✅ Track durations
- ❌ **ISRC codes** (not available in Discogs API)
- ❌ **UPC/EAN codes** (not available in track data)

### **Discogs Track Structure:**

```json
{
  "position": "A1",
  "title": "Window Seat",
  "duration": "4:50",
  "extraartists": [...]
}
```

## **Implementation Strategy**

### **Option 1: Text-Based Search (Recommended)**

Use track title + artist name to search Deezer API:

```javascript
// Search query format
const searchQuery = `${trackTitle} ${artistName}`;
const deezerUrl = `https://api.deezer.com/search?q=${encodeURIComponent(
  searchQuery
)}`;
```

**Pros:**

- ✅ No additional IDs needed
- ✅ Works with current Discogs data
- ✅ Simple implementation
- ✅ High success rate for popular tracks

**Cons:**

- ⚠️ May not find exact matches for obscure tracks
- ⚠️ Could return wrong versions/remixes

### **Option 2: Album-Based Search**

Search for entire album on Deezer and match tracks:

```javascript
// Search for album first
const albumQuery = `${albumTitle} ${artistName}`;
// Then match individual tracks by title
```

**Pros:**

- ✅ Better accuracy for track matching
- ✅ Reduces false positives

**Cons:**

- ⚠️ More complex implementation
- ⚠️ Requires multiple API calls

## **Technical Implementation Plan**

### **1. Create Deezer Search Function**

```javascript
async function searchDeezerPreview(trackTitle, artistName) {
  const query = `${trackTitle} ${artistName}`;
  const response = await fetch(
    `https://api.deezer.com/search?q=${encodeURIComponent(query)}`
  );
  const data = await response.json();

  // Find best match
  const bestMatch = data.data[0];
  return bestMatch?.preview || null;
}
```

### **2. Add Preview Button to Track Display**

```jsx
<TrackDisplay>
  {track.preview && (
    <button onClick={() => playPreview(track.preview)}>▶️ Preview</button>
  )}
</TrackDisplay>
```

### **3. Audio Player Component**

```jsx
const AudioPlayer = ({ previewUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef();

  const playPreview = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  return (
    <audio
      ref={audioRef}
      src={previewUrl}
      onEnded={() => setIsPlaying(false)}
    />
  );
};
```

## **Sample API Responses Saved**

1. **`deezer-search-response.json`** - Deezer search for "erykah badu window seat"
2. **`release-response.json`** - Discogs release data (no ISRC codes)
3. **`album-response.json`** - Discogs master album data

## **Next Steps**

1. ✅ **Research complete** - Deezer API is the best option
2. 🔄 **Implement Deezer search function**
3. 🔄 **Add preview buttons to track display**
4. 🔄 **Create audio player component**
5. 🔄 **Add error handling for missing previews**
6. 🔄 **Test with various track types**

## **Fallback Strategy**

If Deezer doesn't have a preview:

1. Try alternative search terms (remove featuring artists, etc.)
2. Show "Preview not available" message
3. Consider adding links to YouTube Music/Spotify (external)

## **Rate Limiting Considerations**

- Deezer API is generous but implement basic rate limiting
- Cache successful searches to reduce API calls
- Add loading states for better UX
