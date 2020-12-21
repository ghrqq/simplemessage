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

const PostFooter = () => {
  return (
    <div>
      <EmailShareButton subject="Check this Mssngr post!">
        <EmailIcon size={32} round />
      </EmailShareButton>
      <FacebookShareButton url="https://github.com">
        {" "}
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <LinkedinShareButton>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
      <TwitterShareButton url="https://github.com">
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <WhatsappShareButton>
        <WhatsappIcon size={32} round />{" "}
      </WhatsappShareButton>
      <WorkplaceShareButton>
        <WorkplaceIcon size={32} round />
      </WorkplaceShareButton>
    </div>
  );
};

export default PostFooter;
