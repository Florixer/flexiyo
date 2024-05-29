import React from "react";
import matchMedia from "matchmedia";
import BottomNavbar from "./items/BottomNavbar";
import SideNavbar from "./items/SideNavbar";

const Navbar = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = matchMedia("(max-width: 600px)");
    const handleMediaQueryChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    mediaQuery.addListener(handleMediaQueryChange);
    handleMediaQueryChange();

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  return (
    <>
      {isMobile ? (
        <>
          {" "}
          <BottomNavbar />
        </>
      ) : (
        <SideNavbar />
      )}
    </>
  );
};

export default Navbar;
