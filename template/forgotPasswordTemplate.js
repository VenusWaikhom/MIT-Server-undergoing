const htmlForgotPasswordTemplate = ({ otpToken, otpTokenDuration }) => `
<h1>Please confirm your OTP</h1>
<p>Here is your OTP code: ${otpToken}</p>
<p>Code will be expired in ${otpTokenDuration}</p>
`;

module.exports = htmlForgotPasswordTemplate;
