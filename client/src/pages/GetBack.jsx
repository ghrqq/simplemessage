import React, { useState, useContext } from "react";
import { InputText } from "primereact/inputtext";
import validation from "../tools/validation";
import AlertDisplayer from "../components/AlertDisplayer";
import { navigate } from "@reach/router";
import { RefreshContext } from "../App";

import { Button } from "primereact/button";

const GetBack = () => {
  const [refresh, setrefresh] = useContext(RefreshContext);
  const [userMail, setuserMail] = useState("");
  const [code, setcode] = useState("");

  // Validation
  const [isMailValid, setisMailValid] = useState("");
  // Alert Box Display
  const [isAlert, setisAlert] = useState(false);
  const [message, setmessage] = useState("");
  const [status, setstatus] = useState("");

  const handleSubmit = async () => {
    const valid = await validation(userMail, "email");
    setisMailValid(valid);
    if (valid === true) {
      const result = await (
        await fetch("http://localhost:4000/getbackyouraccount", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mail: userMail,
          }),
        })
      ).json();

      setmessage(result.message);
      setstatus(result.status === 204 || result.status === 200 ? 200 : 400);
      setisAlert(true);
    } else {
      return;
    }
  };

  const handleCodeSubmit = async () => {
    const result = await (
      await fetch(`http://localhost:4000/confirmgetback/${code}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();

    setmessage(result.message);
    setstatus(result.status);
    setisAlert(true);
    if (result.status === 200) {
      setrefresh(refresh + 1);
    }
    navigate("/");
  };

  return (
    <div>
      <table style={{ marginTop: "3em" }}>
        <tr>
          <td>
            <InputText
              type="text"
              value={userMail}
              className={isMailValid === false ? "p-invalid p-d-block" : null}
              placeholder="Email"
              tooltip="Type your confirmed mail address."
              tooltipOptions={{ position: "left" }}
              onChange={(e) => setuserMail(e.target.value)}
            />
            <br />
            {isMailValid === false ? (
              <small id="username2-help" className="p-invalid p-d-block">
                Email is not valid!
              </small>
            ) : null}
          </td>
          <td>
            {userMail === "" ? (
              <Button disabled onClick={() => handleSubmit()} label="Save" />
            ) : (
              <Button onClick={handleSubmit} label="Save" />
            )}
          </td>
        </tr>
        {status === 200 ? (
          <tr>
            <td>
              <InputText
                type="text"
                value={code}
                placeholder="Confirmation code"
                tooltip="Type or paste confirmation code from your mail."
                tooltipOptions={{ position: "left" }}
                onChange={(e) => setcode(e.target.value)}
              />
            </td>

            <td>
              {" "}
              {code === "" ? (
                <Button
                  disabled
                  onClick={() => handleCodeSubmit()}
                  label="Save"
                />
              ) : (
                <Button onClick={handleCodeSubmit} label="Save" />
              )}
            </td>
          </tr>
        ) : null}
      </table>

      <AlertDisplayer open={isAlert} message={message} status={status} />
    </div>
  );
};

export default GetBack;
