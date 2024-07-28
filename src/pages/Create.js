import React from "react";
import Headroom from "react-headroom";
import matchMedia from "matchmedia";
import CustomTopNavbar from "../layout/items/CustomTopNavbar";
import ContentViewport from "../components/create/ContentViewport";
import ContentSelection from "../components/create/ContentSelection";
const Create = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = matchMedia("(max-width: 950px)");
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
    <section id="create">
      {isMobile ? (
        <Headroom>
          <CustomTopNavbar
            navbarPrevPage={"/"}
            navbarTitle="Create"
            navbarFirstIcon="fa fa-plus"
            navbarSecondIcon="fa fa-gear"
            setBorder
          />
        </Headroom>
      ) : null}
      <div
        className="create-container"
        style={{ flexDirection: isMobile ? "column" : "row" }}
      >
        <ContentViewport />
        <ContentSelection />
      </div>
    </section>
  );
};

export default Create;
