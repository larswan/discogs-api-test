import React from "react";

const HistoryBar = ({ history, onBack, onBreadcrumbClick, currentIndex }) => {
  if (!history || history.length === 0) {
    return null;
  }

  const getBackButtonText = () => {
    if (currentIndex <= 0 || !history || history.length === 0) {
      return "← Back to search";
    }

    const previousItem = history[currentIndex - 1];
    if (!previousItem || !previousItem.type) {
      return "← Back to search";
    }

    if (previousItem.type === "search") {
      return `← Back to search results`;
    } else if (previousItem.type === "album") {
      return `← Back to "${previousItem.name || "album"}"`;
    } else if (previousItem.type === "person") {
      return `← Back to ${previousItem.name || "person"}`;
    }
    return "← Back";
  };

  const renderBreadcrumbs = () => {
    if (!history || history.length === 0) return null;

    return history.map((item, index) => {
      if (!item || !item.type) return null;

      const isActive = index === currentIndex;
      const isClickable = index < currentIndex;

      let displayName = "";
      if (item.type === "search") {
        displayName = "Search Results";
      } else if (item.type === "album") {
        displayName = `"${item.name || "Album"}"`;
      } else if (item.type === "person") {
        displayName = item.name || "Person";
      }

      return (
        <span key={item.id}>
          <span
            className={`breadcrumb-item ${isActive ? "active" : ""} ${
              isClickable ? "clickable" : ""
            }`}
            onClick={isClickable ? () => onBreadcrumbClick(index) : undefined}
          >
            {displayName}
          </span>
          {index < history.length - 1 && (
            <span className="breadcrumb-separator"> &gt; </span>
          )}
        </span>
      );
    });
  };

  return (
    <div className="historyBar">
      <div className="historyContent">
        <button className="backButton" onClick={onBack}>
          {getBackButtonText()}
        </button>
        {history && history.length > 1 && (
          <div className="breadcrumbs">{renderBreadcrumbs()}</div>
        )}
      </div>
    </div>
  );
};

export default HistoryBar;
