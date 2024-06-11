import React from "react";
import Headroom from "react-headroom";
import CustomTopNavbar from "../layout/items/CustomTopNavbar";

const Stories = () => {
  const storiesList = [
    {
      id: 1,
      username: "me.23get",
      pfp: "https://i.pravatar.cc/300",
      backThumb: "https://picsum.photos/200/300",
    },
    {
      id: 2,
      username: "me.23get",
      pfp: "https://i.pravatar.cc/300",
      backThumb: "https://picsum.photos/200/300",
    },
    {
      id: 3,
      username: "me.23get",
      pfp: "https://i.pravatar.cc/300",
      backThumb: "https://picsum.photos/200/300",
    },
    {
      id: 4,
      username: "me.23get",
      pfp: "https://i.pravatar.cc/300",
      backThumb: "https://picsum.photos/200/300",
    },
    {
      id: 5,
      username: "me.23get",
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
          alt={story.username}
        />
      </div>
    ));
  };
  return (
    <section id="stories">
      <Headroom>
        <CustomTopNavbar
          navbarPrevPage="/"
          navbarTitle="Stories"
          navbarFirstIcon="fa fa-plus"
          navbarSecondIcon="fa fa-gear"
        />
      </Headroom>
      <div className="stories-list">{renderStories()}</div>
    </section>
  );
};

export default Stories;
