import { useState, useEffect, useRef } from "react";
import Navigation from "./components/Navigation";
import HistoryBar from "./components/HistoryBar";
import ContentContainer from "./components/ContentContainer";
import PasswordProtection from "./components/PasswordProtection";
import { historyManager, cacheManager } from "./utils/historyManager";
import {
  pushHistoryState,
  replaceHistoryState,
  getStateFromHistory,
  parseUrlHash,
} from "./utils/browserHistory";

function App() {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedContributor, setSelectedContributor] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("search");
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [albumDetailsCache, setAlbumDetailsCache] = useState(null);
  const [contributorDataCache, setContributorDataCache] = useState(null);
  const historyRef = useRef(history);
  const currentIndexRef = useRef(currentIndex);

  // Keep refs in sync with state
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const handleReleaseSelectFromPerson = (release) => {
    // Create album data structure for the selected release
    const albumData = {
      id: release.id,
      title: release.title,
      year: release.year || "",
      type: release.type || "release",
      master_id: release.id,
    };

    // Create history item
    const historyItem = historyManager.createHistoryItem(
      "album",
      albumData.title,
      { album: albumData },
      { albumId: albumData.id, masterId: albumData.master_id }
    );

    // Add to history and cache
    const newHistory = historyManager.addToHistory(history, historyItem);
    const newIndex = newHistory.length - 1;

    setHistory(newHistory);
    setCurrentIndex(newIndex);
    setCurrentView("album");
    setSelectedAlbum(albumData);
    setSelectedContributor(null);
    setAlbumDetailsCache(null); // Clear cache, will be populated when AlbumDisplay fetches
    setContributorDataCache(null);

    // Push to browser history (cached data will be added when AlbumDisplay fetches)
    pushHistoryState(
      "album",
      { album: albumData },
      { albumId: albumData.id, masterId: albumData.master_id },
      {}
    );

    // Save to localStorage
    historyManager.saveHistory(newHistory);
  };

  const handleContributorClick = (contributor) => {
    // Create history item
    const historyItem = historyManager.createHistoryItem(
      "person",
      contributor.contributor.name,
      { contributor: contributor },
      {
        contributorId: contributor.contributor.id,
        albumName: contributor.albumName,
        role: contributor.role,
      }
    );

    // Add to history and cache
    const newHistory = historyManager.addToHistory(history, historyItem);
    const newIndex = newHistory.length - 1;

    setHistory(newHistory);
    setCurrentIndex(newIndex);
    setCurrentView("person");
    setSelectedContributor(contributor);
    setContributorDataCache(null); // Clear cache, will be populated when PersonDisplay fetches
    setAlbumDetailsCache(null);

    // Push to browser history (cached data will be added when PersonDisplay fetches)
    pushHistoryState(
      "person",
      { contributor: contributor },
      {
        contributorId: contributor.contributor.id,
        albumName: contributor.albumName,
        role: contributor.role,
      },
      {}
    );

    // Save to localStorage
    historyManager.saveHistory(newHistory);
  };

  const handleAlbumSelect = (album) => {
    // Create history item
    const historyItem = historyManager.createHistoryItem(
      "album",
      album.title,
      { album: album },
      { albumId: album.id, masterId: album.master_id }
    );

    // Add to history and cache
    const newHistory = historyManager.addToHistory(history, historyItem);
    const newIndex = newHistory.length - 1;

    setHistory(newHistory);
    setCurrentIndex(newIndex);
    setCurrentView("album");
    setSelectedAlbum(album);
    setAlbumDetailsCache(null); // Clear cache, will be populated when AlbumDisplay fetches
    setContributorDataCache(null);

    // Push to browser history (cached data will be added when AlbumDisplay fetches)
    pushHistoryState(
      "album",
      { album: album },
      { albumId: album.id, masterId: album.master_id },
      {}
    );

    // Save to localStorage
    historyManager.saveHistory(newHistory);
  };

  const handleBack = () => {
    // Use browser back if available, otherwise fall back to internal history
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to internal history management
      if (currentIndex === 0) {
        // If we're at the search results, clear everything and go back to empty state
        setHistory([]);
        setCurrentIndex(-1);
        setCurrentView("search");
        setSelectedAlbum(null);
        setSelectedContributor(null);
        setSearchResults([]);
        setSearchQuery("");
        setAlbumDetailsCache(null);
        setContributorDataCache(null);

        // Clear from localStorage
        historyManager.saveHistory([]);
        replaceHistoryState("search", {}, {}, {});
      } else if (currentIndex > 0) {
        const newIndex = currentIndex - 1;
        const { history: newHistory, currentIndex: updatedIndex } =
          historyManager.navigateToIndex(history, newIndex);

        setHistory(newHistory);
        setCurrentIndex(updatedIndex);

        // Restore state from history
        const currentItem = newHistory[updatedIndex];
        if (currentItem) {
          restoreStateFromItem(currentItem);
        }

        // Save to localStorage
        historyManager.saveHistory(newHistory);
      }
    }
  };

  const handleBreadcrumbClick = (index) => {
    // Navigate to the selected history index
    const { history: newHistory, currentIndex: updatedIndex } =
      historyManager.navigateToIndex(history, index);

    setHistory(newHistory);
    setCurrentIndex(updatedIndex);

    // Restore state from history
    const currentItem = newHistory[updatedIndex];
    if (currentItem) {
      // Get cached data from browser history if available
      const browserState = getStateFromHistory();
      const cachedData = browserState?.cachedData || {};

      restoreStateFromItem(currentItem, cachedData);

      // Update browser history to match
      if (currentItem.type === "search") {
        replaceHistoryState(
          "search",
          { searchResults: currentItem.data.searchResults || [] },
          { searchQuery: currentItem.metadata.searchQuery || "" },
          {}
        );
      } else if (currentItem.type === "album") {
        replaceHistoryState(
          "album",
          { album: currentItem.data.album },
          {
            albumId: currentItem.metadata.albumId,
            masterId: currentItem.metadata.masterId,
          },
          cachedData
        );
      } else if (currentItem.type === "person") {
        replaceHistoryState(
          "person",
          { contributor: currentItem.data.contributor },
          {
            contributorId: currentItem.metadata.contributorId,
            albumName: currentItem.metadata.albumName,
            role: currentItem.metadata.role,
          },
          cachedData
        );
      }
    }

    // Save to localStorage
    historyManager.saveHistory(newHistory);
  };

  // Helper function to restore state from history item
  const restoreStateFromItem = (item, cachedData = {}) => {
    if (item.type === "search") {
      setCurrentView("search");
      setSelectedAlbum(null);
      setSelectedContributor(null);
      setAlbumDetailsCache(null);
      setContributorDataCache(null);
      if (item.data.searchResults) {
        setSearchResults(item.data.searchResults);
      }
      if (item.metadata.searchQuery) {
        setSearchQuery(item.metadata.searchQuery);
      }
    } else if (item.type === "album") {
      setCurrentView("album");
      setSelectedAlbum(item.data.album);
      setSelectedContributor(null);
      setContributorDataCache(null);
      setAlbumDetailsCache(cachedData.albumDetails || null);
    } else if (item.type === "person") {
      setCurrentView("person");
      setSelectedContributor(item.data.contributor);
      setSelectedAlbum(null);
      setAlbumDetailsCache(null);
      setContributorDataCache(cachedData.contributorData || null);
    }
  };

  const handleSearchComplete = (query, results) => {
    // Create history item for search
    const historyItem = historyManager.createHistoryItem(
      "search",
      `Search: ${query}`,
      { searchResults: results },
      { searchQuery: query }
    );

    // Clear existing history and start fresh with the new search
    const newHistory = [historyItem];
    const newIndex = 0;

    setHistory(newHistory);
    setCurrentIndex(newIndex);
    setCurrentView("search");
    setAlbumDetailsCache(null);
    setContributorDataCache(null);

    // Push to browser history
    pushHistoryState(
      "search",
      { searchResults: results },
      { searchQuery: query },
      {}
    );

    // Save to localStorage
    historyManager.saveHistory(newHistory);
  };

  // Handlers for caching fetched data
  const handleAlbumDetailsFetched = (albumDetails) => {
    setAlbumDetailsCache(albumDetails);
    // Update browser history state with cached data (replace, don't push to avoid breaking forward nav)
    const currentState = getStateFromHistory();
    if (currentState && currentState.type === "album") {
      replaceHistoryState(
        currentState.type,
        currentState.data,
        currentState.metadata,
        { ...currentState.cachedData, albumDetails }
      );
    }
  };

  const handleContributorDataFetched = (contributorData) => {
    setContributorDataCache(contributorData);
    // Update browser history state with cached data (replace, don't push to avoid breaking forward nav)
    const currentState = getStateFromHistory();
    if (currentState && currentState.type === "person") {
      replaceHistoryState(
        currentState.type,
        currentState.data,
        currentState.metadata,
        { ...currentState.cachedData, contributorData }
      );
    }
  };

  // Load history from localStorage on app start
  useEffect(() => {
    const savedHistory = historyManager.loadHistory();
    if (savedHistory.length > 0) {
      setHistory(savedHistory);
      setCurrentIndex(savedHistory.length - 1);

      // Restore the last state
      const lastItem = savedHistory[savedHistory.length - 1];
      restoreStateFromItem(lastItem);

      // Initialize browser history with current state
      if (lastItem.type === "search") {
        replaceHistoryState(
          "search",
          { searchResults: lastItem.data.searchResults || [] },
          { searchQuery: lastItem.metadata.searchQuery || "" },
          {}
        );
      } else if (lastItem.type === "album") {
        replaceHistoryState(
          "album",
          { album: lastItem.data.album },
          {
            albumId: lastItem.metadata.albumId,
            masterId: lastItem.metadata.masterId,
          },
          {}
        );
      } else if (lastItem.type === "person") {
        replaceHistoryState(
          "person",
          { contributor: lastItem.data.contributor },
          {
            contributorId: lastItem.metadata.contributorId,
            albumName: lastItem.metadata.albumName,
            role: lastItem.metadata.role,
          },
          {}
        );
      }
    } else {
      // Initialize with empty search state
      replaceHistoryState("search", {}, {}, {});
    }
  }, []);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state) {
        // Restore state from browser history
        const { type, data, metadata, cachedData } = event.state;

        // Find matching item in internal history or create one
        let matchingItem = null;
        if (type === "search") {
          matchingItem = {
            type: "search",
            data: { searchResults: data.searchResults || [] },
            metadata: { searchQuery: metadata.searchQuery || "" },
          };
        } else if (type === "album") {
          matchingItem = {
            type: "album",
            data: { album: data.album },
            metadata: {
              albumId: metadata.albumId,
              masterId: metadata.masterId,
            },
          };
        } else if (type === "person") {
          matchingItem = {
            type: "person",
            data: { contributor: data.contributor },
            metadata: {
              contributorId: metadata.contributorId,
              albumName: metadata.albumName,
              role: metadata.role,
            },
          };
        }

        if (matchingItem) {
          restoreStateFromItem(matchingItem, cachedData || {});

          // Update internal history to match browser history
          // Find the index in internal history or add it
          const currentHistory = historyRef.current;
          const existingIndex = currentHistory.findIndex(
            (item) =>
              item.type === matchingItem.type &&
              ((item.type === "search" &&
                item.metadata.searchQuery ===
                  matchingItem.metadata.searchQuery) ||
                (item.type === "album" &&
                  item.metadata.albumId === matchingItem.metadata.albumId) ||
                (item.type === "person" &&
                  item.metadata.contributorId ===
                    matchingItem.metadata.contributorId))
          );

          if (existingIndex >= 0) {
            setCurrentIndex(existingIndex);
          }
        }
      } else {
        // No state, go to empty search
        setCurrentView("search");
        setSelectedAlbum(null);
        setSelectedContributor(null);
        setSearchResults([]);
        setSearchQuery("");
        setAlbumDetailsCache(null);
        setContributorDataCache(null);
        setHistory([]);
        setCurrentIndex(-1);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Listen for album selection events from search results
  useEffect(() => {
    const handleAlbumSelectEvent = (event) => {
      handleAlbumSelect(event.detail.album);
    };

    window.addEventListener("selectAlbum", handleAlbumSelectEvent);
    return () =>
      window.removeEventListener("selectAlbum", handleAlbumSelectEvent);
  }, []);

  return (
    <PasswordProtection>
      <div className="app">
        <Navigation
          setSearchResults={setSearchResults}
          setSearchQuery={setSearchQuery}
          onHistoryClick={() => console.log("History clicked")}
          onAccountClick={() => console.log("Account clicked")}
          onSearchComplete={handleSearchComplete}
        />

        <HistoryBar
          history={history}
          onBack={handleBack}
          onBreadcrumbClick={handleBreadcrumbClick}
          currentIndex={currentIndex}
        />

        <ContentContainer
          currentView={currentView}
          searchResults={searchResults}
          selectedAlbum={selectedAlbum}
          selectedContributor={selectedContributor}
          searchQuery={searchQuery}
          onContributorClick={handleContributorClick}
          onReleaseSelectFromPerson={handleReleaseSelectFromPerson}
          albumDetailsCache={albumDetailsCache}
          contributorDataCache={contributorDataCache}
          onAlbumDetailsFetched={handleAlbumDetailsFetched}
          onContributorDataFetched={handleContributorDataFetched}
        />
      </div>
    </PasswordProtection>
  );
}

export default App;
