import { useState } from "react";

const consumerKey = import.meta.env.VITE_DISCOGS_CONSUMER_KEY;
const consumerSecret = import.meta.env.VITE_DISCOGS_CONSUMER_SECRET;

const ArtistSearch = () => {
    const request = async (band) => {
        try {
            let req = await fetch(`https://api.discogs.com/database/search?q=${band}&key=${consumerKey}&secret=${consumerSecret}`);
            let res = await req.json();
            setBandData(res)
            console.log(res);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [band, setBand] = useState("")
    const [bandData, setBandData] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()
        request(band)
        setBand("")
    }

    return (
            <div>
                <h1>
                    Discogs API Tester
                </h1>
                <form onSubmit={e => handleSubmit(e)}>
                    <input type="text" placeholder="enter band name..." value={band} onChange={e => setBand(e.target.value)}></input>
                    <button type="submit">Search</button>
                </form>
                {!bandData ? null :
                    <div className="bandDataContainer">
                        <img className="artistImage" src={bandData.results[0].cover_image} />
                        <h1 className="artistName">{bandData.results[0].title}</h1>
                    </div>
                }
            </div>
    );   
}

export default ArtistSearch