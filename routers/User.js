const express = require("express");
const Auth = require("../middleware/auth");
const User = require("../model/user");
const otpGenerator = require("otp-generator");
const OTP = require("../model/otpModel");

const router = new express.Router();

router.post("/vendorusers/signup", async (req, res) => {
  console.log("HIT", req.body);
  try {
    const varify = await User.findOne({ email: req.body.email });
    console.log(varify);
    if (varify) {
      return res.status(400).send({ error: "Email Already Registered" });
    } else {
      const user = new User(req.body);
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
    }
  } catch (error) {
    res.status(500).send({ error: "Error In SignUp" });
  }
});

router.post("/vendoruser/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    if (!user.email || !user.password) {
      return res.send({ error: "Wrong Email Or Password" });
    }
    const token = await user.generateAuthToken();
    await user.save();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: "Error in SignIn" });
  }
});

router.post("/vendorusers/logout", Auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({ error: "LogOut SuccessFull" });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/SendOTP", async (req, res) => {
  try {
    const { email } = req.body;
    const checkUserPresent = await User.findOne({ email });
    if (!checkUserPresent) {
      return res.status(401).json({
        success: false,
        error: "User Not Available",
      });
    }
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    res.status(200).json({
      success: true,
      error: "OTP sent successfully",
      otp,
    });
    console.log(otp);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/varifyOTP", async (req, res) => {
  console.log(req.body);
  let varify = await OTP.findOne({ otp: req.body.OTP });
  console.log(varify);
  if (varify) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).send();
      }
      user["password"] = req.body["password"];
      await user.save();
      res.status(200).json({
        success: true,
        error: "Password Changed",
      });
    } catch {
      res.status(400).send(error);
    }
  } else {
    res.status(500).send({ success: false, error: "Wrong OTP" });
  }
});

module.exports = router;
