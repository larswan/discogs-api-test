import { sortByYearHundredPerPage } from "./SmallTester"

const ExtraArtistDisplay = ({artist}) => {

    const onClick = (artist) => {
        const request = async (artist) => {
            try{
                let req = await fetch(`https://api.discogs.com/artists/${artist.id}/releases${sortByYearHundredPerPage}`)
                let res = await req.json()
                let releases = res.releases
                let roles = Array.from(new Set(releases.map(release => release.role)));
                console.log(roles)
                
                console.log(artist.id)
                console.log(res)
                // console.log(releases[0].role)
            } catch(error){
                console.error('Error fetching artist releases by id: ' + `https://api.discogs.com/artists/${artist.id}/releases`)
            }
        }
        request(artist)
    }
    
    return(
        <li className="extraArtistItem" onClick={()=>onClick(artist)}>
            {artist.name} - {artist.role}
        </li>
    )
}
export default ExtraArtistDisplay