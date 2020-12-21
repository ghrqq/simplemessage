import React from "react";
import PostFooter from "./PostFooter";

const Posts = (props) => {
  const { _id, creatorName, message, date } = props.post;

  return (
    <div className="post-container" key={_id}>
      <div className="single-post-container">
        <div className="post-bar">
          {date}

          {creatorName !== "" ? creatorName : "Anonym"}
        </div>
        <div className="post">{message}</div>
        <div className="post-footer">
          <PostFooter />
        </div>
      </div>
    </div>
  );
};

export default Posts;
