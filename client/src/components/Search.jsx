import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "@reach/router";
import hashTagConverter from "../tools/hashTagConverter";

const Search = ({ handleClose }) => {
  const [searchParams, setsearchParams] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [picked, setpicked] = useState("");

  useEffect(() => {
    async function getParams() {
      const result = await (
        await fetch("/api/getsearchparams", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();

      setsearchParams(result.tags);
      setisLoading(false);
    }
    getParams();
  }, []);

  return (
    // <div className="search-box">
    <div>
      {isLoading === true ? (
        <CircularProgress size="20" />
      ) : (
        <Autocomplete
          className="Autocomplete"
          id="search"
          disableClearable
          onChange={(event, newValue) => {
            setpicked(newValue);
          }}
          onInputChange={(event, newInputValue) => {
            setpicked(newInputValue);
          }}
          options={searchParams.map((option) => option)}
          renderInput={(params) => (
            <div>
              <div style={{ display: "inline-block", width: "10em" }}>
                <TextField
                  className="Autocomplete"
                  {...params}
                  // label="Search input"
                  // variant="outlined"
                  fullWidth
                  InputProps={{ ...params.InputProps, type: "search" }}
                  placeholder="Search..."
                />
              </div>
            </div>
          )}
        />
      )}
      <div style={{ display: "inline-block", color: "white" }}>
        <Link
          className="Link"
          to={`/hashtag/${hashTagConverter(picked, "percent")}`}
          onClick={handleClose}
        >
          <IconButton type="submit" className="search-icon" aria-label="search">
            <SearchIcon size="60" />
          </IconButton>
        </Link>
      </div>
    </div>
  );
};

export default Search;
