import React, { useState, useEffect, useContext } from "react";
import { InputSwitch } from "primereact/inputswitch";
import { UserContext } from "../App";
import { InputText } from "primereact/inputtext";
import validation from "../tools/validation";
import AlertDisplayer from "./AlertDisplayer";

import { Button } from "primereact/button";

const ChangeUserDetails = (props) => {
  // const {userName, userMail, isMailsAllowed, isMailConfirmed, isAgreed, lang} = props;

  const [user] = useContext(UserContext);
  const [userName, setuserName] = useState("");
  const [userMail, setuserMail] = useState("");
  const [isMailValid, setisMailValid] = useState("");
  const [isMailsAllowed, setisMailsAllowed] = useState(
    props.allow == true ? true : false
  );
  const [isConfirm, setisConfirm] = useState("");
  // Switches
  const [editName, seteditName] = useState(props.name !== "" ? false : true);
  const [editMail, seteditMail] = useState(props.mail !== "" ? false : true);
  const [allowMails, setallowMails] = useState(
    props.allow === true ? false : true
  );
  const [confirmMail, setconfirmMail] = useState(
    props.confirmed ? true : false
  );

  // Alert Box Display
  const [isAlert, setisAlert] = useState(false);
  const [message, setmessage] = useState("");
  const [status, setstatus] = useState(200);
  const [isAlertConf, setisAlertConf] = useState(false);
  const [messageConf, setmessageConf] = useState("");
  const [statusConf, setstatusConf] = useState(200);

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

  const handleSubmit = async () => {
    const result = await (
      await fetch("http://localhost:4000/adduserdetails", {
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

    if (isConfirm === true || isMailValid === true) {
      let mailToConfirm = { userMail: userMail };

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

  return (
    <div className="userdata-container inline-container">
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
                tooltip="Your Name"
              />
            ) : (
              <InputText
                type="text"
                value={userName}
                disabled
                placeholder={props.name}
                tooltip="Switch the button to change your name! =>"
              />
            )}
          </td>
          <td>
            {" "}
            <InputSwitch
              checked={editName}
              onChange={(e) => seteditName(e.value)}
              tooltip="Change name?"
            />
          </td>
        </tr>
        <tr>
          <td> Your Mail :</td>
          <td>
            {editMail ? (
              <InputText
                type="text"
                value={userMail}
                onChange={(e) => handleMailChange(e)}
                keyfilter="email"
                validateOnly={true}
                placeholder={props.mail}
                tooltip="Your Mail"
                className={isMailValid === false ? "p-invalid p-d-block" : null}
              />
            ) : (
              <InputText
                type="text"
                value={userMail}
                className={isMailValid === false ? "p-invalid p-d-block" : null}
                disabled
                placeholder={props.mail}
                tooltip="Switch the button to change your mail! =>"
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
            <InputSwitch
              checked={editMail}
              onChange={(e) => seteditMail(e.value)}
              tooltip="Change mail?"
            />
          </td>
        </tr>
        <tr>
          <td>Allow occasional mails?</td>
          <td>
            {props.allow ? "Currently allowed." : "Currently not allowed."}
          </td>
          <td>
            <InputSwitch
              checked={allowMails}
              onChange={(e) => setallowMails(e.value)}
              tooltip="Allow mails?"
              fuck={allowMails}
            />
          </td>
          <td>
            {allowMails
              ? "You will get mails."
              : "You are not going to get mails."}
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
            {props.confirmed ? (
              <InputSwitch
                checked={true}
                onChange={(e) => setisConfirm(e.value)}
                tooltip="Your mail is confirmed, already."
                disabled
              />
            ) : (
              <InputSwitch
                checked={isConfirm}
                onChange={(e) => setisConfirm(e.value)}
                tooltip="Confirm mail?"
              />
            )}
          </td>
          <td>
            {props.confirmed
              ? null
              : isConfirm
              ? "You will get a confirmation mail. Please check your inbox after you save changes."
              : "You do not have to confirm your mail address but, if you clear your cookies, there is no way to reach your account again. Ever."}
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <Button label="Cancel" className="p-button-danger" />
          </td>
          <td>
            {!isConfirm ? (
              <Button onClick={handleSubmit} label="Save" />
            ) : isMailValid !== false ? (
              <Button onClick={handleSubmit} label="Save" />
            ) : (
              <Button disabled tooltip="Invalid mail address." label="Save" />
            )}
          </td>
        </tr>
      </table>
      <AlertDisplayer open={isAlert} message={message} status={status} />
      <AlertDisplayer
        open={isAlertConf}
        message={messageConf}
        status={statusConf}
      />
    </div>
  );
};

export default ChangeUserDetails;
