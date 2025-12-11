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
  albumDetailsCache,
  contributorDataCache,
  onAlbumDetailsFetched,
  onContributorDataFetched,
}) => {
  const renderContent = () => {
    switch (currentView) {
      case "search":
        // Show welcome message when no query is entered
        if (!searchQuery && searchResults.length === 0) {
          return (
            <div className="welcomeMessage">
              <h1>Find Music by Musicians You Love</h1>
              <p className="welcomeDescription">
                Discover and explore music albums from the Discogs database.
                Search for any album to view its details, contributors, and
                related releases.
              </p>
              <div className="welcomeInstructions">
                <h2>How to use:</h2>
                <ol>
                  <li>
                    <strong>Search for albums</strong> using the search bar at
                    the top
                  </li>
                  <li>
                    <strong>Click on any album</strong> to view detailed
                    information including tracks and contributors
                  </li>
                  <li>
                    <strong>Explore contributors</strong> by clicking on
                    musicians, writers, or producers to see their other work
                  </li>
                  <li>
                    <strong>Navigate your history</strong> using the breadcrumb
                    trail at the top to go back to any previous view
                  </li>
                </ol>
              </div>
              <p className="welcomeFooter">
                Start by searching for an album above to begin exploring!
              </p>
            </div>
          );
        }

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
                          <div className="albumTitleRow">
                            <h3>{albumTitle}</h3>
                            {result.wikipedia?.hasArticle && (
                              <a
                                href={result.wikipedia.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="wikipediaIndicator"
                                onClick={(e) => e.stopPropagation()}
                                title={`Wikipedia: ${result.wikipedia.title}`}
                              >
                                ✓
                              </a>
                            )}
                          </div>
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
            cachedDetails={albumDetailsCache}
            onDetailsFetched={onAlbumDetailsFetched}
          />
        );

      case "person":
        return (
          <PersonDisplay
            contributor={selectedContributor.contributor}
            albumName={selectedContributor.albumName}
            role={selectedContributor.role}
            onReleaseSelect={onReleaseSelectFromPerson}
            cachedData={contributorDataCache}
            onDataFetched={onContributorDataFetched}
          />
        );

      default:
        return null;
    }
  };

  return <div className="contentContainer">{renderContent()}</div>;
};

export default ContentContainer;
