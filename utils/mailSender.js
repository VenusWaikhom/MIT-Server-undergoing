const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: "apocalyse7@gmail.com",
        pass: "hrkh nbic vhme rlfv",
      },
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: "Testing.com",
      to: email,
      subject: title,
      html: body,
    });
    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = mailSender;
