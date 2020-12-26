import React, { useState, useContext } from "react";
import PostFooter from "./PostFooter";
import Voter from "./Voter";

import DeleteIcon from "@material-ui/icons/Delete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import PersonIcon from "@material-ui/icons/Person";
import ShareIcon from "@material-ui/icons/Share";
import StarHalfIcon from "@material-ui/icons/StarHalf";
import { UserContext } from "../App";

const Posts = (props) => {
  const [isHidden, setisHidden] = useState(false);
  const [showDetails, setshowDetails] = useState(false);
  const [showShare, setshowShare] = useState(false);
  const [showrate, setshowrate] = useState(false);
  const [user, setuser] = useContext(UserContext);

  const { _id, creatorName, message, date, creatorId } = props.post;

  const displayVar = isHidden ? "none" : null;
  const displayDetails = !showDetails ? "none" : null;
  const displayShare = !showShare ? "none" : null;
  const displayRate = !showrate ? "none" : null;

  const hideRate = () => {
    setshowrate(false);
  };

  const deletePost = async () => {
    const result = await (
      await fetch("http://localhost:4000/deletepost", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          postId: _id,
        }),
      })
    ).json();
    if (result.status === 200) {
      setisHidden(true);
    }
    console.log(result);
  };

  return (
    <div
      className="single-post-container"
      style={{ display: displayVar }}
      key={_id}
    >
      <div className="post-bar">
        {user.id === creatorId ? (
          <DeleteIcon
            fontSize="small"
            style={{ textAlign: "left", color: "red" }}
            onClick={() => deletePost()}
          />
        ) : (
          <DeleteIcon
            fontSize="small"
            style={{ textAlign: "left" }}
            onClick={() => setisHidden(true)}
          />
        )}
        {!showrate ? (
          <StarHalfIcon onClick={() => setshowrate(!showrate)} />
        ) : (
          <React.Fragment>
            <StarHalfIcon onClick={() => setshowrate(!showrate)} />
            <Voter postId={_id} creatorId={creatorId} hideRate={hideRate} />
          </React.Fragment>
        )}
        {!showDetails ? (
          <ExpandMoreIcon
            style={{ textAlign: "right" }}
            onClick={() => setshowDetails(!showDetails)}
          />
        ) : (
          <UnfoldMoreIcon
            style={{ textAlign: "right" }}
            onClick={() => setshowDetails(!showDetails)}
          />
        )}
      </div>
      <div style={{ display: displayDetails }} className="post-detail">
        {!showShare ? (
          <ShareIcon onClick={() => setshowShare(!showShare)} />
        ) : (
          <React.Fragment>
            <ShareIcon onClick={() => setshowShare(!showShare)} />
            <PostFooter />
          </React.Fragment>
        )}
      </div>
      <div className="post">{message}</div>
      <div className="post-footer">
        <PersonIcon
          style={{ display: "inline-block", verticalAlign: "middle" }}
        />{" "}
        <div style={{ display: "inline-block", verticalAlign: "middle" }}>
          {creatorName ? creatorName : "Top-Secret"}
        </div>
      </div>
    </div>
  );
};

export default Posts;
