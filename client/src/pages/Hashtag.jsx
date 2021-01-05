import React, { useState, useEffect } from "react";

import Posts from "../components/Posts";
import HashTagSlider from "../components/HashTagSlider";
import AlertDisplayer from "../components/AlertDisplayer";

import adSplicer from "../tools/adSplicerGenImported";

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
        await fetch(`/api/getbyhashtag/${props.tagpercent}`, {
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
      let shadow = [...result.posts];
      const adsSplicedPosts = await adSplicer(shadow, posts.length, 5);
      setposts(adsSplicedPosts);
      sethashtags(result.hashtags);
      setisLoading(false);
    }
    getPostsByHashtag();
  }, [props]);

  return (
    <div className="component-container">
      <h2 style={{ color: "white" }}>Related Hashtags</h2>
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
