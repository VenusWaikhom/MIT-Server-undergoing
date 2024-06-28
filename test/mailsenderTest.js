const mailSender = require("../utils/mailSender");
const otpGen = require("otp-generator");

const otpToken = otpGen.generate(8, { specialChars: false });

mailSender(
	"TEST OTP",
	`<h1>Please confirm your OTP</h1>
       <p>Here is your OTP code: ${otpToken}</p>`,
)
	.then((d) => console.log(d))
	.catch((err) => console.error(err));
