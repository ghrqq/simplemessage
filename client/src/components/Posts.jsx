import React, { useState, useContext } from "react";
import PostFooter from "./PostFooter";
import Voter from "./Voter";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import PostButtons from "./PostButtons";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import hashTagConverter from "../tools/hashTagConverter";

// import shit from "../adimgs/freecodecamp.jpeg";

import UserDetails from "./UserDetails";

import DeleteIcon from "@material-ui/icons/Delete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import PersonIcon from "@material-ui/icons/Person";
import ShareIcon from "@material-ui/icons/Share";
import StarHalfIcon from "@material-ui/icons/StarHalf";
import { UserContext } from "../App";
import { Rating } from "semantic-ui-react";

const Posts = (props) => {
  const [isHidden, setisHidden] = useState(false);
  const [image, setimage] = useState("");
  const [showDetails, setshowDetails] = useState(false);
  const [showShare, setshowShare] = useState(false);
  const [showrate, setshowrate] = useState(false);
  const [rateValue, setrateValue] = useState(props.rate);
  const [isUserDetailsOpen, setisUserDetailsOpen] = useState(false);
  const [user, setuser] = useContext(UserContext);
  const [isButton, setisButton] = useState(false);
  const displayVar = isHidden ? "none" : "grid";
  const {
    _id,
    creatorName,
    message,
    date,
    creatorId,
    rate,
    rateBadge,
    link,
    isAd,
    imgPath,
    alias,
    hashtags,
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

  if (isAd && isAd === true) {
    // import(imgPath).then((img) => setimage(img));

    const postImage = require(`${imgPath}`);

    return (
      <div
        className="grid-container"
        style={{ display: displayVar }}
        key={_id}
        onMouseEnter={handleMouse}
        onMouseLeave={handleMouse}
      >
        <a
          href={link}
          target="_blank"
          style={{ color: "white", textDecoration: "none" }}
        >
          <div className="post-body">
            <img src={postImage.default} />
            <h4 style={{ color: "white" }}>{alias}</h4>

            <p
              style={{
                fontSize:
                  message.length < 150
                    ? "1.2em"
                    : message.length > 400
                    ? "0.8em"
                    : null,
                textJustify: "justify",
                padding: "5px 15px",
                margin: "auto",
              }}
            >
              {message}
            </p>
          </div>
        </a>
      </div>
    );
  } else {
    return (
      <div
        className="grid-container"
        style={{ display: displayVar }}
        key={_id}
        onMouseEnter={handleMouse}
        onMouseLeave={handleMouse}
      >
        <div style={{ gridColumn: 1, gridRow: 1 }}>
          {/* <PostButtons /> */}
          <div className="post-button-body">
            {/* <Voter postId={_id} creatorId={creatorId} defRate={rate} /> */}
            {isButton ? (
              <Voter postId={_id} creatorId={creatorId} defRate={rate} />
            ) : null}

            <UserDetails
              content={message}
              name={creatorName ? creatorName : "Top-Secret"}
              id={creatorId}
            />
            <PostFooter id={_id} message={message} hashtags={hashtags} />
            {user.id === creatorId ? (
              <div className="post-button-delete" onClick={() => deletePost()}>
                {" "}
                DELETE
              </div>
            ) : (
              <div
                className="post-button-remove"
                onClick={() => setisHidden(true)}
              >
                {" "}
                REMOVE
              </div>
            )}
          </div>
        </div>
        <div
          style={{ gridColumn: 1, gridRow: 1 }}
          className={isButton ? "post-body blurred indexed" : "post-body"}
        >
          <div className="post-first-buttons">
            <div className="post-first-expand">
              <ButtonGroup
                size="small"
                aria-label="small outlined button group"
              >
                <Button>
                  <ExpandMoreIcon
                    style={{
                      color: "white",
                      // margin: "0.3em auto 0 auto",
                      fontSize: "35",
                    }}
                  />
                </Button>
                <Button>
                  <StarHalfIcon style={{ fontSize: "25", color: "white" }} />{" "}
                  <div style={{ color: "white", fontSize: "1em" }}>{rate}</div>
                </Button>
              </ButtonGroup>

              {/* <div className="post-first-rest"></div> */}
            </div>
          </div>

          <div className="post-text">
            <p
              style={{
                fontSize:
                  message.length < 150
                    ? "1.2em"
                    : message.length > 400
                    ? "0.8em"
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
  }
};

export default Posts;
