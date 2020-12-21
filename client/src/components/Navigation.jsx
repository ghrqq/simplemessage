import React from "react";
import { Link } from "@reach/router";

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/discover">Discover</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
