const ExtraArtistDisplay = ({ artist, onContributorClick, albumName }) => {
  const handleClick = () => {
    console.log("Clicking contributor:", artist);
    if (onContributorClick) {
      onContributorClick({
        contributor: artist,
        albumName: albumName,
        role: artist.role,
      });
    }
  };

  return (
    <li className="extraArtistItem" onClick={handleClick}>
      {artist.name} - {artist.role}
    </li>
  );
};
export default ExtraArtistDisplay;
