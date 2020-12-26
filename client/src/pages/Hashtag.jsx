import React, { useState, useEffect } from "react";

import Posts from "../components/Posts";
import HashTagSlider from "../components/HashTagSlider";

export const Hashtag = (props) => {
  const [message, setmessage] = useState("");
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
      <div className="post-container">
        {posts === [] ? (
          <div>Loading...</div>
        ) : (
          posts.map((item) => <Posts post={item} />)
        )}
      </div>
      <h2>Related Hashtags</h2>
      <HashTagSlider hashTags={hashtags} />
    </div>
  );
};

export default Hashtag;