import React, { useEffect, useState } from "react";
import Posts from "../components/Posts";
import HashTagSlider from "../components/HashTagSlider";
import adSplicer from "../tools/adSplicerGenImported";

const UserMessages = (props) => {
  const [message, setmessage] = useState("");
  const [posts, setposts] = useState([]);
  const [hashtags, sethashtags] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    async function getUserPosts() {
      const result = await (
        await fetch(`/api/getuserposts/${props.id}`, {
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
      // setposts(result.posts);
      // sethashtags(result.hashtags);
      // setisLoading(false);
      let shadow = [...result.posts];
      const adsSplicedPosts = await adSplicer(shadow, result.posts.length, 5);
      setposts(adsSplicedPosts);
      sethashtags(result.hashtags);
      setisLoading(false);
    }
    getUserPosts();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="component-container" style={{ color: "white" }}>
      <div style={{ marginBottom: "1em" }}>
        <h2>Users Hashtags</h2>
        <HashTagSlider hashTags={hashtags} />
      </div>
      <div className="post-container">
        {posts === [] ? (
          <div>Loading...</div>
        ) : (
          posts.map((item) => <Posts post={item} />)
        )}
      </div>
    </div>
  );
};

export default UserMessages;
