import React from "react";
import StarIcon from "@material-ui/icons/Star";
import AddIcon from "@material-ui/icons/Add";
import LabelIcon from "@material-ui/icons/Label";

const UserSummary = (props) => {
  const { totalPosts, totalHashtags, bestRate, worstRate } = props;

  return (
    <div className="user-summary">
      <div className="user-rating">
        <StarIcon style={{ fontSize: "60", color: "orange" }} />
      </div>
      <div className="user-tops">
        <div className="testbox">
          <AddIcon style={{ fontSize: "40" }} />
          <h4>Total Posts</h4>
          <br />
          {totalPosts ? totalPosts : NaN}
        </div>
        <div className="testbox">
          <LabelIcon style={{ fontSize: "40" }} /> <h4>Total Hashtags</h4>
          <br />
          {totalHashtags ? totalHashtags : NaN}
        </div>
        <div className="testbox">
          <LabelIcon style={{ fontSize: "40" }} /> <h4>Best Rate</h4>
          <br />
          {bestRate ? bestRate : NaN}
        </div>
        <div className="testbox">
          <AddIcon style={{ fontSize: "40" }} />
          <h4>Worst Rate</h4>
          <br />
          {worstRate ? worstRate : NaN}
        </div>
      </div>
      <div className="user-numbers"></div>
    </div>
  );
};

export default UserSummary;
