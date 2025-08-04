import { useState } from "react";
import stringToQuery from "./stringToQuery";
import { searchForMasterByName } from "./requestFunctions/searchForMasterByName";

const SearchBar = ({
  setSearchResults,
  setShowSearchResults,
  showSearchResults,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Search for master releases by name
  const searchForMaster = async (query) => {
    try {
      setLoading(true);
      const res = await searchForMasterByName(query);
      if (res.pagination.items > 0) {
        setSearchResults(res.results);
        setShowSearchResults(true);
      } else {
        window.alert("No results found for that search term");
      }
    } catch (error) {
      console.error("Error in searchForMasterByName:", error);
      window.alert("Error searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchForMaster(searchQuery);
      setSearchQuery("");
    }
  };

  return (
    <div className="searchBar">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search for an album..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="searchInput"
        />
        <button type="submit" disabled={loading} className="searchButton">
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
