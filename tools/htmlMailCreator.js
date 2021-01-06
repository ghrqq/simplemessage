const htmlMailCreator = (code, name, mail, route, type) => {
  if (type === "getback") {
    return {
      from: process.env.mailSender, // Sender address
      to: mail, // List of recipients
      subject: "Get back your simple message account!", // Subject line
      text: `Dear ${name}, you may click the link below or type the code manually to the input on the page. Please bear in mind that if you choose to click the link, this will redirect you to the confirmation page and that page will set a cookie to the browser. If you would like to reach your account from another browser, you may copy the link and paste it in your choice of browser. Your code is: ${code}
        \n
        Your link is: \n
         http://localhost:4000/confirmation/${code}`, // Plain text body
      html: `<html>
        <div style=\"margin: 0 auto;\" >
        <p style=\"text-justify: justify; padding: 1em; margin: 0 auto;\" > Dear ${name}, you may click the link below or type the code manually to the input on the page. Please bear in mind that if you choose to click the link, this will redirect you to the confirmation page and that page will set a cookie to the browser. If you would like to reach your account from another browser, you may copy the link and paste it in your choice of browser. </p>
        </div>
        <div>
        <div style=\"display: block; background-color: #47d147; cursor: text; color: $fff; border-radius: 20px; margin: 0 auto; padding: 1em;\"> ${code} </div>
        </div>
        <div> 
        <a style=\"text-decoration: none; color: #FFF; font-size: 20px; cursor: pointer; \"  href=\"${route}/${code} \">  <button style=\" display: block; background-color: #0066ff; cursor: pointer; color: #fff; border-radius: 20px; margin: 0 auto; padding: 2em;  \">Click here to set your account on this or preferred browser.  </button></a>
        <div style=\"margin: 0 auto; display: block;\" > <textarea style=\"background-color: lightgray; display:block; margin: 1em auto; padding: 5px; resize: none;\" rows=\"15\" cols=\"30\"; readonly > ${route}/${code} </textarea></div>
        </div>
        
        </html>`,
    };
  }

  if (type === "mailconfirm") {
    return {
      from: process.env.mailSender, // Sender address
      to: mail, // List of recipients
      subject: "Please confirm your mail for Simple Message!", // Subject line
      text: ` Dear ${name}, you may click the button below to confirm your mail address. You DO NOT have to confirm your mail to enjoy full features of simple message, but as confirming your mail allows you to reach your account from any device and browser, we recommend it. Have a great day! 
      \n
        Your link is: \n
         http://localhost:4000/confirmation/${code}`, // Plain text body
      html: `<html>
        <div style=\"margin: 0 auto;\" >
        <p style=\"text-justify: justify; padding: 1em; margin: 0 auto;\" > Dear ${name}, you may click the button below to confirm your mail address. You DO NOT have to confirm your mail to enjoy full features of simple message, but as confirming your mail allows you to reach your account from any device and browser, we recommend it. Have a great day! </p>
        </div>
        
        <div> 
        <a style=\"text-decoration: none; color: #FFF; font-size: 20px; cursor: pointer; \"  href=\"${route}/${code} \">  <button style=\" display: block; background-color: #0066ff; cursor: pointer; color: #fff; border-radius: 20px; margin: 0 auto; padding: 2em;  \">Click here to confirm your mail. </button></a>
        <div style=\"margin: 0 auto; display: block;\" > <textarea style=\"background-color: lightgray; display:block; margin: 1em auto; padding: 5px; resize: none;\" rows=\"15\" cols=\"30\"; readonly > ${route}/${code} </textarea></div>
        </div>
        
        </html>`,
    };
  } else {
    return {
      from: process.env.mailSender, // Sender address
      to: mail, // List of recipients
      subject: "Simple message has a message for you!", // Subject line
      text: ` Dear ${name}, our server has no idea why this mail has been sent to you. If you see a confirmation code below, feel free to click the button because probably you have tried to confirm your mail or reach your account again. If not, please ignore this mail and accept our apoligy. 
    \n
      Your link is: \n
       http://localhost:4000/confirmation/${code}`, // Plain text body
      html: `<html>
        <div style=\"margin: 0 auto;\" >
        <p style=\"text-justify: justify; padding: 1em; margin: 0 auto;\" > Dear ${name}, our server has no idea why this mail has been sent to you. If you see a confirmation code below, feel free to click the button because probably you have tried to confirm your mail or reach your account again. If not, please ignore this mail and accept our apoligy.</p>
        </div>
        
        <div> 
        <a style=\"text-decoration: none; color: #FFF; font-size: 20px; cursor: pointer; \"  href=\"${route}/${code} \">  <button style=\" display: block; background-color: #0066ff; cursor: pointer; color: #fff; border-radius: 20px; margin: 0 auto; padding: 2em;  \">Click here to set your account on this or preferred browser.  </button></a>
        <div style=\"margin: 0 auto; display: block;\" > <textarea style=\"background-color: lightgray; display:block; margin: 1em auto; padding: 5px; resize: none;\" rows=\"15\" cols=\"30\"; readonly > ${route}/${code} </textarea></div>
        </div>
        
        </html>`,
    };
  }
};

module.exports = {
  htmlMailCreator,
};
