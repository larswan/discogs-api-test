import React from "react";

const HistoryBar = ({ history, onBack, currentView }) => {
  if (history.length === 0) {
    return null;
  }

  const getBackButtonText = () => {
    const lastItem = history[history.length - 1];
    if (lastItem.type === "search") {
      return `← Back to search results`;
    } else if (lastItem.type === "album") {
      return `← Back to "${lastItem.title}"`;
    } else if (lastItem.type === "person") {
      return `← Back to "${lastItem.albumName}"`;
    }
    return "← Back";
  };

  const getBreadcrumbText = () => {
    if (history.length === 0) return "";

    const breadcrumbs = history.map((item, index) => {
      if (item.type === "search") {
        return "Search Results";
      } else if (item.type === "album") {
        return item.title;
      } else if (item.type === "person") {
        return item.contributor.name;
      }
      return "";
    });

    return breadcrumbs.join(" > ");
  };

  return (
    <div className="historyBar">
      <div className="historyContent">
        <button className="backButton" onClick={onBack}>
          {getBackButtonText()}
        </button>
        {history.length > 1 && (
          <div className="breadcrumbs">{getBreadcrumbText()}</div>
        )}
      </div>
    </div>
  );
};

export default HistoryBar;
