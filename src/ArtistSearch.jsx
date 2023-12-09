import { useState, useEffect } from "react";

const consumerKey = import.meta.env.VITE_DISCOGS_CONSUMER_KEY;
const consumerSecret = import.meta.env.VITE_DISCOGS_CONSUMER_SECRET;

const ArtistSearch = () => {
    const [band, setBand] = useState("")
    const [bandData, setBandData] = useState()
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(()=>{
        !bandData ? null : console.log(bandData[selectedIndex])
    },[selectedIndex])

    const request = async (band) => {
        try {
            let req = await fetch(`https://api.discogs.com/database/search?q=${band}&key=${consumerKey}&secret=${consumerSecret}`);
            let res = await req.json();
            setBandData(res.results)
            console.log(res);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        request(band)
        setBand("")
    }

    return (
            <div>
                <h3>
                    Discogs API Tester
                </h3>
                <form onSubmit={e => handleSubmit(e)}>
                    <input type="text" placeholder="enter band name..." value={band} onChange={e => setBand(e.target.value)}></input>
                    <button type="submit">Search</button>
                </form>
                {!bandData ? null :
                    <div className="bandDataContainer">
                        <img className="artistImage" src={bandData[selectedIndex].cover_image} />
                        <h1 className="artistName">{bandData[selectedIndex].title}</h1>
                        <div className="indexBar">
                            {bandData.map((currentBand, index)=>{
                                if(currentBand.type=="artist")
                                return (
                                    <div className="indexBox" key={index} onClick={()=>{setSelectedIndex(index)}}>{index}</div>
                                    )
                                })}
                        </div>
                    </div>
                }
            </div>
    );   
}

export default ArtistSearch