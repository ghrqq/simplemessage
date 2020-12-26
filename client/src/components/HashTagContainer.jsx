import React, { useState } from "react";
import Chip from "@material-ui/core/Chip";
import { Link } from "@reach/router";
import hashTagConverter from "../tools/hashTagConverter";
import Button from "@material-ui/core/Button";

const HashTagContainer = (props) => {
  return (
    <Link to={`/hashtag/${props.hashTagPercent}`}>
      <Button
        style={{ display: "inline-block", verticalAlign: "middle" }}

        // onClick={(e) => setselectedHashtag(item)}
      >
        {props.hashTagPound}
      </Button>
    </Link>
  );
};

export default HashTagContainer;
