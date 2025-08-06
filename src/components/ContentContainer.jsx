import React from "react";
import AlbumDisplay from "../AlbumDisplay";
import PersonDisplay from "../PersonDisplay";

const ContentContainer = ({
  currentView,
  searchResults,
  selectedAlbum,
  selectedContributor,
  searchQuery,
  onContributorClick,
  onReleaseSelectFromPerson,
}) => {
  const renderContent = () => {
    switch (currentView) {
      case "search":
        return (
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
                    // This will be handled by the parent component
                    window.dispatchEvent(
                      new CustomEvent("selectAlbum", {
                        detail: { album: result },
                      })
                    );
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
                        titleParts.length > 1
                          ? titleParts[0]
                          : "Unknown Artist";
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
        );

      case "album":
        return (
          <AlbumDisplay
            album={selectedAlbum}
            searchQuery={searchQuery}
            onContributorClick={onContributorClick}
          />
        );

      case "person":
        return (
          <PersonDisplay
            contributor={selectedContributor.contributor}
            albumName={selectedContributor.albumName}
            role={selectedContributor.role}
            onReleaseSelect={onReleaseSelectFromPerson}
          />
        );

      default:
        return null;
    }
  };

  return <div className="contentContainer">{renderContent()}</div>;
};

export default ContentContainer;
