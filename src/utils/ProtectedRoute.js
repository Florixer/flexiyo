import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import UserContext from "../context/user/UserContext";
import AuthLogin from "../pages/auth/Login";

const ProtectedRoute = ({ children }) => {
  const { isUserAuthenticated } = useContext(UserContext);

  return isUserAuthenticated ? (
    children
  ) : ( 
    <AuthLogin />
  );
};

export default ProtectedRoute;
