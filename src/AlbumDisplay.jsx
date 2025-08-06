import { useState, useEffect } from "react";
import TrackDisplay from "./TrackDisplay";
import { queryByMasterId } from "./requestFunctions/queryByMasterId";

const AlbumDisplay = ({ album, onBack, searchQuery, onContributorClick }) => {
  const [albumDetails, setAlbumDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      if (album.master_id) {
        try {
          setLoading(true);
          const details = await queryByMasterId(album.master_id);

          // Try to get cover image from main release if available
          if (details.main_release && !details.images?.[0]?.uri) {
            try {
              const mainReleaseResponse = await fetch(
                `https://api.discogs.com/releases/${details.main_release}`
              );
              const mainReleaseData = await mainReleaseResponse.json();
              if (mainReleaseData.images?.[0]?.uri) {
                details.cover_image = mainReleaseData.images[0].uri;
              }
            } catch (error) {
              console.error(
                "Error fetching main release for cover image:",
                error
              );
            }
          }

          setAlbumDetails(details);
        } catch (error) {
          console.error("Error fetching album details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAlbumDetails();
  }, [album]);

  if (loading) {
    return (
      <div className="albumDisplay">
        <div className="loading">Loading album details...</div>
      </div>
    );
  }

  if (!albumDetails) {
    return (
      <div className="albumDisplay">
        <div className="error">Could not load album details</div>
      </div>
    );
  }

  return (
    <div className="albumDisplay">
      <div className="albumHeader">
        <button className="backButton" onClick={onBack}>
          ← Back to "
          {searchQuery.length > 150
            ? searchQuery.substring(0, 150) + "..."
            : searchQuery}
          "
        </button>
        <div className="albumInfo">
          <img
            src={
              albumDetails.cover_image ||
              albumDetails.images?.[0]?.uri ||
              album.cover_image ||
              ""
            }
            alt={albumDetails.title}
            className="albumCover"
          />
          <div className="albumText">
            <h1>{albumDetails.title}</h1>
            <h2>{albumDetails.artists?.[0]?.name}</h2>
            <p>{albumDetails.year}</p>
          </div>
        </div>
      </div>

      <div className="trackList">
        <h3>Tracks</h3>
        <ol>
          {albumDetails.tracklist?.map((track, index) => (
            <TrackDisplay
              track={{ ...track, index }}
              key={index}
              onContributorClick={onContributorClick}
              albumName={albumDetails.title}
            />
          ))}
        </ol>
      </div>
    </div>
  );
};

export default AlbumDisplay;
