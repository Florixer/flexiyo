import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

// Create UserContext
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUserInfo = Cookies.get("userInfo");
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
      setIsUserAuthenticated(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (userInfo) {
      const { password, ...userInfoWithoutPassword } = userInfo;
      Cookies.set("userInfo", JSON.stringify(userInfoWithoutPassword), {
        expires: 3650,
      });
    } else {
      Cookies.remove("userInfo");
    }
  }, [userInfo]);

  return (
    <UserContext.Provider
      value={{
        isUserAuthenticated,
        setIsUserAuthenticated,
        userInfo,
        setUserInfo,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
