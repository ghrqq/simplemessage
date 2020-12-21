import "./App.css";
import { Router, navigate } from "@reach/router";
import React, { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import Discover from "./pages/Discover";
import Home from "./pages/Home";
// import { urlencoded } from "body-parser";

export const UserContext = React.createContext([]);
export const PostContext = React.createContext([]);

function App() {
  const [user, setuser] = useState({});
  const [posts, setposts] = useState({});
  const [loading, setloading] = useState(true);
  const [isIpLoading, setisIpLoading] = useState(true);
  const [ip, setip] = useState("");
  const [userLoc, setuserLoc] = useState({});
  const [isAgreed, setisAgreed] = useState(true);

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
      setuser(result);
    }
    getUserId();
  }, [ip]);

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
    }
    getPosts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <UserContext.Provider value={[user, setuser]}>
      <PostContext.Provider value={[posts, setposts]}>
        <div className="App">
          <Navigation />
          <Router id="router">
            <Home path="/" />
            <Discover path="/discover" />
          </Router>
        </div>
      </PostContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
