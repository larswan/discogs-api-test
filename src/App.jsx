import { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import HistoryBar from "./components/HistoryBar";
import ContentContainer from "./components/ContentContainer";

function App() {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedContributor, setSelectedContributor] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("search");
  const [history, setHistory] = useState([]);

  const handleReleaseSelectFromPerson = (release) => {
    // Create album data structure for the selected release
    // Note: We don't set cover_image here because it will be fetched
    // by the AlbumDisplay component using the master_id
    const albumData = {
      id: release.id,
      title: release.title,
      year: release.year || "",
      type: release.type || "release",
      master_id: release.id, // For master releases, use the id as master_id
    };

    // Add to history
    setHistory((prev) => [
      ...prev,
      { type: "album", title: albumData.title, album: albumData },
    ]);
    setCurrentView("album");
    setSelectedAlbum(albumData);
    setSelectedContributor(null);
  };

  const handleContributorClick = (contributor) => {
    // Add to history
    setHistory((prev) => [
      ...prev,
      {
        type: "person",
        contributor: contributor.contributor,
        albumName: contributor.albumName,
        role: contributor.role,
      },
    ]);
    setCurrentView("person");
    setSelectedContributor(contributor);
  };

  const handleAlbumSelect = (album) => {
    // Add to history
    setHistory((prev) => [
      ...prev,
      { type: "album", title: album.title, album: album },
    ]);
    setCurrentView("album");
    setSelectedAlbum(album);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      const lastItem = newHistory.pop();

      if (lastItem.type === "album") {
        // Going back from album to search or person
        if (newHistory.length === 0) {
          setCurrentView("search");
          setSelectedAlbum(null);
        } else {
          const previousItem = newHistory[newHistory.length - 1];
          if (previousItem.type === "person") {
            setCurrentView("person");
            setSelectedContributor({
              contributor: previousItem.contributor,
              albumName: previousItem.albumName,
              role: previousItem.role,
            });
            setSelectedAlbum(null);
          } else {
            setCurrentView("search");
            setSelectedAlbum(null);
          }
        }
      } else if (lastItem.type === "person") {
        // Going back from person to album
        setCurrentView("album");
        setSelectedContributor(null);
      }

      setHistory(newHistory);
    }
  };

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
    <div className="app">
      <Navigation
        setSearchResults={setSearchResults}
        setSearchQuery={setSearchQuery}
        onHistoryClick={() => console.log("History clicked")}
        onAccountClick={() => console.log("Account clicked")}
      />

      <HistoryBar
        history={history}
        onBack={handleBack}
        currentView={currentView}
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
  );
}

export default App;
