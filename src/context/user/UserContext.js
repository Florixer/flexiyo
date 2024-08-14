import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(() => {
    const savedUserInfo = Cookies.get("userInfo");
    return savedUserInfo ? JSON.parse(savedUserInfo) : {};
  });

  useEffect(() => {
    if (Object.keys(userInfo).length !== 0) {
      const { password, ...userInfoWithoutPassword } = userInfo;

      Cookies.set("userInfo", JSON.stringify(userInfoWithoutPassword), {
        expires: 3650,
      });
      setIsUserAuthenticated(true);
    } else {
      Cookies.remove("userInfo");
      setIsUserAuthenticated(false);
    }
  }, [userInfo]);

  return (
    <UserContext.Provider
      value={{
        isUserAuthenticated,
        setIsUserAuthenticated,
        userInfo,
        setUserInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
