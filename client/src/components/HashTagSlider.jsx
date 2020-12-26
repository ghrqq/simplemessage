import React, { useState } from "react";
import { Link } from "@reach/router";
import hashTagConverter from "../tools/hashTagConverter";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";

const HashTagSlider = (props) => {
  const [step, setstep] = useState(5);
  const [elementStep, setelementStep] = useState(0);
  const { hashTags } = props;

  const handleArrows = (num) => {
    if (num < 0) {
      if (step + num >= 5) {
        setstep(step + num);
      }
    }
    if (num > 0) {
      if (num + step <= hashTags.length + Math.abs((hashTags.length % 5) - 5)) {
        setstep(step + num);
      }
    }
  };

  return (
    <div>
      {console.log(
        hashTags.length,
        hashTags.length + Math.abs((hashTags.length % 5) - 5)
      )}
      <KeyboardArrowLeftIcon
        onClick={() => handleArrows(-5)}
        style={{ display: "inline-block", verticalAlign: "middle" }}
      />
      <ButtonGroup
        size="small"
        variant="text"
        aria-label="text primary button group"
        style={{ display: "inline-block", verticalAlign: "middle" }}
      >
        {hashTags.slice(step - 5, step).map((item) => (
          <Link to={`/hashtag/${hashTagConverter(item, "percent")}`}>
            <Button
              style={{ display: "inline-block", verticalAlign: "middle" }}
            >
              {hashTagConverter(item, "pound")}
            </Button>
          </Link>
        ))}
      </ButtonGroup>

      <KeyboardArrowRightIcon
        onClick={() => handleArrows(5)}
        style={{ display: "inline-block", verticalAlign: "middle" }}
      />
    </div>
  );
};

export default HashTagSlider;
{
  /* <KeyboardArrowLeftIcon
              style={{ display: "inline-block", verticalAlign: "middle" }}
            />
            <ButtonGroup
              size="small"
              variant="text"
              aria-label="text primary button group"
              style={{ display: "inline-block", verticalAlign: "middle" }}
            >
              {hashtags.map((item) => (
                <HashTagContainer
                  hashTagPercent={hashTagConverter(item, "percent")}
                  hashTagPound={hashTagConverter(item, "pound")}
                />
              ))}
            </ButtonGroup>
             <HashTagSlider hashTags={hashtags} /> 
            <KeyboardArrowRightIcon
              style={{ display: "inline-block", verticalAlign: "middle" }}
            /> */
}
