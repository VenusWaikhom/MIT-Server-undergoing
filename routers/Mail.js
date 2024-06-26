const express = require("express");
const Auth = require("../middleware/auth");

const Mail = require("../model/mail");

const router = new express.Router();

router.post("/SendMail", async (req, res) => {
  console.log("Send Mail Hit ", req.body);
  const mail = new Mail(req.body);
  try {
    await mail.save();
    res.status(201).send({ error: "Success" });
  } catch (error) {
    res.status(400).send({ error: "Error In Sending Mail" });
  }
});

router.get("/GetMails", async (req, res) => {
  try {
    let mails = [];
    mails = await Mail.find({}).sort({ _id: -1 });
    res.status(201).send(mails);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/DeleteMail/:_id", Auth, async (req, res) => {
  console.log("Delete Mail API Hit!!!");
  try {
    const deletemail = await Mail.findOneAndDelete({ _id: req.params._id });
    if (deletemail) {
      return res.send({ error: "Mail Deleted" });
    }
  } catch (error) {
    res.status(400).send({ error: "Mail Delete Failed" });
  }
});

module.exports = router;
