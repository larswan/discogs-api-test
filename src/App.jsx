import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import AlbumDisplay from "./AlbumDisplay";
import PersonDisplay from "./PersonDisplay";
import ThemeToggle from "./ThemeToggle";

function App() {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedContributor, setSelectedContributor] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="app">
      <ThemeToggle />
      <SearchBar
        setSearchResults={setSearchResults}
        setShowSearchResults={setShowSearchResults}
        showSearchResults={showSearchResults}
        setSearchQuery={setSearchQuery}
      />

      {showSearchResults && searchResults.length > 0 && (
        <>
          <div className="searchResultsHeader">
            Showing results for "{searchQuery}"
          </div>
          <div className="searchResults">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="searchResult"
                onClick={() => {
                  setSelectedAlbum(result);
                  setShowSearchResults(false);
                }}
              >
                <img
                  src={result.cover_image}
                  alt={result.title}
                  className="searchResultImage"
                />
                <div className="searchResultInfo">
                  {(() => {
                    const titleParts = result.title.split(" - ");
                    const artistName =
                      titleParts.length > 1 ? titleParts[0] : "Unknown Artist";
                    const albumTitle =
                      titleParts.length > 1
                        ? titleParts.slice(1).join(" - ")
                        : result.title;
                    return (
                      <>
                        <h3>{albumTitle}</h3>
                        <p>{artistName}</p>
                        <p>{result.year}</p>
                      </>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedAlbum && !selectedContributor && (
        <AlbumDisplay
          album={selectedAlbum}
          searchQuery={searchQuery}
          onContributorClick={(contributor) => {
            setSelectedContributor(contributor);
          }}
          onBack={() => {
            setSelectedAlbum(null);
            setShowSearchResults(true);
          }}
        />
      )}

      {selectedContributor && (
        <PersonDisplay
          contributor={selectedContributor.contributor}
          albumName={selectedContributor.albumName}
          role={selectedContributor.role}
          onBack={() => {
            setSelectedContributor(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
