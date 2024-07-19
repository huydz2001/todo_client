import { useState, useEffect } from "react";
import { useMutation, useApolloClient } from "@apollo/client";

function RefreshTokenComponent() {
  const [refreshToken, setRefreshToken] = useState(null);
  const client = useApolloClient();

  useEffect(() => {
    // Retrieve the refresh token from local storage or some other source
    const token = localStorage.getItem("refreshToken");
    setRefreshToken(token);
  }, []);

  const [refreshAccessToken] = useMutation(
    async (refreshToken) => {
      try {
        const response = await fetch("/refresh-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const { accessToken } = await response.json();
        return accessToken;
      } catch (error) {
        console.error("Error refreshing access token:", error);
        throw error;
      }
    },
    {
      onCompleted: (data) => {
        // Update the access token in local storage
        localStorage.setItem("authToken", data.accessToken);

        // Retry the original request with the new access token
        client.resetStore();
      },
      onError: (error) => {
        console.error("Error refreshing access token:", error);
        // Handle the error, e.g., display an error message, redirect to login
      },
    }
  );

  return null; // This component doesn't render anything, it's just a utility
}

export default RefreshTokenComponent;
