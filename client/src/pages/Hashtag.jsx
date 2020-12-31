import React, { useState, useEffect } from "react";

import Posts from "../components/Posts";
import HashTagSlider from "../components/HashTagSlider";
import AlertDisplayer from "../components/AlertDisplayer";

export const Hashtag = (props) => {
  const [isAlert, setisAlert] = useState(false);
  const [message, setmessage] = useState("");
  const [status, setstatus] = useState(200);
  const [posts, setposts] = useState([]);
  const [hashtags, sethashtags] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    async function getPostsByHashtag() {
      const result = await (
        await fetch(`http://localhost:4000/getbyhashtag/${props.tagpercent}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();

      if (result.message) {
        setmessage(result.message);
        setstatus(result.status);
        setisAlert(true);
        setisLoading(false);
      }
      setposts(result.posts);
      sethashtags(result.hashtags);
      setisLoading(false);
    }
    getPostsByHashtag();
  }, [props]);

  return (
    <div className="component-container">
      <h2>Related Hashtags</h2>
      <HashTagSlider hashTags={hashtags} />
      <div className="post-container">
        {posts === [] ? (
          <div>Loading...</div>
        ) : (
          posts.map((item) => <Posts post={item} />)
        )}
      </div>
      <AlertDisplayer message={message} status={status} open={isAlert} />
    </div>
  );
};

export default Hashtag;
