import { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import HistoryBar from "./components/HistoryBar";
import ContentContainer from "./components/ContentContainer";
import PasswordProtection from "./components/PasswordProtection";
import { historyManager, cacheManager } from "./utils/historyManager";

function App() {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedContributor, setSelectedContributor] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("search");
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

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

    // Save to localStorage
    historyManager.saveHistory(newHistory);
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      // If we're at the search results, clear everything and go back to empty state
      setHistory([]);
      setCurrentIndex(-1);
      setCurrentView("search");
      setSelectedAlbum(null);
      setSelectedContributor(null);
      setSearchResults([]);
      setSearchQuery("");

      // Clear from localStorage
      historyManager.saveHistory([]);
    } else if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const { history: newHistory, currentIndex: updatedIndex } =
        historyManager.navigateToIndex(history, newIndex);

      setHistory(newHistory);
      setCurrentIndex(updatedIndex);

      // Restore state from history
      const currentItem = newHistory[updatedIndex];
      if (currentItem) {
        if (currentItem.type === "search") {
          setCurrentView("search");
          setSelectedAlbum(null);
          setSelectedContributor(null);
          if (currentItem.data.searchResults) {
            setSearchResults(currentItem.data.searchResults);
          }
          if (currentItem.metadata.searchQuery) {
            setSearchQuery(currentItem.metadata.searchQuery);
          }
        } else if (currentItem.type === "album") {
          setCurrentView("album");
          setSelectedAlbum(currentItem.data.album);
          setSelectedContributor(null);
        } else if (currentItem.type === "person") {
          setCurrentView("person");
          setSelectedContributor(currentItem.data.contributor);
          setSelectedAlbum(null);
        }
      }

      // Save to localStorage
      historyManager.saveHistory(newHistory);
    }
  };

  const handleBreadcrumbClick = (index) => {
    const { history: newHistory, currentIndex: updatedIndex } =
      historyManager.navigateToIndex(history, index);

    setHistory(newHistory);
    setCurrentIndex(updatedIndex);

    // Restore state from history
    const currentItem = newHistory[updatedIndex];
    if (currentItem) {
      if (currentItem.type === "search") {
        setCurrentView("search");
        setSelectedAlbum(null);
        setSelectedContributor(null);
        if (currentItem.data.searchResults) {
          setSearchResults(currentItem.data.searchResults);
        }
        if (currentItem.metadata.searchQuery) {
          setSearchQuery(currentItem.metadata.searchQuery);
        }
      } else if (currentItem.type === "album") {
        setCurrentView("album");
        setSelectedAlbum(currentItem.data.album);
        setSelectedContributor(null);
      } else if (currentItem.type === "person") {
        setCurrentView("person");
        setSelectedContributor(currentItem.data.contributor);
        setSelectedAlbum(null);
      }
    }

    // Save to localStorage
    historyManager.saveHistory(newHistory);
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

    // Save to localStorage
    historyManager.saveHistory(newHistory);
  };

  // Load history from localStorage on app start
  useEffect(() => {
    const savedHistory = historyManager.loadHistory();
    if (savedHistory.length > 0) {
      setHistory(savedHistory);
      setCurrentIndex(savedHistory.length - 1);

      // Restore the last state
      const lastItem = savedHistory[savedHistory.length - 1];
      if (lastItem.type === "search") {
        setCurrentView("search");
        if (lastItem.data.searchResults) {
          setSearchResults(lastItem.data.searchResults);
        }
        if (lastItem.metadata.searchQuery) {
          setSearchQuery(lastItem.metadata.searchQuery);
        }
      } else if (lastItem.type === "album") {
        setCurrentView("album");
        setSelectedAlbum(lastItem.data.album);
      } else if (lastItem.type === "person") {
        setCurrentView("person");
        setSelectedContributor(lastItem.data.contributor);
      }
    }
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
        />
      </div>
    </PasswordProtection>
  );
}

export default App;
