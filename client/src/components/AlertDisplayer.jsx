import React, { useState, useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";

const AlertDisplayer = (props) => {
  const { open, message, status } = props;
  const [isOpen, setisOpen] = useState(open);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setisOpen(false);
  };

  useEffect(() => {
    setisOpen(true);
    return () => {};
  }, [message]);
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={isOpen}
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
  );
};

export default AlertDisplayer;
