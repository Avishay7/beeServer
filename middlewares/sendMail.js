const nodemailer = require("nodemailer");
require("dotenv").config();

//Email sending function
module.exports = async (email, subject, text) => {
  // initialize and define the mode of transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "shlomosh1999@gmail.com", // Gmail address
      pass: "fhox jwuw fkcm jsqy", // Gmail password
    },
  });

  // Set up email data
  const mailOptions = {
    from: "shlomosh1999@gmail.com", 
    to: email,
    subject: subject,
    text: text,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error("Error:", error);
    }
    console.log(" The message with code : " + text + " sent to : " + email);
  });
};