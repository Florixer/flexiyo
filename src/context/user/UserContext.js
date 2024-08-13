import { createContext, useState } from "react";
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  return (
    <UserContext.Provider
      value={{
       isUserAuthenticated,
       setIsUserAuthenticated
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;