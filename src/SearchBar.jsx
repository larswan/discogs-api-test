import { useState, useEffect } from "react";
import Display from "./Display";
import IndexBar from "./IndexBar";
import stringToQuery from "./stringToQuery";
import checkRateLimit from "./checkRateLimit";

const consumerKey = import.meta.env.VITE_DISCOGS_CONSUMER_KEY;
const consumerSecret = import.meta.env.VITE_DISCOGS_CONSUMER_SECRET;

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [data, setData] = useState()
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [requestType, setRequestType] = useState("master")
    const [selectedMaster, setSelectedMaster] = useState()

    // search for a master by id
    useEffect(()=>{
        if(data){
            queryByMasterId(data[selectedIndex].master_id)
        }
    },[selectedIndex])

    // Console master object after each search
    useEffect(()=>{
        // console.log(selectedMaster)
    },[selectedMaster])

    const queryByMasterId = async (masterId) => {
        try {
            let req = await fetch(`https://api.discogs.com/masters/${masterId}`)
            let res = await req.json();
            console.log("Successful search for master by id: ")
            console.log(res)
            setSelectedMaster(res)
        } catch(error) {
            console.error('Error fetching master by id: ', error)
        }
    }
    
    const searchForMaster = async (query) => {
        try {
            let req = await fetch(`https://api.discogs.com/database/search?q=${stringToQuery(query)}&type=${requestType}&key=${consumerKey}&secret=${consumerSecret}`, {
                headers: {
                    'User-Agent': 'YourCustomUserAgent/1.0 +http://yourwebsite.com',
                },
            });            let res = await req.json();
            setData(res.results)
            console.log("Search results: ")
            console.log(res.results);

            
            // Search by master id for the first result, since virtual dom wont update selectedIndex in time
            queryByMasterId(res.results[0].master_id)
            setSelectedIndex(0)
        } catch (error) {
            console.error('Error fetching search by title:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        searchForMaster(searchQuery)
        setSearchQuery("")
    }

    return(
        <div className="bodyContainer">
            <div className="leftSide">
                {
                    !selectedMaster ? null : <Display data={data} selectedMaster={selectedMaster} selectedIndex={selectedIndex} />
                }
            </div>

            <div className="rightSide">

                <form onSubmit={e => handleSubmit(e)}>
                    <input type="text" placeholder="enter search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}></input>
                    <button type="submit">Search {requestType}</button>
                </form>

                {!data ? null :
                    <div>
                        
                        <IndexBar data={data} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
                    </div>
                }
            </div>
        </div>
    )
}

export default SearchBar