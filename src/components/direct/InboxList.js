import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import CustomTopNavbar from "../../layout/items/CustomTopNavbar";
import matchMedia from "matchmedia";
import { userInfo } from "../../data/user/UserInfo";

const InboxList = () => {
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
  
  const inboxItems = {
    inbox: {
      items: [
        {
          id: 2963293620915324,
          title: "json.fiyo",
          cover: "https://i.pravatar.cc/50",
          last_msg: "1 new message",
        },
        {
          id: 2963293620915324,
          title: "json.fiyo",
          cover: "https://i.pravatar.cc/45",
          last_msg: "1 new message",
        },
        {
          id: 2963293620915324,
          title: "json.fiyo",
          cover: "https://i.pravatar.cc/40",
          last_msg: "1 new message",
        },
        {
          id: 2963293620915324,
          title: "json.fiyo",
          cover: "https://i.pravatar.cc/35",
          last_msg: "1 new message",
        },
        {
          id: 2963293620915324,
          title: "json.fiyo",
          cover: "https://i.pravatar.cc/30",
          last_msg: "1 new message",
        },
        {
          id: 2963293620915324,
          title: "json.fiyo",
          cover: "https://i.pravatar.cc/25",
          last_msg: "1 new message",
        },
        {
          id: 2963293620915324,
          title: "json.fiyo",
          cover: "https://i.pravatar.cc/20",
          last_msg: "1 new message",
        },
        {
          id: 2963293620915324,
          title: "json.fiyo",
          cover: "https://i.pravatar.cc/15",
          last_msg: "1 new message",
        },
        {
          id: 2963293620915324,
          title: "json.fiyo",
          cover: "https://i.pravatar.cc/10",
          last_msg: "1 new message",
        },
        {
          id: 2963293620915324,
          title: "json.fiyo",
          cover: "https://i.pravatar.cc/5",
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
    <div
      className="inbox-container"
      style={isMobile ? { maxWidth: "100%" } : { maxWidth: "20rem" }}
    >
      <CustomTopNavbar
        navbarPrevPage={isMobile ? "/" : null}
        navbarTitle="demo_.person"
        navbarSecondIcon="fal fa-pen-to-square"
      />
      <div className="inbox-list">
        <b className="inbox-list--heading">Messages</b>
        {renderInbox()}
      </div>
    </div>
  );
};

export default InboxList;
