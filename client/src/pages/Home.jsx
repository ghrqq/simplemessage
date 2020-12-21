import Posts from "../components/Posts";
import React, { useEffect, useState, useContext } from "react";
import { UserContext, PostContext } from "../App";

const Home = () => {
  const [user] = useContext(UserContext);
  const [post] = useContext(PostContext);
  return (
    <div className="component-container">
      {post === {} ? (
        <div>Loading...</div>
      ) : (
        post.map((item) => <Posts post={item} />)
      )}
    </div>
  );
};

export default Home;
