import { createContext, useState, useEffect } from "react";

// Create Auth Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null); // "student" or "recruiter"

  useEffect(() => {
    // Get stored authentication data
    const authStatus = localStorage.getItem("isAuthenticated");
    const storedUserType = localStorage.getItem("userType");

    setIsAuthenticated(authStatus === "true");
    setUserType(storedUserType);
  }, []);

  const login = (type) => {
    setIsAuthenticated(true);
    setUserType(type);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userType", type);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
 

  };

  const value = {
    isAuthenticated, userType, login, logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
