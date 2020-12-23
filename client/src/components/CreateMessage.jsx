import React, { useState, useContext } from "react";
import { UserContext } from "../App";

const CreateMessage = () => {
  const [user] = useContext(UserContext);
  const [hashtags, sethashtags] = useState([]);
  const [message, setmessage] = useState("");
  const [lang, setlang] = useState("");
  const [creatorName, setcreatorName] = useState("");
  const [creatorId, setcreatorId] = useState(user.id);
  const [creatorIp, setcreatorIp] = useState(user.userIp);
  const [creatorMail, setcreatorMail] = useState("");

  const handleSubmit = () => {};
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Please add hashtags." />
        <input type="text" placeholder="Would you like to share your name?" />
        <input type="email" placeholder="Would you like to share your email?" />
        <textarea placeholder="Please add your message here." />
      </form>
    </div>
  );
};

export default CreateMessage;
