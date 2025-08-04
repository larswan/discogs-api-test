import { useState, useEffect } from "react";

const ContributorDisplay = ({ contributor, onBack, albumName, role }) => {
  const [contributorData, setContributorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [releaseImages, setReleaseImages] = useState({});

  useEffect(() => {
    const fetchContributorData = async () => {
      if (contributor.id) {
        try {
          setLoading(true);
          const response = await fetch(
            `https://api.discogs.com/artists/${contributor.id}/releases?sort=year&sort_order=desc&per_page=50`
          );
          const data = await response.json();
          setContributorData(data);

          // Fetch cover images for releases that don't have thumb images
          if (data.releases) {
            const imagePromises = data.releases
              .filter((release) => !release.thumb && release.resource_url)
              .map(async (release) => {
                try {
                  const releaseResponse = await fetch(release.resource_url);
                  const releaseData = await releaseResponse.json();
                  return {
                    id: release.id,
                    image: releaseData.images?.[0]?.uri || null,
                  };
                } catch (error) {
                  console.error(`Error fetching release ${release.id}:`, error);
                  return { id: release.id, image: null };
                }
              });

            const images = await Promise.all(imagePromises);
            const imageMap = {};
            images.forEach((img) => {
              if (img.image) {
                imageMap[img.id] = img.image;
              }
            });
            setReleaseImages(imageMap);
          }
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
          ← Back to "{albumName}"
        </button>
        <div className="contributorInfo">
          <h1>{contributor.name}</h1>
          <p>
            {role} on "{albumName}"
          </p>
          <p>Discography ({contributorData.pagination?.items || 0} releases)</p>
        </div>
      </div>

      <div className="releasesList">
        <h3>Releases</h3>
        <div className="releasesGrid">
          {contributorData.releases?.map((release, index) => (
            <div key={index} className="releaseItem">
              {(release.thumb || releaseImages[release.id]) && (
                <div className="releaseImage">
                  <img
                    src={release.thumb || releaseImages[release.id]}
                    alt={release.title}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
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
