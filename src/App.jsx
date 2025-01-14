import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { clientId, tokenEndpoint, saveTokens, logOutClick } from './AuthUtil.jsx';
import Login from './Login.jsx';
import Callback from './Callback.jsx';
import Dashboard from './Dashboard.jsx';
import Explore from './ExplorePage/Explore.jsx';
import ErrorModal from './ErrorModal.jsx';

function App() {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState(null);

  // Automatically refresh the token before it expires (60 minutes)
  // The interval runs across all pages to ensure that the access token is 
  // periodically checked and refreshed before expiration, maintaining the user's 
  // authentication status throughout the app
  useEffect(() => {
    // Checks every 58 minutes to refresh the token on component mount
    const intervalId = setInterval(async () => {
      let access_token = localStorage.getItem('access_token');

      // Only proceed if expiry date exists (user has been authenticated)
      if (access_token) {
        // Refresh token before token expires
        const data = await refreshToken();
        saveTokens(data);
      }
    }, 3480000); // 58 minutes in milliseconds

    return () => clearInterval(intervalId);
  }, []);

  // Refresh the access token if expired
  const refreshToken = async () => {
    try {
      const refresh_token = localStorage.getItem('refresh_token');

      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refresh_token,
          client_id: clientId
        }),
      };

      const response = await fetch(tokenEndpoint, payload);
      const data = await response.json();

      if (!data.access_token) {
        throw new Error('Failed to refresh access token');
      }

      return data;
    } catch (err) {
      console.error(err);
      setError("Unable to refresh token. Please try logging in again");
      setShowErrorModal(true); // Show error modal if an error occurs
    }
  };

  // Close the error modal and log out
  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    logOutClick(); // Log out the user if there's an error
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>

      {/* Display error modal if token refresh fails */}
      <ErrorModal
        show={showErrorModal}
        error={error}
        onHide={handleCloseErrorModal}
      />
    </BrowserRouter>
  );
}

export default App;
