import { useState, useEffect } from "react";
import Display from "./Display";
import IndexBar from "./IndexBar";

const consumerKey = import.meta.env.VITE_DISCOGS_CONSUMER_KEY;
const consumerSecret = import.meta.env.VITE_DISCOGS_CONSUMER_SECRET;

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [data, setData] = useState()
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [requestType, setRequestType] = useState("master")
    const [selectedMaster, setSelectedMaster] = useState({})

    // search for a master by id
    useEffect(()=>{
        if(data){
            queryMaster(data[selectedIndex].master_id)
            console.log(data[selectedIndex].master_id)
        }
    },[selectedIndex])

    const queryMaster = async (masterId) => {
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
            let req = await fetch(`https://api.discogs.com/database/search?q=${query}&type=${requestType}&key=${consumerKey}&secret=${consumerSecret}`);
            let res = await req.json();
            setData(res.results)
            setSelectedIndex(0)
            // console.log(res);
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
        <div>
            <form onSubmit={e => handleSubmit(e)}>
                <input type="text" placeholder="enter search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}></input>
                <button type="submit">Search {requestType}</button>
            </form>

            {!data ? null :
                <div>
                    <Display selectedMaster={selectedMaster} selectedIndex={selectedIndex}/>
                    <IndexBar data={data} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
                </div>
            }
        </div>
    )
}

export default SearchBar