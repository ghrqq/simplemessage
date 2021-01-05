import React, { useEffect, useState } from "react";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import PersonIcon from "@material-ui/icons/Person";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "@reach/router";

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: "none",
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

const UserDetails = (props) => {
  const [details, setdetails] = useState("");
  const [isLoading, setisLoading] = useState(true);

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const getUserDetails = async () => {
    setisLoading(true);
    const result = await (
      await fetch(`/api/userprofile/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
    if (result.status === 200) {
      setdetails(result);
      setisLoading(false);
    }
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
    if (details === "") {
      getUserDetails();
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const { content, name, id } = props;

  return (
    <div style={{ textShadow: "3px 3px 5px black" }}>
      <Link className="Link" to={`/usermessages/${id}`}>
        <Typography
          aria-owns={open ? "mouse-over-popover" : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          style={{ color: "white", fontSize: "1.4em", fontFamily: "Oswald" }}
        >
          <PersonIcon
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              fontSize: "30",
              color: "white",
              textShadow: "3px 3px 5px black",
            }}
          />{" "}
          <div className="inline-container">{name}</div>
        </Typography>
      </Link>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <div>
            <Typography>User Rating: {details.rate}</Typography>
            <Typography>Messages: {details.messagesCreated}</Typography>
          </div>
        )}
      </Popover>
    </div>
  );
};

export default UserDetails;
