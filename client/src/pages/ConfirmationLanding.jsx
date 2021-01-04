import React, { useEffect, useState, useContext } from "react";
import Hashtag from "./Hashtag";
import AlertDisplayer from "../components/AlertDisplayer";
import { RefreshContext } from "../App";

const ConfirmationLanding = (props) => {
  const [refresh, setrefresh] = useContext(RefreshContext);
  const [isAlert, setisAlert] = useState(false);
  const [message, setmessage] = useState("");
  const [status, setstatus] = useState(200);
  const [isConfirmedYet, setisConfirmedYet] = useState(false);

  useEffect(() => {
    async function Confirm() {
      if (props.code.length < 10) {
        const result = await (
          await fetch(`http://localhost:4000/confirmgetback/${props.code}`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          })
        ).json();
        if (!result.message) {
          setmessage("Something went wrong. Please try again.");
          isConfirmedYet(!isConfirmedYet);
        }
        setmessage(result.message);
        setstatus(result.status);
        setisAlert(true);
        setisConfirmedYet(true);
        if (result.status === 200) {
          setrefresh(refresh + 1);
        }
      } else {
        const result = await (
          await fetch(`http://localhost:4000/confirmation/${props.code}`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          })
        ).json();
        if (!result.message) {
          setmessage("Something went wrong. Please try again.");
          setisConfirmedYet(!isConfirmedYet);
        }
        setmessage(result.message);
        setstatus(result.status);
        setisAlert(true);
        setisConfirmedYet(true);
      }
    }
    Confirm();
  }, []);

  return (
    <div style={{ color: "white", fontSize: "2em" }}>
      {!isConfirmedYet
        ? "Please be patient. While we process your request you may check latest messages below!"
        : message}

      {/* <Hashtag tagpercent="%23test" /> */}
      <AlertDisplayer message={message} status={status} open={isAlert} />
    </div>
  );
};

export default ConfirmationLanding;
