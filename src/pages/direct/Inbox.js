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
      <Headroom>
        <CustomTopNavbar
          navbarPrevPage="/"
          navbarCover={userInfo.pfp}
          navbarTitle="kaushal_krishna"
          navbarFirstIcon="fa fa-plus"
          navbarSecondIcon="fa fa-gear"
        />
      </Headroom>
      <div className="inbox-container">
        <div className="search-container">
          <div className="search-box">
            <svg
              className="search-magnify-icon"
              xmlns="http://www.w3.org/2000/svg"
              height="1.5rem"
              width="1.5rem"
              viewBox="0 0 24 24"
            >
              <g fill="none" style={searchMagnifyIcon} stroke-width="2">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.462 20H4a1 1 0 0 1-1-1V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v3.385M7 14h3m-3-4h6"
                ></path>
                <circle cx="16.5" cy="15.5" r="2.5"></circle>
                <path stroke-linecap="round" d="m18.5 17.5l3 3"></path>
              </g>
            </svg>
            <input
              type="text"
              className="search-input-field"
              placeholder="Search Flexomate..."
              onChange={handleSearchChange}
              value={searchText}
              onFocus={searchBarFocus}
              onBlur={searchBarNoFocus}
            />
          </div>
        </div>
        <div className="inbox-list">
          <b className="inbox-list--heading">Messages</b>
          {renderInbox()}
        </div>
      </div>
    </section>
  );
};

export default Inbox;
