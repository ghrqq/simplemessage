import React from "react";
import StarIcon from "@material-ui/icons/Star";
import AddIcon from "@material-ui/icons/Add";
import LabelIcon from "@material-ui/icons/Label";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

const UserSummary = (props) => {
  const { totalPosts, totalHashtags, bestRate, worstRate, userRate } = props;

  return (
    <div className="user-summary" style={{ color: "white" }}>
      <div className="user-rating">
        <h2>Overall Rating</h2>
        <StarIcon style={{ fontSize: "60", color: "orange" }} />
        <h2>{userRate}</h2>
      </div>
      <div className="user-tops">
        <div className="testbox">
          <AddIcon style={{ fontSize: "40", color: "orange" }} />
          <h4>Total Posts</h4>
          <br />
          {totalPosts ? totalPosts : NaN}
        </div>
        <div className="testbox">
          <LabelIcon style={{ fontSize: "40", color: "orange" }} />{" "}
          <h4>Total Hashtags</h4>
          <br />
          {totalHashtags ? totalHashtags : NaN}
        </div>
        <div className="testbox">
          <ArrowUpwardIcon style={{ fontSize: "40", color: "orange" }} />{" "}
          <h4>Best Rate</h4>
          <br />
          {bestRate ? bestRate : NaN}
        </div>
        <div className="testbox">
          <ArrowDownwardIcon style={{ fontSize: "40", color: "orange" }} />
          <h4>Worst Rate</h4>
          <br />
          {worstRate || worstRate === 0 ? worstRate : NaN}
        </div>
      </div>
      <div className="user-numbers"></div>
    </div>
  );
};

export default UserSummary;
