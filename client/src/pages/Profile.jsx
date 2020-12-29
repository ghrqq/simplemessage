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
      await fetch("http://localhost:4000/adduserdetails", {
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

      const confirmation = await fetch("http://localhost:4000/confirmmail", {
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
        <ChangeUserDetails
          name={userData.userName}
          mail={userData.userMail}
          allow={userData.isMailsAllowed}
          confirmed={userData.isMailConfirmed}
        />
        {/* <table>
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
                checked={userData.isMailsAllowed}
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Save Changes
              </Button>
            </td>
          </tr>
        </table> */}
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
