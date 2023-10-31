const transporter = require("nodemailer").createTransport({
  service: "gmail",
  host: "smtp.forwardemail.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});
((email) => {
    email.sendEmail = async (data) => {
    try {

      const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.MYEMAIL,
        subject: data.subject || data.name || "",
        html: `<pre>${data.message} <br/><br/> ${data.name}<br/> ${data.contact} <br/> ${data.email }</pre>`, // html body
      };
      // send mail with defined transport object
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      return error;
        console.log("-----------",error)
    }
  };
})(module.exports);
