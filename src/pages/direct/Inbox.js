import React, { useState } from "react";
import { Link } from "react-router-dom";
import Headroom from "react-headroom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import CustomTopNavbar from "../../layout/items/CustomTopNavbar";
import { userInfo } from "../../data/user/UserInfo";

const Inbox = () => {
  const [searchMagnifyIcon, setsearchMagnifyIcon] = useState({
    stroke: "var(--fm-primary-text-muted)",
  });

  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const searchBarFocus = () => {
    setsearchMagnifyIcon({
      stroke: "var(--fm-primary-text)",
    });
  };

  const searchBarNoFocus = () => {
    setsearchMagnifyIcon({
      stroke: "var(--fm-primary-text-muted)",
    });
  };

  const inboxItems = {
    inbox: {
      items: [
        {
          id: 2963293620915324,
          title: "json.fiyo",
          cover: "https://i.pravatar.cc/300",
          last_msg: "1 new message",
        },
        {
          id: 2963293620915324,
          title: "json.fiyo",
          cover: "https://i.pravatar.cc/300",
          last_msg: "1 new message",
        },
        {
          id: 2963293620915324,
          title: "json.fiyo",
          cover: "https://i.pravatar.cc/300",
          last_msg: "1 new message",
        },
        {
          id: 2963293620915324,
          title: "json.fiyo",
          cover: "https://i.pravatar.cc/300",
          last_msg: "1 new message",
        },
        {
          id: 2963293620915324,
          title: "json.fiyo",
          cover: "https://i.pravatar.cc/300",
          last_msg: "1 new message",
        },
        {
          id: 2963293620915324,
          title: "json.fiyo",
          cover: "https://i.pravatar.cc/300",
          last_msg: "1 new message",
        },
        {
          id: 2963293620915324,
          title: "json.fiyo",
          cover: "https://i.pravatar.cc/300",
          last_msg: "1 new message",
        },
        {
          id: 2963293620915324,
          title: "json.fiyo",
          cover: "https://i.pravatar.cc/300",
          last_msg: "1 new message",
        },
        {
          id: 2963293620915324,
          title: "json.fiyo",
          cover: "https://i.pravatar.cc/300",
          last_msg: "1 new message",
        },
      ],
    },
  };

  const renderInbox = () => {
    return inboxItems.inbox.items.map((chat) => (
      <Link to={`/direct/t/${chat.id}`}>
        <div className="inbox-item" key={chat.id}>
          <LazyLoadImage
            alt="chat-cover"
            className="inbox-item--cover"
            src={chat.cover}
          />
          <div className="inbox-item-main">
            <label className="inbox-item--title">{chat.title}</label>
            <span className="inbox-item--last-msg">{chat.last_msg}</span>
          </div>
        </div>
      </Link>
    ));
  };

  return (
    <section id="inbox">
      <CustomTopNavbar
        navbarPrevPage={"/"}
        navbarTitle="demo_.person"
        navbarSecondIcon="fal fa-pen-to-square"
      />
      <div className="inbox-container">
        <div className="inbox-list">
          <b className="inbox-list--heading">Messages</b>
          {renderInbox()}
        </div>
      </div>
    </section>
  );
};

export default Inbox;
