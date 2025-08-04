const ExtraArtistDisplay = ({ artist, onContributorClick }) => {
  const handleClick = () => {
    if (onContributorClick) {
      onContributorClick(artist);
    }
  };

  return (
    <li className="extraArtistItem" onClick={handleClick}>
      {artist.name} - {artist.role}
    </li>
  );
};
export default ExtraArtistDisplay;
