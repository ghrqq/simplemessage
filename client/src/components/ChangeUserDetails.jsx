import React, { useState, useEffect, useContext } from "react";
import { InputSwitch } from "primereact/inputswitch";
import { UserContext } from "../App";
import { InputText } from "primereact/inputtext";
import validation from "../tools/validation";
import AlertDisplayer from "./AlertDisplayer";

import { Button } from "primereact/button";

const ChangeUserDetails = (props) => {
  const [user, setuser] = useContext(UserContext);
  const [userName, setuserName] = useState(props.name ? props.name : "");
  const [userMail, setuserMail] = useState(props.mail ? props.mail : "");
  const [isMailValid, setisMailValid] = useState("");
  const [isMailsAllowed, setisMailsAllowed] = useState(
    props.allow == true ? true : false
  );
  const [isConfirm, setisConfirm] = useState("");
  // Switches
  const [editName, seteditName] = useState(props.name !== "" ? false : true);
  const [editMail, seteditMail] = useState(props.mail !== "" ? false : true);
  const [allowMails, setallowMails] = useState(
    props.allow === true ? true : false
  );
  const [confirmMail, setconfirmMail] = useState(
    props.confirmed ? true : false
  );

  // Alert Box Display
  const [isAlert, setisAlert] = useState(false);
  const [message, setmessage] = useState("");
  const [status, setstatus] = useState(200);

  const handleSubmit = async () => {
    if (isConfirm === true) {
      const valid = await validation(userMail, "email");

      setisMailValid(valid);
      if (valid !== true) {
        setmessage("You have to type a valid e-mail to confirm your mail.");
        setstatus(400);
        setisAlert(true);
        return;
      }
    }

    const result = await (
      await fetch("/api/adduserdetails", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          userMail,
          isMailsAllowed: allowMails,
          isConfirm: isConfirm,
          userId: user.id,
        }),
      })
    ).json();
    setmessage(result.message);
    setstatus(result.status);
    setisAlert(true);
    // setuser({ userName: userName });
  };

  const handleCancel = () => {
    setuserName(props.name ? props.name : "");
    seteditName(props.name !== "" ? false : true);
    setuserMail(props.mail ? props.mail : "");
    setisMailValid("");
    setisConfirm("");
    seteditMail(props.mail !== "" ? false : true);
    setallowMails(props.allow === true ? false : true);
    return;
  };

  return (
    <div
      className="userdata-container inline-container"
      style={{ color: "white" }}
    >
      <table>
        <tr>
          <th></th>
          <th>Value</th>
          <th>Edit</th>
        </tr>
        <tr>
          <td> Your Name :</td>
          <td>
            {editName ? (
              <InputText
                type="text"
                value={userName}
                onChange={(e) => setuserName(e.target.value)}
                placeholder={props.name}
              />
            ) : (
              <InputText
                type="text"
                value={userName}
                disabled
                placeholder={props.name}
              />
            )}
          </td>
          <td>
            {editName === false ? (
              <Button
                className="p-button-warning"
                onClick={(e) => seteditName(!editName)}
              >
                Edit
              </Button>
            ) : (
              <Button
                className="p-button-primary"
                onClick={(e) => seteditName(!editName)}
              >
                Lock
              </Button>
            )}
          </td>
        </tr>
        <tr>
          <td> Your Mail :</td>
          <td>
            {editMail ? (
              <InputText
                type="text"
                value={userMail}
                onChange={(e) => setuserMail(e.target.value)}
                // keyfilter="email"
                // validateOnly={true}
                placeholder={props.mail}
                className={isMailValid === false ? "p-invalid p-d-block" : null}
              />
            ) : (
              <InputText
                type="text"
                value={userMail}
                className={isMailValid === false ? "p-invalid p-d-block" : null}
                disabled
                placeholder={props.mail}
              />
            )}
            <br />
            {isMailValid === false ? (
              <small id="username2-help" className="p-invalid p-d-block">
                Email is not valid!
              </small>
            ) : null}
          </td>
          <td>
            {" "}
            {editMail === false ? (
              <Button
                className="p-button-warning"
                onClick={(e) => seteditMail(!editMail)}
              >
                Edit
              </Button>
            ) : (
              <Button
                className="p-button-primary"
                onClick={(e) => seteditMail(!editMail)}
              >
                Lock
              </Button>
            )}
          </td>
        </tr>
        <tr>
          <td>Allow occasional mails?</td>
          <td>
            {props.allow ? "Currently allowed." : "Currently not allowed."}
          </td>
          <td>
            {allowMails === false ? (
              <Button
                className="p-button-warning"
                onClick={(e) => setallowMails(!allowMails)}
              >
                Allow
              </Button>
            ) : (
              <Button
                className="p-button-danger"
                onClick={(e) => setallowMails(!allowMails)}
              >
                Do not allow
              </Button>
            )}
          </td>
        </tr>
        <tr>
          <td>Is your mail confirmed?</td>
          <td>
            {props.confirmed
              ? "Your mail is confirmed."
              : "Your mail is not confirmed"}
          </td>
          <td>
            {props.confirmed === true ? (
              <Button className="p-button-primary" disabled>
                Confirmed
              </Button>
            ) : isConfirm === true ? (
              <Button
                className="p-button-warning"
                onClick={(e) => setisConfirm(!isConfirm)}
              >
                Confirm
              </Button>
            ) : (
              <Button
                className="p-button-danger"
                onClick={(e) => setisConfirm(!isConfirm)}
              >
                Do not confirm
              </Button>
            )}
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <Button
              label="Cancel"
              onClick={handleCancel}
              className="p-button-danger"
            />
          </td>
          <td>
            <Button onClick={() => handleSubmit()} label="Save" />
          </td>
        </tr>
      </table>
      <AlertDisplayer open={isAlert} message={message} status={status} />
    </div>
  );
};

export default ChangeUserDetails;
