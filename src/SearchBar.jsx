import { useState, useEffect } from "react";
import Display from "./Display";
import IndexBar from "./IndexBar";

const consumerKey = import.meta.env.VITE_DISCOGS_CONSUMER_KEY;
const consumerSecret = import.meta.env.VITE_DISCOGS_CONSUMER_SECRET;

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [data, setData] = useState()
    const [selectedIndex, setSelectedIndex] = useState(0)

    // useEffect(()=>{
    //     console.log("Data: ")
    //     console.log(data)
    // },[data])

    const request = async (query) => {
        try {
            let req = await fetch(`https://api.discogs.com/database/search?q=${query}&key=${consumerKey}&secret=${consumerSecret}`);
            let res = await req.json();
            setData(res.results)
            // console.log(res);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        request(searchQuery)
        setSearchQuery("")
    }

    return(
        <div>
            <form onSubmit={e => handleSubmit(e)}>
                <input type="text" placeholder="enter search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}></input>
                <button type="submit">Search</button>
            </form>

            {!data ? null :
                <div>
                    <Display data={data} selectedIndex={selectedIndex}/>
                    <IndexBar data={data} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
                </div>
            }
        </div>
    )
}

export default SearchBar