import { useState, useEffect } from "react";

const ContributorDisplay = ({ contributor, onBack }) => {
  const [contributorData, setContributorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributorData = async () => {
      if (contributor.id) {
        try {
          setLoading(true);
          // This would be the actual API call to get contributor's discography
          // For now, we'll use the sample data structure
          const response = await fetch(
            `https://api.discogs.com/artists/${contributor.id}/releases?sort=year&sort_order=desc&per_page=50`
          );
          const data = await response.json();
          setContributorData(data);
        } catch (error) {
          console.error("Error fetching contributor data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchContributorData();
  }, [contributor]);

  if (loading) {
    return (
      <div className="contributorDisplay">
        <div className="loading">Loading contributor information...</div>
      </div>
    );
  }

  if (!contributorData) {
    return (
      <div className="contributorDisplay">
        <div className="error">Could not load contributor information</div>
      </div>
    );
  }

  return (
    <div className="contributorDisplay">
      <div className="contributorHeader">
        <button className="backButton" onClick={onBack}>
          ← Back to Album
        </button>
        <div className="contributorInfo">
          <h1>{contributor.name}</h1>
          <p>Discography ({contributorData.pagination?.items || 0} releases)</p>
        </div>
      </div>

      <div className="releasesList">
        <h3>Releases</h3>
        <div className="releasesGrid">
          {contributorData.releases?.map((release, index) => (
            <div key={index} className="releaseItem">
              <div className="releaseInfo">
                <h4>{release.title}</h4>
                <p className="releaseArtist">{release.artist}</p>
                <p className="releaseYear">{release.year}</p>
                <p className="releaseRole">{release.role}</p>
                {release.format && (
                  <p className="releaseFormat">{release.format}</p>
                )}
                {release.label && (
                  <p className="releaseLabel">{release.label}</p>
                )}
              </div>
              {release.stats && (
                <div className="releaseStats">
                  <span>Want: {release.stats.community.in_wantlist}</span>
                  <span>Have: {release.stats.community.in_collection}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContributorDisplay;
