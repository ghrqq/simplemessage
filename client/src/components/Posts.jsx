import React, { useState, useContext } from "react";
import PostFooter from "./PostFooter";
import Voter from "./Voter";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import PostButtons from "./PostButtons";

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
  const [isButton, setisButton] = useState(false);

  const {
    _id,
    creatorName,
    message,
    date,
    creatorId,
    rate,
    rateBadge,
  } = props.post;

  const handleMouseOnUserDetails = () => {
    setisUserDetailsOpen(!isUserDetailsOpen);
  };

  const handleMouse = () => {
    setisButton(!isButton);
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
      className="grid-container"
      style={{ display: "grid" }}
      key={_id}
      onMouseEnter={handleMouse}
      onMouseLeave={handleMouse}
    >
      <div style={{ gridColumn: 1, gridRow: 1 }}>
        {/* <PostButtons /> */}
        <div className="post-button-body">
          <Voter postId={_id} creatorId={creatorId} defRate={rate} />

          <UserDetails
            content={message}
            name={creatorName ? creatorName : "Top-Secret"}
            id={creatorId}
          />
          <PostFooter />
        </div>
      </div>
      <div
        style={{ gridColumn: 1, gridRow: 1 }}
        className={isButton ? "post-body blurred indexed" : "post-body"}
      >
        <div className="post-first-buttons">
          <div className="post-first-expand">
            <ExpandMoreIcon
              style={{
                color: "white",
                // margin: "0.3em auto 0 auto",
                fontSize: "35",
              }}
            />
            <div className="post-first-rest">
              <StarHalfIcon style={{ fontSize: "25", color: "white" }} /> {rate}
            </div>
          </div>
        </div>

        <div className="post-text">
          <p
            style={{
              fontSize:
                message.length < 150
                  ? "1.2em"
                  : message.length > 400
                  ? "0.7em"
                  : null,
            }}
          >
            {message}
          </p>
        </div>
      </div>
      {/* <PostButtons /> */}
    </div>
  );
};

export default Posts;
