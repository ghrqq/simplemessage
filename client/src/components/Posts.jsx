import React, { useState } from "react";
import PostFooter from "./PostFooter";
import Voter from "./Voter";

const Posts = (props) => {
  const { _id, creatorName, message, date, creatorId } = props.post;

  return (
    <div className="single-post-container" key={_id}>
      <div className="post-bar">
        {date}

        {creatorName !== "" ? creatorName : "Anonym"}
        <br />
        <Voter postId={_id} creatorId={creatorId} />
        <button>&times;</button>
      </div>
      <div className="post">{message}</div>
      <div className="post-footer">
        <PostFooter />
      </div>
    </div>
  );
};

export default Posts;
