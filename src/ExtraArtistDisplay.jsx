const ExtraArtistDisplay = ({artist}) => {
    return(
        <li>
            {artist.name} - {artist.role}
        </li>
    )
}
export default ExtraArtistDisplay