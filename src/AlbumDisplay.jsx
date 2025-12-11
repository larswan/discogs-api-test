import { useState, useEffect, useRef } from "react";
import TrackDisplay from "./TrackDisplay";
import { queryByMasterId } from "./requestFunctions/queryByMasterId";

const AlbumDisplay = ({
  album,
  searchQuery,
  onContributorClick,
  cachedDetails,
  onDetailsFetched,
}) => {
  const [albumDetails, setAlbumDetails] = useState(cachedDetails || null);
  const [loading, setLoading] = useState(!cachedDetails);
  const albumId = album?.master_id || album?.id;
  const lastFetchedIdRef = useRef(null);

  useEffect(() => {
    // If we have cached details for this album, use them immediately
    if (cachedDetails) {
      setAlbumDetails(cachedDetails);
      setLoading(false);
      lastFetchedIdRef.current = albumId;
      return;
    }

    // If we already fetched data for this album ID, don't refetch
    if (lastFetchedIdRef.current === albumId && albumDetails) {
      return;
    }

    // Otherwise, fetch the details
    const fetchAlbumDetails = async () => {
      if (albumId) {
        try {
          setLoading(true);
          const details = await queryByMasterId(albumId);

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
          lastFetchedIdRef.current = albumId;
          // Notify parent to cache the fetched details
          if (onDetailsFetched) {
            onDetailsFetched(details);
          }
        } catch (error) {
          console.error("Error fetching album details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAlbumDetails();
  }, [albumId, cachedDetails, onDetailsFetched]); // Depend on albumId, not whole album object

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
