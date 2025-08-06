import React from "react";

// Custom History Icon (similar to MUI HistoryIcon)
export const HistoryIcon = ({ className = "", onClick }) => (
  <svg
    className={className}
    onClick={onClick}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ cursor: onClick ? "pointer" : "default" }}
  >
    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
  </svg>
);

// Custom Account Circle Icon (similar to MUI AccountCircleIcon)
export const AccountCircleIcon = ({ className = "", onClick }) => (
  <svg
    className={className}
    onClick={onClick}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ cursor: onClick ? "pointer" : "default" }}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
  </svg>
);
