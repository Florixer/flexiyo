import React from "react";
import { Link } from "react-router-dom";
const CustomTopNavbar = ({
  navbarPrevPage,
  navbarCover,
  navbarTitle,
  navbarFirstIcon,
  navbarSecondIcon,
}) => {
  return (
    <div className="custom-top-navbar">
      <div className="custom-top-navbar--left">
        {navbarPrevPage ? (
          <Link to={navbarPrevPage}>
            <i className="fm-small-icon far fa-arrow-left"></i>
          </Link>
        ) : null}
        <img
          src={navbarCover}
          className="custom-top-navbar--left-cover"
          alt="navbar-cover"
        />
        <span className="custom-top-navbar--left-username">{navbarTitle}</span>
      </div>
      <div className="custom-top-navbar--right">
        <div className="custom-top-navbar--right-icon">
          <i className={navbarFirstIcon}></i>
        </div>
        <div className="custom-top-navbar--right-icon">
          <i className={navbarSecondIcon}></i>
        </div>
      </div>
    </div>
  );
};

export default CustomTopNavbar;
