import { useState } from "react"
import ExtraArtistDisplay from "./ExtraArtistDisplay"

const TrackDisplay = ({track}) => {
    const [showExtraArtists, setShowExtraArtists] = useState(false)

    return (
        <li onClick={()=>setShowExtraArtists(!showExtraArtists)} className={"track " + (track.extraartists ? "hasExtraArtists" : "")}>
            {track.title}
            {
                track.extraartists || showExtraArtists ? (
                    <ul className="extraArtistsList">
                            {
                                track.extraartists.map((artist, i)=> {
                                    return(
                                        <ExtraArtistDisplay artist={artist} key={i} />
                                    )})
                            }
                    </ul>
                ) : null
            }
        </li>
    )
}

export default TrackDisplay