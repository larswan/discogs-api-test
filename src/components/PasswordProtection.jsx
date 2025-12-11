import { useState, useEffect } from "react";
import "../index.scss";

const PasswordProtection = ({ onAuthenticated, children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  // Check if already authenticated on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem("app_authenticated");
    const authTime = sessionStorage.getItem("app_auth_time");

    // Check if authentication is still valid (24 hours)
    if (authStatus === "true" && authTime) {
      const timeDiff = Date.now() - parseInt(authTime);
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        setIsAuthenticated(true);
        if (onAuthenticated) onAuthenticated(true);
      } else {
        // Expired, clear it
        sessionStorage.removeItem("app_authenticated");
        sessionStorage.removeItem("app_auth_time");
      }
    }

    setIsChecking(false);
  }, [onAuthenticated]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Get password from environment variable (must be set in Vercel)
    const correctPassword = import.meta.env.VITE_APP_PASSWORD;
    const isDevelopment =
      import.meta.env.DEV || window.location.hostname === "localhost";

    // In development, allow access without password (for local testing)
    if (isDevelopment && !correctPassword) {
      console.warn(
        "Development mode: Password protection disabled. Set VITE_APP_PASSWORD for production."
      );
      setIsAuthenticated(true);
      sessionStorage.setItem("app_authenticated", "true");
      sessionStorage.setItem("app_auth_time", Date.now().toString());
      if (onAuthenticated) onAuthenticated(true);
      return;
    }

    // In production, require password
    if (!correctPassword || correctPassword.trim() === "") {
      setError(
        "Password protection not configured. Please set VITE_APP_PASSWORD in Vercel environment variables and redeploy."
      );
      console.error(
        "VITE_APP_PASSWORD is not set. Current value:",
        correctPassword
      );
      return;
    }

    if (password === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("app_authenticated", "true");
      sessionStorage.setItem("app_auth_time", Date.now().toString());
      if (onAuthenticated) onAuthenticated(true);
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  if (isChecking) {
    return (
      <div className="password-protection">
        <div className="password-form">
          <div className="loading">Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="password-protection">
        <div className="password-form">
          <h2>🔒 Protected Access</h2>
          <p>This application is password protected.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
              className="password-input"
            />
            {error && <div className="password-error">{error}</div>}
            <button type="submit" className="password-submit">
              Access App
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PasswordProtection;
