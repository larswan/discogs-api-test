import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import AlbumDisplay from "./AlbumDisplay";

function App() {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  return (
    <div className="app">
      <SearchBar
        setSearchResults={setSearchResults}
        setShowSearchResults={setShowSearchResults}
        showSearchResults={showSearchResults}
      />

      {showSearchResults && searchResults.length > 0 && (
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
                <h3>{result.title}</h3>
                <p>{result.artists?.[0]?.name || "Unknown Artist"}</p>
                <p>{result.year}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAlbum && (
        <AlbumDisplay
          album={selectedAlbum}
          onBack={() => {
            setSelectedAlbum(null);
            setShowSearchResults(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
