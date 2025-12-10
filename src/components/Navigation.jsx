import React, { useState } from "react";
import ThemeToggle from "../ThemeToggle";
import { HistoryIcon, AccountCircleIcon } from "./NavIcons";
import checkWikipediaArticle from "../utils/wikipediaChecker";
import "../index.scss";

const consumerKey = import.meta.env.VITE_DISCOGS_CONSUMER_KEY;
const consumerSecret = import.meta.env.VITE_DISCOGS_CONSUMER_SECRET;

const Navigation = ({
  setSearchResults,
  setSearchQuery,
  onHistoryClick,
  onAccountClick,
  onSearchComplete,
}) => {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search");

    if (query.trim()) {
      setSearchQuery(query);
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://api.discogs.com/database/search?q=${encodeURIComponent(
            query
          )}&type=master&key=${consumerKey}&secret=${consumerSecret}`
        );
        const data = await response.json();
        const results = data.results || [];

        // Show results immediately without Wikipedia data
        setSearchResults(
          results.map((r) => ({
            ...r,
            wikipedia: { hasArticle: false, checking: true },
          }))
        );

        // Notify parent component about initial search completion
        if (onSearchComplete) {
          onSearchComplete(query, results);
        }

        // Enrich results with Wikipedia data in the background
        const enrichedResults = await Promise.all(
          results.map(async (result) => {
            // Parse artist and album from title (format: "Artist - Album")
            const titleParts = result.title.split(" - ");
            const artistName =
              titleParts.length > 1 ? titleParts[0] : "Unknown Artist";
            const albumTitle =
              titleParts.length > 1
                ? titleParts.slice(1).join(" - ")
                : result.title;

            // Check Wikipedia
            const wikipediaInfo = await checkWikipediaArticle(
              albumTitle,
              artistName
            );

            return {
              ...result,
              wikipedia: { ...wikipediaInfo, checking: false },
            };
          })
        );

        setSearchResults(enrichedResults);

        // Notify parent component about enriched results
        if (onSearchComplete) {
          onSearchComplete(query, enrichedResults);
        }
      } catch (error) {
        console.error("Error searching:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
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
              disabled={isSearching}
            />
            <button
              type="submit"
              className="searchButton"
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Search"}
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
