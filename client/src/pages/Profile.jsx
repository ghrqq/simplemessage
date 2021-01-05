import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import Posts from "../components/Posts";
import HashTagSlider from "../components/HashTagSlider";
import { difference } from "lodash";

import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import StarIcon from "@material-ui/icons/Star";
import AddIcon from "@material-ui/icons/Add";
import LabelIcon from "@material-ui/icons/Label";
import UserSummary from "../components/UserSummary";
import AlertDisplayer from "../components/AlertDisplayer";
import validation from "../tools/validation";
// Prime React

import { InputSwitch } from "primereact/inputswitch";
import ChangeUserDetails from "../components/ChangeUserDetails";

const Profile = () => {
  const [user] = useContext(UserContext);
  const [isLoading, setisLoading] = useState(true);
  const [posts, setposts] = useState([]);
  const [isAlert, setisAlert] = useState(false);
  const [message, setmessage] = useState("");
  const [status, setstatus] = useState(200);
  const [isAlertConf, setisAlertConf] = useState(false);
  const [messageConf, setmessageConf] = useState("");
  const [statusConf, setstatusConf] = useState(200);
  const [bestPost, setbestPost] = useState([]);
  const [worstPost, setworstPost] = useState([]);
  const [rated, setrated] = useState([]);

  const [userData, setuserData] = useState({});
  const [hashtags, sethashtags] = useState([]);
  const [state, setState] = useState({
    checkedA: userData.userName ? true : false,
    checkedB: userData.userMail ? true : false,
    isMailsAllowed: userData.isMailsAllowed,
    sendMailConfirmation: !userData.isMailConfirmed ? false : true,
  });
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  const handleDataChange = (event) => {
    setuserData({ ...userData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async () => {
    const result = await (
      await fetch("/api/adduserdetails", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userData.userName,
          userMail: userData.userMail,
          isMailsAllowed: state.isMailsAllowed,
          isConfirm: state.sendMailConfirmation,
          userId: user.id,
        }),
      })
    ).json();
    setmessage(result.message);
    setstatus(result.status);
    setisAlert(true);

    const isValid = validation(userData.userMail, "email");
    if (isValid === false) {
      setmessageConf("Mail confirmation failed. Please type a valid e-mail.");
      setstatusConf(400);
      setisAlertConf(true);
    }

    if (state.isConfirm === true || isValid === true) {
      let mailToConfirm = { userMail: userData.userMail };

      const confirmation = await fetch("/api/confirmmail", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mailToConfirm),
      });

      setmessageConf(confirmation.message);
      setstatusConf(confirmation.status);
      setisAlertConf(true);
    }
  };

  useEffect(() => {
    setisLoading(true);
    async function getMyProfile() {
      const result = await (
        await fetch("/api/myprofile", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: user.id }),
        })
      ).json();

      if (result) {
        setuserData(result);
        // setposts(result.posts);

        sethashtags(result.hashtags);
        // setisLoading(false);

        const ratedPosts = result.posts.filter((item) => item.rateCount > 0);
        if (ratedPosts.length > 1) {
          const bestRated = ratedPosts.sort((a, b) => b.rate - a.rate);

          const best = bestRated[0];
          const worst = bestRated[ratedPosts.length - 1];
          setbestPost(best);
          setworstPost(worst);
          setrated(ratedPosts);
          const other = difference(result.posts, ratedPosts);
          setisLoading(false);
          setposts(other);
        } else {
          setrated(ratedPosts);
          const other = difference(result.posts, ratedPosts);

          setposts(other);
          const best = ratedPosts[0];
          const worst = ratedPosts[ratedPosts.length - 1];
          setbestPost(best);
          setworstPost(worst);
          setisLoading(false);
        }
      } else {
        return;
      }
    }
    getMyProfile();
  }, [user]);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }
  return (
    <div className="component-container">
      <div className="userdata-container inline-container">
        <ChangeUserDetails
          name={userData.userName}
          mail={userData.userMail}
          allow={userData.isMailsAllowed}
          confirmed={userData.isMailConfirmed}
        />
      </div>
      <UserSummary
        totalPosts={
          rated !== [] && posts !== [] ? posts.length + rated.length : null
        }
        totalHashtags={hashtags !== [] ? hashtags.length : null}
        bestRate={bestPost !== undefined ? bestPost.rate : null}
        worstRate={worstPost !== undefined ? worstPost.rate : null}
        userRate={userData !== undefined ? userData.rate : 0}
      />

      <h2 style={{ color: "white" }}>Your Hashtags</h2>
      <HashTagSlider hashTags={hashtags} />
      <h2 style={{ color: "white" }}>Your Rated Posts</h2>
      <div style={{ width: "80%" }}>
        <div className="post-container">
          {rated.length === 0 || rated === undefined ? (
            <div style={{ color: "white" }}>
              None of your posts has been rated yet.
            </div>
          ) : (
            rated.map((item) => <Posts post={item} />)
          )}
        </div>
        <h2 style={{ color: "white" }}>Your Unrated Posts</h2>
        <div className="post-container">
          {posts === [] || posts.length === 0 ? (
            <div style={{ color: "white" }}>
              You do not have any unrated posts.
            </div>
          ) : (
            posts.map((item) => <Posts post={item} />)
          )}
        </div>
      </div>
      <AlertDisplayer open={isAlert} message={message} status={status} />
      <AlertDisplayer
        open={isAlertConf}
        message={messageConf}
        status={statusConf}
      />
    </div>
  );
};

export default Profile;
