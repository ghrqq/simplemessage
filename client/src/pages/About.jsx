import React from "react";

const About = () => {
  return (
    <div
      style={{
        width: "90%",
        color: "white",
        padding: "2em",
        textJustify: "justify",
        margin: "0 auto",
      }}
    >
      <h3>This app has been created only for fun. </h3>
      <p>
        It may contain some copied messages or just messages that you or anyone
        would not like. It's ok. Just chill and try to enjoy or just click the
        "X" button on the top corner.
      </p>
      <p>This app is definitely not a twitter clone.</p>
      <p>I may or may not improve some featues in the future. No promises.</p>
      <p>
        Advertisements on this app are{" "}
        <a href="http://twitter.com/theoozdev" target="_blank">
          placed by me
        </a>{" "}
        without any kind of acknowledge or consent of the people or
        organisations advertised. If you are one of the advertiseds, and you do
        not want to be seen here, just{" "}
        <a href="mailto: theoozdev@gmail.com">send a mail</a> and I will remove
        the advertisements. (Do the same thing if you want another image or
        description to be used.)
      </p>
      <p>
        Complete source of this app may be{" "}
        <a href="http://github.com/ghrqq" target="_blank">
          found here
        </a>{" "}
        and may be used for all purposes. Nothing is required to use the source
        code by anymeans. Also, feel free to make pull requests and create
        issues.{" "}
      </p>
      <h3>Features & Explanations</h3>
      <ul>
        <li>
          This app is created mainly for not mobile devices and some features
          might not work properly(e.g. hoovers and etc)
        </li>
        <li>
          User authentication is based on cookies. When you try to create a
          message and click the accept the terms & conditions checbox, you will
          get a unique user ID and if you like, you may add your details such as
          email and user name.
        </li>
        <li>
          If you confirm your mail, you can reach your account on any device
          with a simple mail confirmation. If you do not confirm your mail, once
          you clear cookies from your browser, there is no coming back but, you
          may always create new account.
        </li>
        <li>
          Advertisements might be annoying, especially on mobile devices,
          because they are spliced between posts randomly. If you do not like
          the order of ads, just refresh the page.{" "}
        </li>
      </ul>
      <h3>Contact</h3>
      <p>I encourage you to get in touch with me for any reasons via: </p>
      <ol>
        <li>
          {" "}
          <a href="mailto: theoozdev@gmail.com">E-Mail</a>{" "}
        </li>
        <li>
          <a href="http://twitter.com/theoozdev" target="_blank">
            {" "}
            Twitter{" "}
          </a>
        </li>
        <li>
          <a href="http://github.com/ghrqq" target="_blank">
            Github
          </a>
        </li>
        <li>Or just send a message to the #Theo hashtag. </li>
      </ol>
      <p>Bear in mind that no rights are reserved.</p>
      <p>Theo, 2021</p>
    </div>
  );
};

export default About;
