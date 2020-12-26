import "./App.css";
import { Router, navigate } from "@reach/router";
import React, { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import Discover from "./pages/Discover";
import Home from "./pages/Home";
import Hashtag from "./pages/Hashtag";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";

import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { union } from "lodash";
import hashTagConverter from "./tools/hashTagConverter";
import Cookies from "js-cookie";
import CreateMessage from "./components/CreateMessage";
import MainSkeleton from "./components/MainSkeleton";
import HashTagContainer from "./components/HashTagContainer";
import HashTagSlider from "./components/HashTagSlider";
import MenuFab from "./components/MenuFab";

export const UserContext = React.createContext([]);
export const PostContext = React.createContext([]);

function App() {
  const [user, setuser] = useState({});
  const [userToken, setuserToken] = useState(Cookies.get());
  const [posts, setposts] = useState({});
  const [loading, setloading] = useState(true);
  const [isIpLoading, setisIpLoading] = useState(true);
  const [ip, setip] = useState("");
  const [userLoc, setuserLoc] = useState({});
  const [isAgreed, setisAgreed] = useState(true);
  const [isCMOpen, setisCMOpen] = useState(false);
  const [incr, setincr] = useState(1);
  const [selectedHashtag, setselectedHashtag] = useState("");
  const [message, setmessage] = useState("");
  const [hashtags, sethashtags] = useState([
    "#Motivational",
    "#Inspiring",
    "#Creative",
  ]);

  const logOutCallback = async () => {
    await fetch("http://localhost:4000/clearuser", {
      method: "POST",
      credentials: "include",
    });
    // Clear user from context
    setuser({});
    // Navigate back to homepage
    navigate("/");
  };

  useEffect(() => {
    async function getUserGeolocationDetails() {
      const result = await (
        await fetch(
          "https://geolocation-db.com/json/09ba3820-0f88-11eb-9ba6-e1dd7dece2b8"
        )
      ).json();
      if (!result) {
        window.alert(
          "Looks like we cannot get your IP. This may be prevented by your adBlocker or browser(Brave and Opera). Please change configurations or prepare yourself to have a silly experience with this page."
        );
      }
      setuserLoc(result);
      setip(result.IPv4);
      setisIpLoading(false);
    }

    getUserGeolocationDetails();
  }, []);

  useEffect(() => {
    async function getUserId() {
      const result = await (
        await fetch("http://localhost:4000/checkuserid", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();

      setuser({
        id: result.id,
        name: result.name,
        ip: ip,
        favoriteHashtags: result.favoriteHashtags,
        isAgreed: result.isAgreed,
      });
    }
    getUserId();
  }, []);

  useEffect(() => {
    async function getByHashTag() {
      if (selectedHashtag === "") {
        return;
      }

      setloading(true);
      const param = hashTagConverter(selectedHashtag);
      const result = await (
        await fetch(`http://localhost:4000/getbyhashtag/${param}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();

      if (result.message) {
        setmessage(result.message);
      }

      setposts(result);
      setloading(false);
      const hastArr = result.map((item) => item.hashtags);
      const hastArrMerged = union(...hastArr);

      sethashtags(hastArrMerged);
    }

    getByHashTag();
  }, [selectedHashtag]);

  useEffect(() => {
    async function getPosts() {
      const result = await (
        await fetch("http://localhost:4000/getrandom", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "x-www-form-urlencoded",
          },
        })
      ).json();
      setposts(result);
      setloading(false);
      const hastArr = result.map((item) => item.hashtags);
      const hastArrMerged = union(...hastArr);

      sethashtags(hastArrMerged);
    }
    getPosts();
  }, []);

  if (loading) return <MainSkeleton />;

  return (
    <UserContext.Provider value={[user, setuser]}>
      <PostContext.Provider value={[posts, setposts]}>
        <div className="App">
          {/* <Navigation logOutCallback={logOutCallback} /> */}

          <div className="hashtag-container">
            {/* <KeyboardArrowLeftIcon
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
            </ButtonGroup> */}
            <HashTagSlider hashTags={hashtags} />
            {/* <KeyboardArrowRightIcon
              style={{ display: "inline-block", verticalAlign: "middle" }}
            /> */}
          </div>

          <div>
            <Router id="router">
              <Home path="/" />
              <Discover path="/discover" />
              <Hashtag path="/hashtag/:tagpercent" />
            </Router>
          </div>

          <div className="fab" style={{ position: "fixed" }}>
            <MenuFab logOutCallback={logOutCallback} />
            <CreateMessage isOpen={isCMOpen} />
          </div>
        </div>
      </PostContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
