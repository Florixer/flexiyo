import React from "react";
import TodayPicks from "../components/home/TodayPicks";
import Post from "../components/home/Post";
export default function Home() {
  return (
    <>
      <section id="home">
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
