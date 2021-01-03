import React, { useState } from "react";
import { Link } from "@reach/router";
import hashTagConverter from "../tools/hashTagConverter";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import useWindowDimensions from "../tools/getWindowDimensions";

const HashTagSlider = (props) => {
  const [step, setstep] = useState(5);
  const [elementStep, setelementStep] = useState(0);
  const { hashTags } = props;
  const { height, width } = useWindowDimensions();

  const font = width < 800 ? "1em" : "1.3em";

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
    <div className="hashtag-slider">
      <KeyboardArrowLeftIcon
        onClick={() => handleArrows(-5)}
        style={{
          display: "inline-block",
          verticalAlign: "middle",
          fontSize: font,
          color: "rgba(225, 162, 0, 1)",
          cursor: "pointer",
          marginRight: font,
        }}
      />
      <ButtonGroup
        size="large"
        variant="text"
        aria-label="text primary button group"
        style={{
          display: "inline-block",
          verticalAlign: "middle",
          fontSize: font,
        }}
      >
        {hashTags.slice(step - 5, step).map((item) => (
          <Link
            className="Link"
            to={`/hashtag/${hashTagConverter(item, "percent")}`}
          >
            <Button
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                fontSize: font,
                color: "rgba(225, 162, 0, 1)",
              }}
            >
              {hashTagConverter(item, "pound")}
            </Button>
          </Link>
        ))}
      </ButtonGroup>

      <KeyboardArrowRightIcon
        onClick={() => handleArrows(5)}
        style={{
          display: "inline-block",
          verticalAlign: "middle",
          color: "rgba(225, 162, 0, 1)",
          fontSize: font,
          cursor: "pointer",

          marginLeft: font,
        }}
      />
    </div>
  );
};

export default HashTagSlider;
