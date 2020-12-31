import "./App.css";
import { Router, navigate } from "@reach/router";
import React, { useEffect, useState } from "react";

import Discover from "./pages/Discover";
import Home from "./pages/Home";
import Hashtag from "./pages/Hashtag";
import UserMessages from "./pages/UserMessages";
import FAQ from "./pages/FAQ";
import Profile from "./pages/Profile";
import GetBack from "./pages/GetBack";

import { union } from "lodash";
import hashTagConverter from "./tools/hashTagConverter";
import Cookies from "js-cookie";
import CreateMessage from "./components/CreateMessage";
import MainSkeleton from "./components/MainSkeleton";
import AlertDisplayer from "./components/AlertDisplayer";

import HashTagSlider from "./components/HashTagSlider";
import MenuFab from "./components/MenuFab";

export const UserContext = React.createContext([]);
export const PostContext = React.createContext([]);
export const RefreshContext = React.createContext([]);
export const RefreshByEntryContext = React.createContext([]);

function App() {
  const [user, setuser] = useState({});
  const [refresh, setrefresh] = useState(0);
  const [refreshByEntry, setrefreshByEntry] = useState(0);
  // const [userToken, setuserToken] = useState(Cookies.get());
  const [posts, setposts] = useState({});
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

  const logOutCallback = async () => {
    const result = await (
      await fetch("http://localhost:4000/clearuser", {
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

  useEffect(() => {
    async function getPosts() {
      const result = await (
        await fetch(`http://localhost:4000/getrandom/20/0`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "x-www-form-urlencoded",
          },
        })
      ).json();
      setposts(result.posts);
      setcount(parseInt(result.count));
      setloading(false);
      const hastArr = result.posts.map((item) => item.hashtags);
      const hastArrMerged = union(...hastArr);

      sethashtags(hastArrMerged);
    }
    getPosts();
  }, [refreshByEntry]);

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

    const result = await (
      await fetch(`http://localhost:4000/getrandom/${sumlim}/${sumskip}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "x-www-form-urlencoded",
        },
      })
    ).json();
    setposts([...posts, ...result.posts]);
    setloading(false);
    const hastArr = posts.map((item) => item.hashtags);
    const hastArrMerged = union(...hastArr);

    sethashtags(hastArrMerged);
    // window.scrollTo(0, 150);
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
        await fetch("http://localhost:4000/checkuserid", {
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

  // useEffect(() => {
  //   async function getByHashTag() {
  //     if (selectedHashtag === "") {
  //       return;
  //     }

  //     setloading(true);
  //     const param = hashTagConverter(selectedHashtag);
  //     const result = await (
  //       await fetch(`http://localhost:4000/getbyhashtag/${param}`, {
  //         method: "GET",
  //         credentials: "include",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       })
  //     ).json();

  //     if (result.message) {
  //       setmessage(result.message);
  //     }

  //     setposts(result);
  //     setloading(false);
  //     const hastArr = result.map((item) => item.hashtags);
  //     const hastArrMerged = union(...hastArr);

  //     sethashtags(hastArrMerged);
  //   }

  //   getByHashTag();
  // }, [selectedHashtag]);

  if (loading) return <MainSkeleton />;

  return (
    <UserContext.Provider value={[user, setuser]}>
      <PostContext.Provider value={[posts, setposts]}>
        <RefreshContext.Provider value={[refresh, setrefresh]}>
          <RefreshByEntryContext.Provider
            value={[refreshByEntry, setrefreshByEntry]}
          >
            <div className="App">
              <div className="hashtag-container">
                <HashTagSlider hashTags={hashtags} />
              </div>
              <div>
                <Router id="router">
                  <Home
                    path="/"
                    limitHandler={handleLimitChange}
                    limit={limit}
                    count={count}
                  />
                  <Discover path="/discover" />
                  <Hashtag path="/hashtag/:tagpercent" />
                  <UserMessages path="/usermessages/:id" />
                  <Profile path="/myprofile" />
                  <GetBack path="/getbackmyaccount" />

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
