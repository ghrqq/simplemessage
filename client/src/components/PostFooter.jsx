import React from "react";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsappIcon,
  WorkplaceIcon,
} from "react-share";

const PostFooter = ({ id, message, hashtags }) => {
  const msgSlicer = () => {
    return Math.floor(message.length / 3) + 1;
  };

  return (
    <div>
      <EmailShareButton
        openShareDialogOnClick={true}
        subject="Check this SimpleMessage post!"
        body={message}
        url={`http://localhost:3000/post/${id}`}
        seperator="&&&"
      >
        <EmailIcon size={32} round />
      </EmailShareButton>
      <FacebookShareButton
        url={`http://localhost:3000/post/${id}`}
        hashtag="#SimpleMessage"
        quote={
          message.slice(0, Math.floor(message.length / 3) + 1) +
          "... SEE THE REST IN SIMPLEMESSAGE!"
        }
      >
        {" "}
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <LinkedinShareButton
        url={`http://localhost:3000/post/${id}`}
        title="SimpleMessage Post!"
        summary={
          message.slice(0, Math.floor(message.length / 3) + 1) +
          "... SEE THE REST IN SIMPLEMESSAGE!"
        }
        source="http://localhost:3000"
      >
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
      <TwitterShareButton
        // url={`http://localhost:3000/post/${id}`}
        url="https://github.com"
        title={`Check this simple message post: ${message.slice(
          0,
          Math.floor(message.length / 3) + 1
        )} ... SEE THE REST IN SIMPLEMESSAGE!`}
        via="SimpleMessage"
        hashtags={hashtags.map((item) => item.slice(1, item.length - 1))}
        related={["SimpleMessage"]}
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <WhatsappShareButton
        url={`http://localhost:3000/post/${id}`}
        title={
          message.slice(0, Math.floor(message.length / 3) + 1) +
          "... SEE THE REST IN SIMPLEMESSAGE!"
        }
      >
        <WhatsappIcon size={32} round />{" "}
      </WhatsappShareButton>
      <WorkplaceShareButton
        url={`http://localhost:3000/post/${id}`}
        quote={
          message.slice(0, Math.floor(message.length / 3) + 1) +
          "... SEE THE REST IN SIMPLEMESSAGE!"
        }
        hashtag="#SimpleMessage"
      >
        <WorkplaceIcon size={32} round />
      </WorkplaceShareButton>
    </div>
  );
};

export default PostFooter;
