import "./App.css";
import { Router, navigate } from "@reach/router";
import React, { useEffect, useState } from "react";

import About from "./pages/About";
import Home from "./pages/Home";
import Hashtag from "./pages/Hashtag";
import UserMessages from "./pages/UserMessages";
import FAQ from "./pages/FAQ";
import Profile from "./pages/Profile";
import GetBack from "./pages/GetBack";
import ConfirmationLanding from "./pages/ConfirmationLanding";
import SinglePost from "./pages/SinglePost";

import { union } from "lodash";

import CreateMessage from "./components/CreateMessage";
import MainSkeleton from "./components/MainSkeleton";
import AlertDisplayer from "./components/AlertDisplayer";
import ads from "./tools/ads.json";
import adSplicer from "./tools/adSplicer";

import HashTagSlider from "./components/HashTagSlider";
import MenuFab from "./components/MenuFab";
import useWindowDimensions from "./tools/getWindowDimensions";

export const UserContext = React.createContext([]);
export const PostContext = React.createContext([]);
export const RefreshContext = React.createContext([]);
export const RefreshByEntryContext = React.createContext([]);

function App() {
  const [please, setplease] = useState("");
  const [adverts, setAdverts] = useState(ads);
  const [user, setuser] = useState({});
  const [refresh, setrefresh] = useState(0);
  const [refreshByEntry, setrefreshByEntry] = useState(0);
  // const [userToken, setuserToken] = useState(Cookies.get());
  const [hashtagStyles, sethashtagStyles] = useState("hashtag-container");
  const [posts, setposts] = useState([]);
  const [loading, setloading] = useState(true);
  const [limit, setlimit] = useState(20);
  const [skip, setskip] = useState(0);
  const [count, setcount] = useState(20);
  const [isIpLoading, setisIpLoading] = useState(true);
  const [ip, setip] = useState("");
  const [userLoc, setuserLoc] = useState({});
  // const [isAgreed, setisAgreed] = useState(true);
  const [isCMOpen, setisCMOpen] = useState(false);
  const [isAlert, setisAlert] = useState(false);
  const [message, setmessage] = useState("");
  const [status, setstatus] = useState(200);

  // const [selectedHashtag, setselectedHashtag] = useState("");
  const [hashtags, sethashtags] = useState([
    "#Motivational",
    "#Inspiring",
    "#Creative",
  ]);
  const { height, width } = useWindowDimensions();

  const logOutCallback = async () => {
    const result = await (
      await fetch("/api/clearuser", {
        method: "POST",
        credentials: "include",
      })
    ).json();
    // Clear user from context
    setuser({});
    // navigate("/");
    // Navigate back to homepage

    setmessage(result.message);
    setstatus(result.status);

    setisAlert(true);
  };

  // Get first load of posts on initial render.

  useEffect(() => {
    async function getPosts() {
      const result = await (
        await fetch(`/api/getrandom/20/0`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "x-www-form-urlencoded",
          },
        })
      ).json();

      let shadow = [...result.posts];
      const adsSplicedPosts = await adSplicer(shadow, limit, skip, adverts.ads);
      const imagePaths = adverts.ads.map((item) => item.imgPath);

      setposts(adsSplicedPosts);
      setcount(parseInt(result.count));
      setloading(false);
      const hastArr = result.posts.map((item) => item.hashtags);
      const hastArrMerged = union(...hastArr);

      sethashtags(hastArrMerged);
    }
    getPosts();
    window.scrollTo(0, 0);
  }, [refreshByEntry]);

  useEffect(() => {
    async function getPosts() {
      const result = await (
        await fetch(`/api/getrandom/${limit}/${skip}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "x-www-form-urlencoded",
          },
        })
      ).json();

      let shadow = [...result.posts];
      const adsSplicedPosts = await adSplicer(
        shadow,
        limit + 4,
        skip + 4,
        adverts.ads
      );

      setposts([...posts, ...adsSplicedPosts]);
      setloading(false);
      const hastArr = result.posts.map((item) => item.hashtags);
      const hastArrMerged = union(...hastArr);

      sethashtags(hastArrMerged);
    }
    getPosts();
  }, [limit]);

  const handleLimitChange = async () => {
    let sumskip = skip;
    let sumlim = limit;
    if (limit + 20 <= count) {
      sumskip = limit;
      sumlim = limit + 20;
      setskip(sumskip);
      setlimit(sumlim);
    } else {
      sumskip = skip + 20;
      sumlim = count;

      setlimit(sumlim);
      setskip(sumskip);
    }
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
    setTimeout(() => {
      getUserGeolocationDetails();
    }, 5000);
  }, []);

  useEffect(() => {
    async function getUserId() {
      const result = await (
        await fetch("/api/checkuserid", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();
      setmessage(result.message);
      setstatus(result.status);
      setuser({
        id: result.id,
        name: result.name,
        ip: ip,
        favoriteHashtags: result.favoriteHashtags,
        isAgreed: result.isAgreed,
      });
      if (result.message && result.status !== 400) {
        setisAlert(true);
      }
    }

    getUserId();
  }, [refresh]);

  const responsive = width < 800 ? "hashtag-container-s" : "hashtag-container";

  if (loading) return <MainSkeleton />;

  return (
    <UserContext.Provider value={[user, setuser]}>
      <PostContext.Provider value={[posts, setposts]}>
        <RefreshContext.Provider value={[refresh, setrefresh]}>
          <RefreshByEntryContext.Provider
            value={[refreshByEntry, setrefreshByEntry]}
          >
            <div className="App">
              <div className={responsive}>
                <HashTagSlider hashTags={hashtags} />
              </div>
              <div style={{ marginTop: "4em" }}>
                <Router id="router">
                  <Home
                    path="/"
                    limitHandler={handleLimitChange}
                    count={count}
                    limit={limit}
                  />
                  <About path="/about" />
                  <Hashtag path="/hashtag/:tagpercent" />
                  <UserMessages path="/usermessages/:id" />
                  <Profile path="/myprofile" />
                  <GetBack path="/getbackmyaccount" />
                  <SinglePost path="/post/:id" />
                  <ConfirmationLanding path="/confirmation/:code" />

                  <FAQ default />
                </Router>
              </div>
              <AlertDisplayer
                message={message}
                status={status}
                open={isAlert}
              />
              <div className="fab" style={{ position: "fixed" }}>
                <MenuFab logOutCallback={logOutCallback} />

                <CreateMessage isOpen={isCMOpen} />
              </div>
            </div>
          </RefreshByEntryContext.Provider>
        </RefreshContext.Provider>
      </PostContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
