import React, { useState, useContext } from "react";
import PostFooter from "./PostFooter";
import Voter from "./Voter";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";

import UserDetails from "./UserDetails";

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
  const [isUserDetailsOpen, setisUserDetailsOpen] = useState(false);
  const [user, setuser] = useContext(UserContext);

  const {
    _id,
    creatorName,
    message,
    date,
    creatorId,
    rate,
    rateBadge,
  } = props.post;

  const displayVar = isHidden ? "none" : null;
  const displayDetails = !showDetails ? "none" : null;
  const displayShare = !showShare ? "none" : null;
  const displayRate = !showrate ? "none" : null;

  const hideRate = () => {
    setshowrate(false);
  };

  const handleMouseOnUserDetails = () => {
    setisUserDetailsOpen(!isUserDetailsOpen);
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
  };

  return (
    <div
      className="single-post-container"
      style={{ display: displayVar }}
      key={_id}
    >
      <div className="post-bar">
        <div className="rate">Rating: {rate}</div>
        <div className="post-buttons">
          {user.id === creatorId ? (
            <DeleteIcon
              style={{ fontSize: "25", color: "red" }}
              onClick={() => deletePost()}
            />
          ) : (
            <DeleteIcon
              style={{ fontSize: "25" }}
              onClick={() => setisHidden(true)}
            />
          )}
          {!showrate ? (
            <StarHalfIcon
              style={{ fontSize: "25" }}
              onClick={() => setshowrate(!showrate)}
            />
          ) : (
            <React.Fragment>
              <StarHalfIcon
                style={{ fontSize: "25" }}
                onClick={() => setshowrate(!showrate)}
              />
              <Voter
                postId={_id}
                creatorId={creatorId}
                hideRate={hideRate}
                defRate={rate}
              />
            </React.Fragment>
          )}
        </div>
        {/* {!showDetails ? (
          <ExpandMoreIcon
            style={{ textAlign: "right" }}
            onClick={() => setshowDetails(!showDetails)}
          />
        ) : (
          <UnfoldMoreIcon
            style={{ textAlign: "right" }}
            onClick={() => setshowDetails(!showDetails)}
          />
        )} */}
        {!rateBadge ? null : rateBadge === "best" ? (
          <ThumbUpIcon color="green" />
        ) : (
          <ThumbDownIcon color="red" />
        )}
        {/* <div style={{ display: displayDetails }} className="post-detail"> */}
        {!showShare ? (
          <ShareIcon
            style={{ fontSize: "25" }}
            onClick={() => setshowShare(!showShare)}
          />
        ) : (
          <React.Fragment>
            <ShareIcon
              style={{ fontSize: "25" }}
              onClick={() => setshowShare(!showShare)}
            />
            <PostFooter />
          </React.Fragment>
        )}
      </div>
      {/* </div> */}

      <div className="post">{message}</div>
      <div className="post-footer">
        <div className="inline-container">
          <UserDetails
            content={message}
            name={creatorName ? creatorName : "Top-Secret"}
            id={creatorId}
          />
        </div>
      </div>
    </div>
  );
};

export default Posts;
