import { useState, useEffect, useMemo, useRef } from "react";
import { cleanRole } from "./utils/roleCleaner";
import { logFetchResponse } from "./utils/responseLogger";

const getCachedReleases = (data) => {
  if (!data) return null;
  if (data.releasesData) return data.releasesData;
  if (data.releases) return data;
  return null;
};

const getCachedArtistDetails = (data) => data?.artistDetails || null;

const getPrimaryImage = (artistDetails, contributor) => {
  const images = artistDetails?.images || [];
  const primaryImage =
    images.find((image) => image.type === "primary") || images[0];

  if (primaryImage?.uri) return primaryImage.uri;
  if (primaryImage?.uri150) return primaryImage.uri150;

  // Fallback to any thumbnail provided with the contributor data
  return contributor?.thumbnail_url || contributor?.thumb || null;
};

const PersonDisplay = ({
  contributor,
  albumName,
  role,
  onReleaseSelect,
  cachedData,
  onDataFetched,
}) => {
  const initialReleases = getCachedReleases(cachedData);
  const initialArtistDetails = getCachedArtistDetails(cachedData);
  const [contributorData, setContributorData] = useState(initialReleases);
  const [artistDetails, setArtistDetails] = useState(initialArtistDetails);
  const [loading, setLoading] = useState(!initialReleases);
  const [sortField, setSortField] = useState("year");
  const [sortDirection, setSortDirection] = useState("desc");
  const contributorId = contributor?.id;
  const lastFetchedIdRef = useRef(null);
  const artistImage = getPrimaryImage(artistDetails, contributor);

  useEffect(() => {
    if (cachedData === null || cachedData === undefined) {
      if (lastFetchedIdRef.current !== contributorId) {
        setContributorData(null);
        setArtistDetails(null);
        setLoading(true);
        lastFetchedIdRef.current = null;
      }
      return;
    }

    const cachedReleases = getCachedReleases(cachedData);
    const cachedProfile = getCachedArtistDetails(cachedData);

    if (cachedReleases) {
      setContributorData(cachedReleases);
      setLoading(false);
    }

    if (cachedProfile) {
      setArtistDetails(cachedProfile);
    }

    if (cachedReleases || cachedProfile) {
      lastFetchedIdRef.current = contributorId;
    }
  }, [cachedData, contributorId]);

  useEffect(() => {
    if (!contributorId) {
      return;
    }

    const hasReleases = Boolean(contributorData?.releases);
    const hasArtistDetails = Boolean(artistDetails);

    if (
      hasReleases &&
      hasArtistDetails &&
      lastFetchedIdRef.current === contributorId
    ) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchContributorData = async () => {
      let releasesData = contributorData;
      let artistData = artistDetails;
      let fetchedNewData = false;

      if (!hasReleases) {
        try {
          setLoading(true);
          const response = await fetch(
            `https://api.discogs.com/artists/${contributorId}/releases?sort=year&sort_order=desc&per_page=50`
          );
          releasesData = await response.json();
          if (!isMounted) return;

          logFetchResponse(
            `/artists/${contributorId}/releases`,
            releasesData,
            "person_page_releases"
          );
          fetchedNewData = true;
        } catch (error) {
          console.error("Error fetching contributor releases:", error);
        } finally {
          if (!releasesData) {
            setLoading(false);
          }
        }
      }

      if (!hasArtistDetails) {
        try {
          const response = await fetch(
            `https://api.discogs.com/artists/${contributorId}`
          );
          artistData = await response.json();
          if (!isMounted) return;

          logFetchResponse(
            `/artists/${contributorId}`,
            artistData,
            "person_page_artist"
          );
          fetchedNewData = true;
        } catch (error) {
          console.error("Error fetching artist details:", error);
        }
      }

      if (!isMounted) {
        return;
      }

      if (releasesData) {
        setContributorData(releasesData);
        setLoading(false);
      }

      if (artistData) {
        setArtistDetails(artistData);
      }

      if (releasesData || artistData) {
        lastFetchedIdRef.current = contributorId;
      }

      if (fetchedNewData && onDataFetched && releasesData) {
        onDataFetched({
          releasesData,
          artistDetails: artistData || null,
        });
      }
    };

    fetchContributorData();

    return () => {
      isMounted = false;
    };
  }, [contributorId, contributorData, artistDetails, onDataFetched]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedReleases = useMemo(() => {
    if (!contributorData?.releases) return [];

    // Filter to only show master releases
    const masterReleases = contributorData.releases.filter(
      (release) => release.type === "master"
    );

    return [...masterReleases].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle year sorting (numeric)
      if (sortField === "year") {
        aValue = aValue || 0;
        bValue = bValue || 0;
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Handle string sorting
      aValue = (aValue || "").toString().toLowerCase();
      bValue = (bValue || "").toString().toLowerCase();

      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [contributorData?.releases, sortField, sortDirection]);

  if (loading) {
    return (
      <div className="personDisplay">
        <div className="loading">Loading person information...</div>
      </div>
    );
  }

  if (!contributorData) {
    return (
      <div className="personDisplay">
        <div className="error">Could not load person information</div>
      </div>
    );
  }

  return (
    <div className="personDisplay">
      <div className="contributorHeader">
        <div className="contributorOverview">
          {artistImage && (
            <div className="contributorImageWrapper">
              <img
                src={artistImage}
                alt={`${contributor?.name || "Artist"} portrait`}
                className="contributorImage"
                loading="lazy"
              />
            </div>
          )}
          <div className="contributorInfo">
            <h1>{contributor?.name || "Unknown Artist"}</h1>
            <p>
              {cleanRole(role)} on "{albumName}"
            </p>
            <p>Discography ({sortedReleases.length} master releases)</p>
          </div>
        </div>
      </div>

      <div className="releasesList">
        <h3>Releases</h3>
        <div className="releasesTable">
          <div className="tableHeader">
            <div
              className="headerCell yearHeader"
              onClick={() => handleSort("year")}
            >
              Year{" "}
              {sortField === "year" && (sortDirection === "asc" ? "↑" : "↓")}
            </div>
            <div
              className="headerCell titleHeader"
              onClick={() => handleSort("title")}
            >
              Title{" "}
              {sortField === "title" && (sortDirection === "asc" ? "↑" : "↓")}
            </div>
            <div
              className="headerCell roleHeader"
              onClick={() => handleSort("role")}
            >
              Role{" "}
              {sortField === "role" && (sortDirection === "asc" ? "↑" : "↓")}
            </div>
          </div>
          <div className="tableBody">
            {sortedReleases?.map((release, index) => (
              <div
                key={index}
                className={`tableRow ${index % 2 === 0 ? "even" : "odd"} ${
                  onReleaseSelect ? "clickable" : ""
                }`}
                onClick={() => onReleaseSelect && onReleaseSelect(release)}
              >
                <div className="tableCell yearCell">
                  {release.year || "Unknown"}
                </div>
                <div className="tableCell titleCell">{release.title}</div>
                <div className="tableCell roleCell">
                  {cleanRole(release.role)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonDisplay;
