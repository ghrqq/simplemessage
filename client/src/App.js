import "./App.css";
import { Router, navigate } from "@reach/router";
import React, { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import Discover from "./pages/Discover";
import Home from "./pages/Home";

import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { union } from "lodash";
import hashTagConverter from "./tools/hashTagConverter";
import Cookies from "js-cookie";
import CreateMessage from "./components/CreateMessage";

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
      if (ip === "") {
        return;
      }

      const result = await (
        await fetch("http://localhost:4000/getuserid", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userIp: ip,
            isAgreed,
          }),
        })
      ).json();

      setuser({
        id: result.id,
        userIp: ip,
      });
      // if (result.id !== "") {
      //   window.alert(
      //     "Welcome back! Would you like to share your name with us?"
      //   );
      // }
    }
    getUserId();
  }, [ip]);

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

  if (loading) return <div>Loading...</div>;

  return (
    <UserContext.Provider value={[user, setuser]}>
      <PostContext.Provider value={[posts, setposts]}>
        <div className="App">
          <Navigation logOutCallback={logOutCallback} />

          <div className="hashtag-container">
            <KeyboardArrowLeftIcon />

            {hashtags.map((item) => (
              <button
                value={item}
                onClick={(e) => setselectedHashtag(e.target.value)}
              >
                {item}
              </button>
            ))}

            <KeyboardArrowRightIcon />
          </div>
          {console.log(userToken)}
          <Router id="router">
            <Home path="/" />
            <Discover path="/discover" />
          </Router>
          <div className="fab">
            <CreateMessage isOpen={isCMOpen} />
          </div>
        </div>
      </PostContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
