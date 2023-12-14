import { useState, useEffect } from "react";
import Display from "./Display";
import IndexBar from "./IndexBar";
import stringToQuery from "./stringToQuery";
import { queryByMasterId } from "./requestFunctions/queryByMasterId";
import { searchForMasterByName } from "./requestFunctions/searchForMasterByName";

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [data, setData] = useState()
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [requestType, setRequestType] = useState("master")
    const [selectedMaster, setSelectedMaster] = useState()

    // Search for a master by ID
    useEffect(()=>{
        if(data){
            queryMaster(data[selectedIndex].master_id)
        }
    },[selectedIndex, data])

    const queryMaster = async (masterId) => {
        queryByMasterId(masterId)
            .then((result) => {
                setSelectedMaster(result)
            })
            .catch((error) => {
                console.error('Error in queryByMasterId');
            });
    }
    
    // Search for master releases by name
    const searchForMaster = async (query) => {
        try {
            const res = await searchForMasterByName(query);
            if (res.pagination.items > 0) setData(res.results)
            else window.alert("Bad search term")
        ;
        } catch (error) {
            console.error("Error in searchForMasterByName:", error);
            // Handle the error appropriately
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