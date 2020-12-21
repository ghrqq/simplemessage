import React from "react";
import { Link } from "@reach/router";

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
        <button onClick={() => props.logOutCallback()}>Clear User</button>
      </ul>
    </nav>
  );
};

export default Navigation;
