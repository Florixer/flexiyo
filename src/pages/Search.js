import React from "react";
import SearchBar from "../components/search/SearchBar";

export default function Search() {
  document.title = "Flexiyo | Search";

  return (
    <section id="search">
      <SearchBar />
    </section>
  );
}
