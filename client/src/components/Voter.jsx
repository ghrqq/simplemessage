import React, { useState, useContext } from "react";
import { UserContext } from "../App";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import SaveIcon from "@material-ui/icons/Save";
import { Rating } from "primereact/rating";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const Voter = (props) => {
  const [user] = useContext(UserContext);
  const [status, setstatus] = useState(200);
  const [rate, setrate] = useState(0);
  const [open, setOpen] = useState(false);
  const [message, setmessage] = useState("No action to show here yet!");
  const color = rate >= 0 ? "green" : "red";

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const sendRate = async () => {
    const data = {
      postid: props.postId,
      rate,
      postCreatorId: props.creatorId,
      userIp: user.userIp,
    };
    console.log(data);
    const result = await (
      await fetch("http://localhost:4000/ratemessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })
    ).json();

    setstatus(result.status);
    if (result.message) {
      setmessage(result.message);

      setOpen(true);
      setTimeout(() => {
        props.hideRate();
      }, 3000);
    }
  };

  return (
    <div>
      <Rating
        value={rate}
        onChange={(e) => setrate(e.value)}
        cancel={false}
        stars={5}
      />

      <SaveIcon onClick={() => sendRate()} />
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={
          <React.Fragment>
            {status === 200 ? (
              <ThumbUpIcon style={{ color: "green" }} />
            ) : (
              <ThumbDownIcon style={{ color: "red" }} />
            )}
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
};

export default Voter;
