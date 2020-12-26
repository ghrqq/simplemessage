import React from "react";
import { Link } from "@reach/router";
import Search from "./Search";

const Navigation = (props) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/discover">Discover</Link>
        </li>
        <li>
          <button onClick={() => props.logOutCallback()}>Clear User</button>
        </li>
        <li>
          <Search />
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
