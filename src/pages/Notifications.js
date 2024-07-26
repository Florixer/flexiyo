import React from "react";
import CustomTopNavbar from "../layout/items/CustomTopNavbar";

const Notifications = () => {
  const notificationsList = [
    {
      id: 1,
      type: "success",
      icon: "fal fa-check",
      title: "Congrats! Your account has been created.",
      actions: [
        {
          type: "button",
          text: "Get Started",
        },
      ],
      time: "3d",
    },
    {
      id: 1,
      type: "normal",
      icon: "fal fa-user-plus",
      title: "@username has requested to follow you.",
      actions: [
        {
          type: "button",
          text: "Deny",
        },
        {
          type: "button",
          text: "Accept",
        },
      ],
      time: "2h",
    },
    {
      id: 1,
      type: "normal",
      icon: "fal fa-user-plus",
      title: "@username has requested to follow you.",
      actions: [
        {
          type: "button",
          text: "Deny",
        },
        {
          type: "button",
          text: "Accept",
        },
      ],
      time: "2h",
    },
    {
      id: 1,
      type: "normal",
      icon: "fal fa-user-plus",
      title: "@username has requested to follow you.",
      actions: [
        {
          type: "button",
          text: "Deny",
        },
        {
          type: "button",
          text: "Accept",
        },
      ],
      time: "2h",
    },
    {
      id: 1,
      type: "normal",
      icon: "fal fa-user-plus",
      title: "@username has requested to follow you.",
      actions: [
        {
          type: "button",
          text: "Deny",
        },
        {
          type: "button",
          text: "Accept",
        },
      ],
      time: "2h",
    },
    {
      id: 1,
      type: "normal",
      icon: "fal fa-user-plus",
      title: "@username, @hesman and 28 others have liked your comment : Oo Good Idea!...",
      time: "2h",
    },
  ];

  const renderNotifications = () => {
    return notificationsList.map((notification) => {
      return (
        <div className="notification">
          <div className="notification-icon">
            <i className={notification.icon}></i>
          </div>
          <div className="notification-body">
            <div className="notification-body--title">
              {notification.title} &nbsp;
              <span className="notification-body--time">{notification.time}</span>
            </div>
            <div className="notification-body--actions">
              {notification.actions ? notification.actions.map((action) => {
                return (
                  <button type="button" className="notification-body--actions-btn">
                    {action.text}
                  </button>
                );
              }) : null}
            </div>
          </div>
        </div>
      );
    });
  };
  return (
    <section id="notifications">
      <CustomTopNavbar
        navbarPrevPage="/"
        navbarTitle="Notifications"
        navbarFirstIcon="fa fa-plus"
        navbarSecondIcon="fa fa-gear"
      />
      <div className="notifications-list">{renderNotifications()}</div>
    </section>
  );
};

export default Notifications;
