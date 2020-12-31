import Posts from "../components/Posts";
import React, { useEffect, useState, useContext } from "react";
import { UserContext, PostContext } from "../App";
import VisibilitySensor from "react-visibility-sensor";

const Home = (props) => {
  const [user] = useContext(UserContext);
  const [post] = useContext(PostContext);

  return (
    <div className="component-container">
      <div className="post-container">
        {post === {} ? (
          <div>Loading...</div>
        ) : (
          post.map((item) => <Posts post={item} />)
        )}
      </div>
      {props.limit < props.count ? (
        <VisibilitySensor onChange={props.limitHandler}>
          <div
            onClick={props.limitHandler}
            style={{ fontSize: "1em", backgroundColor: "magenta" }}
          >
            Load More
          </div>
        </VisibilitySensor>
      ) : (
        <h2>You have seen all!</h2>
      )}
    </div>
  );
};

export default Home;
