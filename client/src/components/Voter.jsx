import React, { useState, useContext } from "react";
import { UserContext } from "../App";

const Voter = (props) => {
  const [user] = useContext(UserContext);

  const [rate, setrate] = useState(0);

  const sendRate = async () => {
    const data = {
      postid: props.postId,
      rate,
      postCreatorId: props.creatorId,
      userIp: user.userIp,
    };
    console.log(data);
    const result = await (
      await fetch("http://localhost:4000/ratemessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })
    ).json();

    window.alert(JSON.stringify(result));
  };

  return (
    <div>
      <input
        type="range"
        min="-5"
        max="5"
        value={rate}
        onChange={(e) => setrate(e.target.value)}
        step="1"
      />
      <button onClick={() => sendRate()}>Rate!</button>
      {/* {console.log("user.id: ", user.id, "user.ip: ", user.userIp)} */}
    </div>
  );
};

export default Voter;
