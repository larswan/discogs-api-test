import React from "react";
import ThemeToggle from "../ThemeToggle";
import { HistoryIcon, AccountCircleIcon } from "./NavIcons";
import "../index.scss";

const Navigation = ({
  setSearchResults,
  setSearchQuery,
  onHistoryClick,
  onAccountClick,
  onSearchComplete,
}) => {
  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search");

    if (query.trim()) {
      setSearchQuery(query);
      try {
        const response = await fetch(
          `https://api.discogs.com/database/search?q=${encodeURIComponent(
            query
          )}&type=master&key=cRAzvcfLMUBYtnXcAhSu&secret=unCJcRgqBuLQVDGiYlOfJhkgPGzQUblO`
        );
        const data = await response.json();
        const results = data.results || [];
        setSearchResults(results);

        // Notify parent component about search completion
        if (onSearchComplete) {
          onSearchComplete(query, results);
        }
      } catch (error) {
        console.error("Error searching:", error);
        setSearchResults([]);
      }
    }
  };

  return (
    <nav className="navigation">
      <div className="navContainer">
        {/* Left: Theme Toggle */}
        <div className="navLeft">
          <ThemeToggle />
        </div>

        {/* Center: Search Bar */}
        <div className="navCenter">
          <form onSubmit={handleSearch} className="searchForm">
            <input
              type="text"
              name="search"
              placeholder="Search for albums..."
              className="searchInput"
              required
            />
            <button type="submit" className="searchButton">
              Search
            </button>
          </form>
        </div>

        {/* Right: Navigation Icons */}
        <div className="navRight">
          <HistoryIcon
            className="navIcon historyIcon"
            onClick={onHistoryClick}
          />
          <AccountCircleIcon
            className="navIcon accountIcon"
            onClick={onAccountClick}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
