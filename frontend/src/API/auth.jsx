import React, { createContext, useContext, useEffect, useState } from "react";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to provide context values
const AuthProvider = ({ children }) => {
  // State declarations
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);

  const API = import.meta.env.VITE_APP_URI_API;

  // Authorization token for API headers
  const authorizationToken = token ? `Bearer ${token}` : "";

  // Function to store token in local storage
  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  // Function to log out the user
  const LogoutUser = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  // Check if the user is logged in
  const isLoggedIn = Boolean(token);

  // Function to fetch authenticated user data
  const fetchAuthenticatedUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API}/api/auth/user`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.userData || null);
      } else {
        console.error("Failed to fetch user data. Response status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch blog data
  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${API}/api/blog/blogsData`, { method: "GET" });

      if (response.ok) {
        const data = await response.json();
        setBlogs(data.message || []);
      } else {
        console.error("Failed to fetch blogs. Response status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  // Fetch data when the token changes or component mounts
  useEffect(() => {
    if (authorizationToken) {
      fetchAuthenticatedUser();
      fetchBlogs();
    }
  }, [authorizationToken]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        storeTokenInLS,
        LogoutUser,
        user,
        blogs,
        authorizationToken,
        isLoading,
        API,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
const useAuth = () => {
  const contextValue = useContext(AuthContext);

  if (!contextValue) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return contextValue;
};

// Exporting components and hooks
export { AuthContext, AuthProvider, useAuth };
