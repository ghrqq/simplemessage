import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";

const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

export default function FAQ(props) {
  const [expanded, setExpanded] = React.useState(props.panel || "panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div style={{ width: "70%" }}>
      <Accordion
        square
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>What is this page about?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            This is a super cool and unmonitored way to send and read random
            messages to other people anonymously. You may click the hashtags to
            read messages and simply click the "Create New Message" to send a
            new message.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>Register/Login/Password</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            These are three words you won't see anywhere on this site. You do
            not need to do anything to discover hashtags randomly and read
            messages of other people. If you want to send a message, simply
            click the "Create New Message" button and send it right away. That
            click will register you and store a token on your browser. If you
            want to share your name with others, you may fill the form after
            sending your first message. If you add your email we will send you a
            confirmation mail and promise you we won't sell your data to anyone.
            You do not need to confirm your email by any means but in this case,
            once you clear cookies from your browser, there is no way you can
            access your account again.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>How to get my account back?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            If you want to reach your account from a new device or browser, you
            may click here. This link will get you a form which is asking your
            email address. If you have already confirmed your email, we will
            send you a mail with a link. Choose your device or browser carefully
            and click that link. This will set a new cookie on your new device
            and you are ready to go.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
          <Typography>How to delete my account?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            You may simply clear your cookies and if you did not confirm your
            email address there would be no way to reach your account again. Our
            database clears inactive accounts regularly. If you have confirmed
            your email, just do the same.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        expanded={expanded === "panel5"}
        onChange={handleChange("panel5")}
      >
        <AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
          <Typography>Which personal data do you store?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            If you consent to share with us, we save your name and email to our
            database. We use cookies to link your account to your browser. These
            cookies are not collecting any data from your browser. We use your
            IPV4 address in order to provide some accuracy with our rating
            system. When you vote, your IPV4 is anonymously stored in our
            database. That's it.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
