import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import validation from "../tools/validation";
import hashTagConverter from "../tools/hashTagConverter";
import BackspaceIcon from "@material-ui/icons/Backspace";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CircularProgress from "@material-ui/core/CircularProgress";
import CancelIcon from "@material-ui/icons/Cancel";
import WarningIcon from "@material-ui/icons/Warning";
import Tooltip from "@material-ui/core/Tooltip";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateMessage(props) {
  const [open, setOpen] = useState(props.isOpen);
  const [step, setstep] = useState(1);
  const [hashtags, sethashtags] = useState([]);
  const [hashtagsToShow, sethashtagsToShow] = useState([]);
  const [message, setmessage] = useState("");
  const [resStatus, setresStatus] = useState(200);
  const [isName, setisName] = useState("");
  const [isMail, setisMail] = useState("");
  const [isLoading, setisLoading] = useState("");
  const [userName, setuserName] = useState("");
  const [userMail, setuserMail] = useState("");
  const [isMailValid, setisMailValid] = useState("");
  const [isInfoLoading, setisInfoLoading] = useState("");
  const [isInfoNeeded, setisInfoNeeded] = useState(false);
  const [infoResStatus, setinfoResStatus] = useState(200);
  const [resMessage, setresMessage] = useState("");
  const [infoResMessage, setinfoResMessage] = useState("");

  const style = !isMailValid ? "4px solid red" : "4px solid green";

  const [header, setheader] = useState("Create a message!");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleUserInfoSubmit = async () => {
    setisInfoLoading(true);
    const data = {
      userName: isName === false ? userName : undefined,
      userMail: isMail === false ? userMail : undefined,
    };
    if (isMailValid === false) {
      window.alert("Please type a valid e-mail.");
    }

    const result = await (
      await fetch("http://localhost:4000/adduserdetails", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
    ).json();
    if (result.message) {
      setinfoResMessage(result.message);
    }
    if (result.status === 200) {
      setisInfoNeeded(false);
    }
    setisInfoLoading(false);
    if (result.userMail) {
      fetch("http://localhost:4000/confirmmail", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: result.userMail,
      });
    }
  };

  const handleMailChange = (e) => {
    const mail = e.target.value;
    const isValid = validation(mail, "email");
    if (isValid === true) {
      setisMailValid(true);
      setuserMail(mail);
    } else {
      setuserMail(mail);
      setisMailValid(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (message === "" || message.length < 30) {
      window.alert("Message should contain atleast 30 characters. ");
      return;
    }
    setisLoading(true);
    setstep(2);
    const data = {
      message,
      hashtags,
    };
    const result = await (
      await fetch("http://localhost:4000/sendmessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message,
          hashtags,
        }),
      })
    ).json();
    setisName(result.userName);
    setisMail(result.userMail);
    if (isName === false || isMail === false) {
      setisInfoNeeded(true);
    }

    if (result.message) {
      setresMessage(result.message);
    }
    setisLoading(false);
  };

  const handleTagChange = (e) => {
    const tag = e.target.value;
    const tagsArr = tag.split(/,| /);
    if (tagsArr.length < 4) {
      sethashtags(tagsArr);
      const showArr = tagsArr.map((item) => hashTagConverter(item, "pound"));
      sethashtagsToShow(showArr);
    } else {
      window.alert("You can only choose 3 hashtags.");
    }
  };

  const handleCancel = () => {
    setstep(1);
    setheader("Create a message!");
    sethashtags([]);
    setmessage("");
    setuserName("");
    setuserMail("");
    setisMailValid("");
    setOpen(false);
    sethashtagsToShow([]);
  };

  const handleClearTags = () => {
    sethashtags([]);
    sethashtagsToShow([]);
  };
  return (
    <div>
      <Fab
        color="primary"
        variant="extended"
        size="medium"
        color="primary"
        aria-label="add"
        onClick={handleClickOpen}
      >
        <AddIcon /> Create New Message
      </Fab>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{header}</DialogTitle>
        {step === 1 ? (
          <div>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Type your message in, choose some hashtags and hit Create
                button!
              </DialogContentText>
              <form onSubmit={handleSubmit}>
                <textarea
                  style={{ display: "block", width: "100%", height: "auto" }}
                  autofocus="autofocus"
                  rows={10}
                  maxlength={500}
                  required="required"
                  placeholder="Please add your message here."
                  onChange={(e) => setmessage(e.target.value)}
                />
                <div
                  style={{
                    color: 500 - message.length > 470 ? "red" : "green",
                  }}
                >
                  {500 - message.length}{" "}
                  {500 - message.length > 470
                    ? "Your message should contain at least 30 characters."
                    : null}
                </div>

                <DialogContentText id="alert-dialog-slide-description">
                  You may split your hashtags by hitting spacebar or comma. You
                  can select maximum 3 hashtags.
                </DialogContentText>
                <input
                  style={{ display: "inline-block", verticalAlign: "middle" }}
                  value={hashtags}
                  id="tags"
                  type="text"
                  required="required"
                  placeholder="Please add hashtags."
                  // onKeyPress={(e) => handleKeyPress(e)}
                  onChange={(e) => handleTagChange(e)}
                />
                <BackspaceIcon
                  style={{ display: "inline-block", verticalAlign: "middle" }}
                  onClick={handleClearTags}
                />
                <div
                  style={{ display: "inline-block", verticalAlign: "middle" }}
                >
                  {hashtagsToShow.length < 1 ? (
                    "You should pick at least 1 hashtag."
                  ) : (
                    <ButtonGroup
                      size="small"
                      variant="text"
                      aria-label="text primary button group"
                    >
                      <Button>{hashtagsToShow[0]}</Button>
                      <Button>{hashtagsToShow[1]}</Button>
                      <Button>{hashtagsToShow[2]}</Button>
                    </ButtonGroup>
                  )}
                </div>
              </form>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                variant="contained"
                color="secondary"
              >
                Cancel
              </Button>
              {message === "" ||
              message.length < 30 ||
              hashtagsToShow.length < 1 ? (
                <Tooltip title="Your message should contain at least 30 characters and you should pick at least 1 hashtag.">
                  <Button variant="contained" color="primary" disabled>
                    Create
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  onClick={() => handleSubmit()}
                  variant="contained"
                  color="primary"
                >
                  Create
                </Button>
              )}
            </DialogActions>
          </div>
        ) : (
          <div>
            <div>
              {isLoading ? (
                <CircularProgress />
              ) : resStatus === 200 ? (
                <div>
                  <CheckCircleOutlineIcon style={{ color: "green" }} />{" "}
                  {resMessage}
                </div>
              ) : (
                <div>
                  <CancelIcon stlye={{ color: "red" }} /> {resMessage}
                </div>
              )}
            </div>
            <DialogContent>
              {!isInfoNeeded ? null : <WarningIcon style={{ color: "red" }} />}
              {isInfoLoading === "" ? null : isInfoLoading ? (
                <CircularProgress />
              ) : infoResStatus === 200 ? (
                <div>
                  <CheckCircleOutlineIcon style={{ color: "green" }} />{" "}
                  {infoResMessage}
                </div>
              ) : (
                <div>
                  <CancelIcon stlye={{ color: "red" }} /> {infoResMessage}
                </div>
              )}
              {isName === false ? (
                <div>
                  <DialogContentText id="alert-dialog-slide-description">
                    Without your name, your message will look a little bit dull.
                    Would you like to share your name with us?
                  </DialogContentText>

                  <input
                    type="text"
                    placeholder="Your Name"
                    onChange={(e) => setuserName(e.target.value)}
                  />
                </div>
              ) : (
                <DialogContentText id="alert-dialog-slide-description">
                  Dear {isName},{" "}
                  {resStatus === 200
                    ? "your message sent successfully."
                    : "we are sorry for inconvenience but create message process is failed."}
                </DialogContentText>
              )}

              {isMail === false ? (
                <div>
                  <DialogContentText id="alert-dialog-slide-description">
                    If you register your mail, you can reach your account on
                    every device. If you don't there is no way to reach your
                    account once you clear browser cookies.
                  </DialogContentText>
                  <input
                    type="email"
                    placeholder="Your Email"
                    onChange={(e) => handleMailChange(e)}
                    value={userMail}
                    style={{ border: style }}
                  />
                </div>
              ) : null}
            </DialogContent>
            <DialogActions>
              {isInfoNeeded ? (
                <Button
                  onClick={handleCancel}
                  variant="contained"
                  color="secondary"
                >
                  Not now!
                </Button>
              ) : null}
              {isInfoNeeded ? (
                <Button
                  onClick={() => handleUserInfoSubmit()}
                  variant="contained"
                  color="primary"
                >
                  Save
                </Button>
              ) : (
                <Button
                  onClick={handleCancel}
                  variant="contained"
                  color="primary"
                >
                  OK
                </Button>
              )}
            </DialogActions>
          </div>
        )}
      </Dialog>
    </div>
  );
}
