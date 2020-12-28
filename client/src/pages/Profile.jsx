import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import Posts from "../components/Posts";
import HashTagSlider from "../components/HashTagSlider";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import StarIcon from "@material-ui/icons/Star";
import AddIcon from "@material-ui/icons/Add";
import LabelIcon from "@material-ui/icons/Label";
import UserSummary from "../components/UserSummary";

const Profile = () => {
  const [user] = useContext(UserContext);
  const [isLoading, setisLoading] = useState(true);
  const [posts, setposts] = useState([]);

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

  useEffect(() => {
    async function getMyProfile() {
      const result = await (
        await fetch("http://localhost:4000/myprofile", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: user.id }),
        })
      ).json();

      setuserData(result);
      setposts(result.posts);

      sethashtags(result.hashtags);
      setisLoading(false);
    }
    getMyProfile();
  }, [user]);

  return (
    <div className="component-container">
      <div className="userdata-container inline-container">
        <table>
          <tr>
            <th></th>
            <th>Value</th>
            <th>Edit</th>
          </tr>
          <tr>
            <td>Your Name:</td>
            <td>
              <TextField
                id="standard-basic"
                disabled={!state.checkedA}
                label={
                  userData.userName ? userData.userName : "Your name is empty!"
                }
                onChange={handleDataChange}
                name="userName"
              />
            </td>
            <td>
              <Switch
                checked={state.checkedA}
                onChange={handleChange}
                name="checkedA"
                inputProps={{ "aria-label": "secondary checkbox" }}
              />
            </td>
          </tr>
          <tr>
            <td>Your Name:</td>
            <td>
              <TextField
                id="standard-basic"
                disabled={!state.checkedB}
                label={
                  userData.userMail ? userData.userMail : "Your mail is empty!"
                }
                onChange={handleDataChange}
                name="userMail"
              />
            </td>
            <td>
              <Switch
                checked={state.checkedB}
                onChange={handleChange}
                name="checkedB"
                inputProps={{ "aria-label": "secondary checkbox" }}
              />
            </td>
          </tr>
          <tr>
            <td>Allow occasional mails?</td>
            <td>{userData.isMailsAllowed ? "Allowed!" : "Not allowed!"}</td>
            <td>
              <Switch
                checked={state.isMailsAllowed}
                onChange={handleChange}
                name="isMailsAllowed"
                inputProps={{ "aria-label": "secondary checkbox" }}
              />
            </td>
            <td>{!state.isMailsAllowed ? "Not allow." : "Allow."}</td>
          </tr>
          <tr>
            <td>Is your mail address confirmed?</td>
            <td>
              {userData.isMailConfirmed ? "Confirmed!" : "Not confirmed!"}
            </td>
            <td>
              <Switch
                checked={state.sendMailConfirmation}
                onChange={handleChange}
                name="sendMailConfirmation"
                inputProps={{ "aria-label": "secondary checkbox" }}
              />
            </td>
            <td>{state.sendMailConfirmation ? "Confirm now." : "Later."}</td>
          </tr>
          <tr>
            <td></td>
            <td>
              <Button variant="contained" color="secondary" href="/">
                Cancel
              </Button>
            </td>
            <td>
              <Button variant="contained" color="primary">
                Save Changes
              </Button>
            </td>
          </tr>
        </table>
      </div>
      <UserSummary />

      <h2>Your Hashtags</h2>
      <HashTagSlider hashTags={hashtags} />
      <h2>Your Posts</h2>
      <div style={{ width: "80%" }}>
        <div className="post-container">
          {posts === [] ? (
            <div>Loading...</div>
          ) : (
            posts.map((item) => <Posts post={item} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
