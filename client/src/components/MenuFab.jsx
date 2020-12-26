import React, { useState, useContext } from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Search from "./Search";
import { Link } from "@reach/router";
import { UserContext } from "../App";

const MenuFab = (props) => {
  const [user] = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Fab
        style={{ backgroundColor: "#007f5f" }}
        aria-controls="fade-menu"
        aria-haspopup="true"
        onClick={handleClick}
        color="primary"
        variant="extended"
        size="medium"
        color="primary"
        aria-label="add"
        onClick={handleClick}
      >
        <AddIcon /> Menu
      </Fab>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        paper
      >
        <MenuItem onClick={handleClose}>
          <Link className="Link" to="/">
            Home
          </Link>
        </MenuItem>
        {/* <MenuItem onClick={handleClose}>
          <Link className="Link" to="/discover">
            Discover
          </Link>
        </MenuItem> */}
        <MenuItem>
          {user.id ? (
            <Link className="Link" to="/myprofile">
              My Profile
            </Link>
          ) : (
            <Link className="Link" to="/register:)">
              Register/Login
            </Link>
          )}
        </MenuItem>
        <MenuItem onClick={handleClose}>
          {" "}
          {user.id ? (
            <Button color="secondary" onClick={() => props.logOutCallback()}>
              Destroy Account
            </Button>
          ) : (
            <Link className="Link" to="/getbackmyaccount">
              Get My Account Back
            </Link>
          )}
        </MenuItem>
        <MenuItem>
          <Search />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default MenuFab;
