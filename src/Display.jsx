import TrackDisplay from "./TrackDisplay"

const Display = ({ selectedMaster, data, selectedIndex }) => {
    
    // console.log(selectedMaster.tracklist)

    return(
        <div className="displayContainer">
            {
                    data[selectedIndex].cover_image && <img className="artistImage" src={data[selectedIndex].cover_image} />
            }
            <h1 className="artistName">{selectedMaster.artists[0].name} "{selectedMaster.title}" ({selectedMaster.year})</h1>
            <ol>
            {
                selectedMaster.tracklist.map((track, i)=>{
                    return(
                        <TrackDisplay track={track} key={i}/>
                    )
                })
            }
            </ol>
        </div>
    )
}

export default Display