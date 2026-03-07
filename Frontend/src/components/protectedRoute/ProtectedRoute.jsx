import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { authUser } = useSelector((state) => state.user);

  if (!authUser) {
    // User is not logged in → redirect to login page
    return <Navigate to="/login" replace />;
  }

  // User is logged in → render children (Home page)
  return children;
};

export default ProtectedRoute;
