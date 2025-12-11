import { useState, useEffect, useMemo } from "react";
import { cleanRole } from "./utils/roleCleaner";
import { logFetchResponse } from "./utils/responseLogger";

const PersonDisplay = ({
  contributor,
  albumName,
  role,
  onReleaseSelect,
  cachedData,
  onDataFetched,
}) => {
  const [contributorData, setContributorData] = useState(cachedData || null);
  const [loading, setLoading] = useState(!cachedData);
  const [sortField, setSortField] = useState("year");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    // If we have cached data, use it
    if (cachedData) {
      setContributorData(cachedData);
      setLoading(false);
      return;
    }

    // Otherwise, fetch the data
    const fetchContributorData = async () => {
      if (contributor.id) {
        try {
          setLoading(true);
          const response = await fetch(
            `https://api.discogs.com/artists/${contributor.id}/releases?sort=year&sort_order=desc&per_page=50`
          );
          const data = await response.json();

          // Log the response for analysis
          logFetchResponse(
            `/artists/${contributor.id}/releases`,
            data,
            "person_page"
          );

          setContributorData(data);
          // Notify parent to cache the fetched data
          if (onDataFetched) {
            onDataFetched(data);
          }
        } catch (error) {
          console.error("Error fetching contributor data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchContributorData();
  }, [contributor, cachedData, onDataFetched]);

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
        <div className="contributorInfo">
          <h1>{contributor.name}</h1>
          <p>
            {cleanRole(role)} on "{albumName}"
          </p>
          <p>Discography ({sortedReleases.length} master releases)</p>
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
