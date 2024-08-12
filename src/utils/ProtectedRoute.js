import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isUserLoggedIn = true;

  return isUserLoggedIn ? (
    children
  ) : (
    <Navigate
      to="/auth/login"
      state={{ from: location }}
      replace
    />
  );
};

export default ProtectedRoute;
