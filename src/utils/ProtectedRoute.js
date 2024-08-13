import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import UserContext from "../context/user/UserContext";

const ProtectedRoute = ({ children }) => {
  const { isUserAuthenticated } = useContext(UserContext);
  const location = useLocation();

  return isUserAuthenticated ? (
    children
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
