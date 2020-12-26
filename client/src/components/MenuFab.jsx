import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Search from "./Search";
import { Link } from "@reach/router";

const MenuFab = (props) => {
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
      {/* <Button aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
        Open with fade transition
      </Button> */}
      <Fab
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
          <Link to="/">Home</Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link to="/discover">Discover</Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          {" "}
          <button onClick={() => props.logOutCallback()}>Clear User</button>
        </MenuItem>
        <MenuItem>
          <AddIcon />
          <Search />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default MenuFab;
