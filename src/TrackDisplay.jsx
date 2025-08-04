import { useState } from "react";
import ExtraArtistDisplay from "./ExtraArtistDisplay";
import { cleanRole, logRoleData } from "./utils/roleCleaner";

const TrackDisplay = ({ track, onContributorClick, albumName }) => {
  const [showExtraArtists, setShowExtraArtists] = useState(false);

  // Function to categorize artists by their roles
  const categorizeArtists = (artists) => {
    const categories = {
      writing: [],
      production: [],
      instruments: [],
    };

    artists.forEach((artist) => {
      const cleanedRole = cleanRole(artist.role);
      logRoleData(artist.role, cleanedRole, "track_display");

      const role = cleanedRole.toLowerCase();

      // Writing credits
      if (
        role.includes("written") ||
        role.includes("lyrics") ||
        role.includes("arranged") ||
        role.includes("composed") ||
        role.includes("songwriter") ||
        role.includes("music")
      ) {
        categories.writing.push(artist);
      }
      // Production credits
      else if (
        role.includes("produced") ||
        role.includes("engineered") ||
        role.includes("recorded") ||
        role.includes("mixed") ||
        role.includes("mastered") ||
        role.includes("co-producer") ||
        role.includes("producer")
      ) {
        categories.production.push(artist);
      }
      // Instrument credits
      else {
        categories.instruments.push(artist);
      }
    });

    return categories;
  };

  const hasExtraArtists = track.extraartists && track.extraartists.length > 0;
  const categories = hasExtraArtists
    ? categorizeArtists(track.extraartists)
    : null;

  const handleClick = () => {
    if (hasExtraArtists) {
      setShowExtraArtists(!showExtraArtists);
    }
  };

  return (
    <li
      onClick={handleClick}
      className={hasExtraArtists ? "hasExtraArtists" : "noCredits"}
    >
      <div className="trackHeader">
        <span className="trackPosition">{track.index + 1}.</span>

        <div className="trackInfo">
          <span className="trackTitle">{track.title}</span>
        </div>

        {hasExtraArtists ? (
          <div className="trackIcons">
            {categories.writing.length > 0 && (
              <div className="iconGroup">
                <span className="icon">📝</span>
                <span className="count">{categories.writing.length}</span>
              </div>
            )}
            {categories.production.length > 0 && (
              <div className="iconGroup">
                <span className="icon">💿</span>
                <span className="count">{categories.production.length}</span>
              </div>
            )}
            {categories.instruments.length > 0 && (
              <div className="iconGroup">
                <span className="icon">🎸</span>
                <span className="count">{categories.instruments.length}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="trackIcons">
            <span className="noCreditsText">No listed credits</span>
          </div>
        )}

        {hasExtraArtists && (
          <span
            className={`dropdownArrow ${showExtraArtists ? "expanded" : ""}`}
          >
            ▼
          </span>
        )}
      </div>

      {hasExtraArtists && showExtraArtists && (
        <ul className="extraArtistsList">
          {track.extraartists.map((artist, i) => (
            <ExtraArtistDisplay
              artist={artist}
              key={i}
              onContributorClick={onContributorClick}
              albumName={albumName}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TrackDisplay;
