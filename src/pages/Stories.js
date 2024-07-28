import React from "react";
import matchMedia from "matchmedia";
import Headroom from "react-headroom";
import CustomTopNavbar from "../layout/items/CustomTopNavbar";

const Stories = () => {
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

  const storiesList = [
    {
      id: 1,
      username: "me.23get",
      pfp: "https://i.pravatar.cc/300",
      backThumb: "https://picsum.photos/200/300",
    },
    {
      id: 2,
      username: "kin.tista",
      pfp: "https://i.pravatar.cc/300",
      backThumb: "https://picsum.photos/200/300",
    },
    {
      id: 3,
      username: "hehe.letsgetit",
      pfp: "https://i.pravatar.cc/300",
      backThumb: "https://picsum.photos/200/300",
    },
    {
      id: 4,
      username: "wow.itsyou",
      pfp: "https://i.pravatar.cc/300",
      backThumb: "https://picsum.photos/200/300",
    },
    {
      id: 5,
      username: "uh.itsme",
      pfp: "https://i.pravatar.cc/300",
      backThumb: "https://picsum.photos/200/300",
    },
    {
      id: 6,
      username: "lol.korat",
      pfp: "https://i.pravatar.cc/300",
      backThumb: "https://picsum.photos/200/300",
    },
  ];

  const renderStories = () => {
    return storiesList.map((story) => (
      <div className="stories-list--story" key={story.id}>
        <div
          className="stories-list--story-backthumb"
          style={{ backgroundImage: `url(${story.backThumb})` }}
          title="View Story"
        ></div>
        <img
          className="stories-list--story-pfp"
          src={story.pfp}
          alt={`${story.username}'s Story`}
        />
        <span className="stories-list--story-username">{story.username}</span>
      </div>
    ));
  };
  return (
    <section id="stories">
      {isMobile ? (
        <Headroom>
          <CustomTopNavbar
            navbarPrevPage="/"
            navbarTitle="Stories"
            navbarFirstIcon="fa fa-plus"
            navbarSecondIcon="fa fa-gear"
            setBorder
          />
        </Headroom>
      ) : null}
      <div className="stories-list">{renderStories()}</div>
      <div className="new-story">
        <div className="new-story--scratch">
          <span className="new-story--scratch-icon">
            <i className="fa fa-plus"></i>
          </span>
          <span className="new-story--scratch-title">Create a New Story from Scratch</span>
        </div>
        <div className="new-story--templates">
          <div className="new-story--templates-item"></div>
          <div className="new-story--templates-item"></div>
          <div className="new-story--templates-item"></div>
          <div className="new-story--templates-item"></div>
        </div>
      </div>
    </section>
  );
};

export default Stories;
