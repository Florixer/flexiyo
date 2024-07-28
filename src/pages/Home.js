import React from "react";
import TodayPicks from "../components/home/TodayPicks";
import Post from "../components/home/Post";
import HomeNavbar from "../layout/items/HomeNavbar.js";
export default function Home() {
  return (
    <>
      <section id="home">
      <HomeNavbar />
        <div className="home-container">
          <TodayPicks />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
        </div>
      </section>
    </>
  );
}
